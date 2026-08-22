const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in chat.routes.js');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const CHAT_BUCKET = 'chat-media';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Render's local filesystem is ephemeral. Files are therefore uploaded directly
// into Supabase Storage instead of /uploads/chat.
(async () => {
  try {
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      console.error('❌ Could not inspect Storage:', listError.message);
      return;
    }

    const exists = (buckets || []).some(
      (bucket) => bucket.name === CHAT_BUCKET
    );

    if (!exists) {
      const { error } = await supabase.storage.createBucket(CHAT_BUCKET, {
        public: true,
        fileSizeLimit: `${MAX_FILE_SIZE}B`,
        allowedMimeTypes: ALLOWED_TYPES
      });

      if (error &&
          !String(error.message || '').toLowerCase().includes('already exists')) {
        console.error('❌ Could not create chat-media bucket:', error.message);
      } else {
        console.log('✅ Chat media bucket ready');
      }
    } else {
      console.log('✅ Chat media bucket ready');
    }
  } catch (error) {
    console.error('❌ Chat storage initialization failed:', error);
  }
})();

const chatUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Images, videos, PDF, DOC and DOCX files are allowed.'
        ),
        false
      );
    }
  }
});

router.use(authMiddleware);

const getUserId = (req) =>
  req.user?.id || req.user?.userId || req.user?.sub || null;

const getPublicStorageUrl = (storagePath) => {
  const { data } = supabase.storage
    .from(CHAT_BUCKET)
    .getPublicUrl(storagePath);

  return data?.publicUrl || null;
};

// GET MESSAGES
router.get('/messages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        user:users(id, username, full_name),
        reactions:message_reactions(
          id,
          emoji,
          user_id,
          user:users(id, username)
        )
      `)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('❌ Error fetching messages:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET READ STATE
router.get('/read-state', async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('chat_read_states')
      .select(
        'id, user_id, last_read_message_id, last_read_at, updated_at'
      )
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      if (String(error.message || '').toLowerCase().includes('does not exist')) {
        return res.json({
          user_id: userId,
          last_read_message_id: null,
          last_read_at: null
        });
      }

      return res.status(500).json({ error: error.message });
    }

    res.json(
      data || {
        user_id: userId,
        last_read_message_id: null,
        last_read_at: null
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SAVE READ STATE
router.post('/read-state', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { messageId, createdAt } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!messageId) {
      return res.status(400).json({ error: 'messageId is required' });
    }

    const { data: message, error: messageError } = await supabase
      .from('chat_messages')
      .select('id, created_at')
      .eq('id', messageId)
      .maybeSingle();

    if (messageError) {
      return res.status(500).json({ error: messageError.message });
    }

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const { data, error } = await supabase
      .from('chat_read_states')
      .upsert(
        {
          user_id: userId,
          last_read_message_id: message.id,
          last_read_at: createdAt || message.created_at,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ success: true, readState: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SEND TEXT
router.post('/messages', async (req, res) => {
  try {
    const { content, replyTo } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        error: 'Message content is required'
      });
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        content: content.trim(),
        user_id: userId,
        reply_to: replyTo || null,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        user:users(id, username, full_name)
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SEND FILE/TEXT WITH PERSISTENT STORAGE
router.post(
  '/messages-with-file',
  chatUpload.single('file'),
  async (req, res) => {
    try {
      const { content, replyTo } = req.body;
      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if ((!content || !content.trim()) && !req.file) {
        return res.status(400).json({
          error: 'Message or file is required'
        });
      }

      let fileUrl = null;
      let storagePath = null;
      let fileType = null;
      let fileName = null;

      if (req.file) {
        const safeName = path
          .basename(req.file.originalname)
          .replace(/[^a-zA-Z0-9._-]/g, '_');

        storagePath =
          `${userId}/${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 10)}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from(CHAT_BUCKET)
          .upload(storagePath, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
            cacheControl: '31536000'
          });

        if (uploadError) {
          console.error(
            '❌ Persistent media upload failed:',
            uploadError.message
          );

          return res.status(500).json({
            error: `Media upload failed: ${uploadError.message}`
          });
        }

        fileUrl = getPublicStorageUrl(storagePath);
        fileType = req.file.mimetype;
        fileName = req.file.originalname;

        if (!fileUrl) {
          await supabase.storage
            .from(CHAT_BUCKET)
            .remove([storagePath]);

          return res.status(500).json({
            error: 'Could not create persistent media URL'
          });
        }
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          content: content?.trim() || '📎 Attachment',
          user_id: userId,
          reply_to: replyTo || null,
          file_url: fileUrl,
          file_type: fileType,
          file_name: fileName,
          created_at: new Date().toISOString()
        })
        .select(`
          *,
          user:users(id, username, full_name)
        `)
        .single();

      if (error) {
        if (storagePath) {
          await supabase.storage
            .from(CHAT_BUCKET)
            .remove([storagePath]);
        }

        return res.status(500).json({ error: error.message });
      }

      res.status(201).json(data);
    } catch (error) {
      console.error('❌ File message error:', error);
      res.status(500).json({
        error: error.message || 'Failed to send attachment'
      });
    }
  }
);

// DELETE OWN MESSAGE
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: message, error: fetchError } = await supabase
      .from('chat_messages')
      .select('id, user_id, file_url')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (String(message.user_id) !== String(userId)) {
      return res.status(403).json({
        error: 'You can only delete your own messages'
      });
    }

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Remove persistent media from Supabase Storage.
    if (
      message.file_url &&
      message.file_url.includes(
        `/storage/v1/object/public/${CHAT_BUCKET}/`
      )
    ) {
      const marker =
        `/storage/v1/object/public/${CHAT_BUCKET}/`;

      const storagePath = decodeURIComponent(
        message.file_url.split(marker)[1] || ''
      );

      if (storagePath) {
        await supabase.storage
          .from(CHAT_BUCKET)
          .remove([storagePath]);
      }
    }

    res.json({
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REACTIONS
router.post('/messages/:id/react', async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!emoji) {
      return res.status(400).json({
        error: 'Emoji is required'
      });
    }

    const { data: message, error: messageError } =
      await supabase
        .from('chat_messages')
        .select('id')
        .eq('id', id)
        .maybeSingle();

    if (messageError) {
      return res.status(500).json({
        error: messageError.message
      });
    }

    if (!message) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    const { data: existing } = await supabase
      .from('message_reactions')
      .select('id')
      .eq('message_id', id)
      .eq('user_id', userId)
      .eq('emoji', emoji)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('message_reactions')
        .delete()
        .eq('id', existing.id);

      if (error) {
        return res.status(500).json({
          error: error.message
        });
      }
    } else {
      const { error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: id,
          user_id: userId,
          emoji,
          created_at: new Date().toISOString()
        });

      if (error) {
        return res.status(500).json({
          error: error.message
        });
      }
    }

    const { data: reactions, error: reactionsError } =
      await supabase
        .from('message_reactions')
        .select(`
          id,
          emoji,
          user_id,
          user:users(id, username)
        `)
        .eq('message_id', id);

    if (reactionsError) {
      return res.status(500).json({
        error: reactionsError.message
      });
    }

    res.json({
      success: true,
      messageId: id,
      reactions: reactions || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// USER ACTIVITY
router.post('/users/active', async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    const { error } = await supabase
      .from('users')
      .update({
        last_active: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
