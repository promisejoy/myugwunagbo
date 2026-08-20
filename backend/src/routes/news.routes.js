const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

const uploadImage = async (file, folder) => {
  try {
    if (!file) return null;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('ugwunagbo-images')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage
      .from('ugwunagbo-images')
      .getPublicUrl(fileName);
    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Get all news
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const formattedData = data.map(item => ({ ...item, _id: item.id }));
    res.json(formattedData || []);
  } catch (error) {
    console.error('Get news error:', error);
    res.json([]);
  }
});

// Add news
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, content, category, author, status, date } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImage(req.file, 'news');
    }

    const { data, error } = await supabase
      .from('news')
      .insert([{
        title,
        content,
        category: category || 'General',
        image: imageUrl,
        author: author || 'Admin',
        status: status || 'published',
        date: date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Add news error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update news
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, author, status, date } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImage(req.file, 'news');
    }

    const updateData = {
      title,
      content,
      category: category || 'General',
      author: author || 'Admin',
      status: status || 'published',
      date: date || new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    };
    if (imageUrl) updateData.image = imageUrl;

    const { data, error } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete news
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;