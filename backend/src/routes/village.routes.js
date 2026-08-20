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

// Get all villages
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('villages')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    const formattedData = data.map(item => ({ ...item, _id: item.id }));
    res.json(formattedData || []);
  } catch (error) {
    console.error('Get villages error:', error);
    res.json([]);
  }
});

// Add village
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, population, ward, location } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImage(req.file, 'villages');
    }

    const { data, error } = await supabase
      .from('villages')
      .insert([{
        name,
        description: description || '',
        population: population || '',
        ward: ward || '',
        location: location || '',
        image: imageUrl,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Add village error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete village
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('villages')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Village deleted successfully' });
  } catch (error) {
    console.error('Delete village error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;