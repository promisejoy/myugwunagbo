const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables in chat.routes.js');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ============================================
// FILE UPLOAD CONFIGURATION
// ============================================
const chatUploadDir = path.join(__dirname, '../../uploads/chat');
if (!fs.existsSync(chatUploadDir)) {
  fs.mkdirSync(chatUploadDir, { recursive: true });
}

const chatStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, chatUploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const chatFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'video/mp4', 'video/webm', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'), false);
  }
};

const chatUpload = multer({ 
  storage: chatStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: chatFileFilter
});

// ============================================
// GET ALL CHAT MESSAGES
// ============================================
router.get('/messages', async (req, res) => {
  try {
    console.log('📤 Fetching chat messages...');
    
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        user:users(id, username, full_name)
      `)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      // If table doesn't exist, return empty array
      if (error.message && error.message.includes('does not exist')) {
        console.log('ℹ️  chat_messages table does not exist yet');
        return res.json([]);
      }
      console.error('❌ Error fetching messages:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log(`✅ Fetched ${data?.length || 0} messages`);
    res.json(data || []);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SEND A CHAT MESSAGE (WITHOUT FILE)
// ============================================
router.post('/messages', async (req, res) => {
  try {
    const { content, replyTo } = req.body;
    const userId = req.user?.id;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
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
      console.error('❌ Error sending message:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log('✅ Message sent:', data?.id);
    res.status(201).json(data);
  } catch (error) {
    console.error('❌ Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SEND A CHAT MESSAGE (WITH FILE)
// ============================================
router.post('/messages-with-file', chatUpload.single('file'), async (req, res) => {
  try {
    const { content, replyTo } = req.body;
    const userId = req.user?.id;

    if ((!content || !content.trim()) && !req.file) {
      return res.status(400).json({ error: 'Message or file is required' });
    }

    let file_url = null;
    let file_type = null;
    let file_name = null;

    if (req.file) {
      file_url = `/uploads/chat/${req.file.filename}`;
      file_type = req.file.mimetype;
      file_name = req.file.originalname;
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        content: content?.trim() || '📎 Attachment',
        user_id: userId,
        reply_to: replyTo || null,
        file_url: file_url,
        file_type: file_type,
        file_name: file_name,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        user:users(id, username, full_name)
      `)
      .single();

    if (error) {
      console.error('❌ Error sending message with file:', error);
      if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
      return res.status(500).json({ error: error.message });
    }
    
    console.log('✅ Message with file sent:', data?.id);
    res.status(201).json(data);
  } catch (error) {
    console.error('❌ Error sending message with file:', error);
    if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DELETE A CHAT MESSAGE
// ============================================
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // First, get the message to check if it has a file
    const { data: message, error: fetchError } = await supabase
      .from('chat_messages')
      .select('file_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('❌ Error fetching message:', fetchError);
      return res.status(500).json({ error: fetchError.message });
    }

    // Delete the file if it exists
    if (message?.file_url) {
      const fileName = message.file_url.replace('/uploads/chat/', '');
      const filePath = path.join(chatUploadDir, fileName);
      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      }
    }

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error deleting message:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting message:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// REACT TO A MESSAGE
// ============================================
router.post('/messages/:id/react', async (req, res) => {
  try {
    const { id } = req.params;
    const { emoji } = req.body;
    const userId = req.user?.id;

    if (!emoji) {
      return res.status(400).json({ error: 'Emoji is required' });
    }

    // Check if user already reacted
    const { data: existing, error: checkError } = await supabase
      .from('message_reactions')
      .select('*')
      .eq('message_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    let result;
    if (existing) {
      // Update existing reaction
      const { data, error } = await supabase
        .from('message_reactions')
        .update({ emoji, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Create new reaction
      const { data, error } = await supabase
        .from('message_reactions')
        .insert({
          message_id: id,
          user_id: userId,
          emoji,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }

    res.json(result);
  } catch (error) {
    console.error('❌ Error reacting to message:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// GET ONLINE USERS
// ============================================
router.get('/users/online', async (req, res) => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data, error } = await supabase
      .from('users')
      .select('id, username, full_name, last_active')
      .gte('last_active', fiveMinutesAgo)
      .limit(50);

    if (error) {
      console.error('❌ Error fetching online users:', error);
      return res.json([]);
    }
    
    res.json(data || []);
  } catch (error) {
    console.error('❌ Error fetching online users:', error);
    res.json([]);
  }
});

// ============================================
// UPDATE USER ACTIVITY
// ============================================
router.post('/users/active', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { error } = await supabase
      .from('users')
      .update({ last_active: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('❌ Error updating user activity:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error updating user activity:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;