const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, full_name, role')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Get all topics with user info and reply counts
router.get('/topics', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('forum_topics')
      .select(`
        *,
        user:users!forum_topics_user_id_fkey (id, username, full_name),
        replies:forum_replies (count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedData = data.map(topic => ({
      ...topic,
      _id: topic.id,
      user: topic.user || { username: 'Anonymous' },
      replyCount: topic.replies?.[0]?.count || 0,
      replies: undefined
    }));

    res.json(formattedData || []);
  } catch (error) {
    console.error('Get topics error:', error);
    res.json([]);
  }
});

// Get single topic with replies
router.get('/topics/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get topic with user info
    const { data: topic, error: topicError } = await supabase
      .from('forum_topics')
      .select(`
        *,
        user:users!forum_topics_user_id_fkey (id, username, full_name)
      `)
      .eq('id', id)
      .single();

    if (topicError) throw topicError;

    // Get replies with user info
    const { data: replies, error: replyError } = await supabase
      .from('forum_replies')
      .select(`
        *,
        user:users!forum_replies_user_id_fkey (id, username, full_name)
      `)
      .eq('topic_id', id)
      .order('created_at', { ascending: true });

    if (replyError) throw replyError;

    // Increment view count
    await supabase
      .from('forum_topics')
      .update({ views: (topic.views || 0) + 1 })
      .eq('id', id);

    res.json({
      ...topic,
      _id: topic.id,
      user: topic.user || { username: 'Anonymous' },
      replies: replies.map(reply => ({
        ...reply,
        _id: reply.id,
        user: reply.user || { username: 'Anonymous' }
      }))
    });
  } catch (error) {
    console.error('Get topic error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create topic (requires authentication)
router.post('/topics', verifyToken, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { data, error } = await supabase
      .from('forum_topics')
      .insert([{
        title: title.trim(),
        content: content.trim(),
        category: category || 'General',
        user_id: userId,
        created_at: new Date().toISOString()
      }])
      .select(`
        *,
        user:users!forum_topics_user_id_fkey (id, username, full_name)
      `)
      .single();

    if (error) throw error;

    res.status(201).json({
      ...data,
      _id: data.id,
      user: data.user || { username: 'Anonymous' },
      replyCount: 0
    });
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add reply to topic (requires authentication)
router.post('/topics/:topicId/replies', verifyToken, async (req, res) => {
  try {
    const { topicId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Check if topic exists
    const { data: topic, error: topicError } = await supabase
      .from('forum_topics')
      .select('id')
      .eq('id', topicId)
      .single();

    if (topicError || !topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    // Insert reply
    const { data, error } = await supabase
      .from('forum_replies')
      .insert([{
        topic_id: topicId,
        content: content.trim(),
        user_id: userId,
        created_at: new Date().toISOString()
      }])
      .select(`
        *,
        user:users!forum_replies_user_id_fkey (id, username, full_name)
      `)
      .single();

    if (error) throw error;

    // Increment reply count on topic
    await supabase.rpc('increment_reply_count', { topic_id: topicId });

    res.status(201).json({
      ...data,
      _id: data.id,
      user: data.user || { username: 'Anonymous' }
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Like a topic (requires authentication)
router.post('/topics/:id/like', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if already liked
    const { data: existing, error: checkError } = await supabase
      .from('forum_likes')
      .select('id')
      .eq('topic_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      // Unlike
      const { error: deleteError } = await supabase
        .from('forum_likes')
        .delete()
        .eq('id', existing.id);

      if (deleteError) throw deleteError;

      return res.json({ liked: false, message: 'Unliked successfully' });
    } else {
      // Like
      const { error: insertError } = await supabase
        .from('forum_likes')
        .insert([{
          topic_id: id,
          user_id: userId,
          created_at: new Date().toISOString()
        }]);

      if (insertError) throw insertError;

      return res.json({ liked: true, message: 'Liked successfully' });
    }
  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get like status for a topic
router.get('/topics/:id/like-status', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('forum_likes')
      .select('id')
      .eq('topic_id', id)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;

    res.json({ liked: !!data });
  } catch (error) {
    console.error('Like status error:', error);
    res.json({ liked: false });
  }
});

// Get like count for a topic
router.get('/topics/:id/likes', async (req, res) => {
  try {
    const { id } = req.params;

    const { count, error } = await supabase
      .from('forum_likes')
      .select('id', { count: 'exact' })
      .eq('topic_id', id);

    if (error) throw error;

    res.json({ likes: count || 0 });
  } catch (error) {
    console.error('Like count error:', error);
    res.json({ likes: 0 });
  }
});

module.exports = router;