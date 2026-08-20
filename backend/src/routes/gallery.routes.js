const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for videos
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

const uploadFile = async (file, folder) => {
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

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const formattedData = data.map(item => ({ 
      ...item, 
      _id: item.id,
      file_url: item.file_url
    }));
    res.json(formattedData || []);
  } catch (error) {
    console.error('Get gallery error:', error);
    res.json([]);
  }
});

// Add gallery item
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, description, type, category } = req.body;

    console.log('📝 Received gallery data:', req.body);
    console.log('📸 File:', req.file ? req.file.originalname : 'No file');

    if (!req.file) {
      return res.status(400).json({ error: 'File is required' });
    }

    const fileType = type || (req.file.mimetype.startsWith('video/') ? 'video' : 'image');
    const fileUrl = await uploadFile(req.file, 'gallery');

    const { data, error } = await supabase
      .from('gallery')
      .insert([{
        title: title || '',
        description: description || '',
        type: fileType,
        category: category || 'General',
        file_url: fileUrl,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Add gallery error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update gallery item
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, category } = req.body;

    let fileUrl = null;
    if (req.file) {
      fileUrl = await uploadFile(req.file, 'gallery');
    }

    const updateData = {
      title: title || '',
      description: description || '',
      type: type || 'image',
      category: category || 'General',
      updated_at: new Date().toISOString()
    };
    if (fileUrl) updateData.file_url = fileUrl;

    const { data, error } = await supabase
      .from('gallery')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete gallery item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Delete gallery error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;