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

// Get all leaders
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leaders')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    // Convert id to _id for frontend compatibility
    const formattedData = data.map(item => ({ ...item, _id: item.id }));
    res.json(formattedData || []);
  } catch (error) {
    console.error('Get leaders error:', error);
    res.json([]);
  }
});

// Add leader
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, position, bio, email, phone, twitter, facebook, linkedin, order } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImage(req.file, 'leaders');
    }

    const { data, error } = await supabase
      .from('leaders')
      .insert([{
        name,
        position,
        bio: bio || '',
        image: imageUrl,
        email: email || '',
        phone: phone || '',
        twitter: twitter || '',
        facebook: facebook || '',
        linkedin: linkedin || '',
        order: parseInt(order) || 0
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Add leader error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update leader
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, bio, email, phone, twitter, facebook, linkedin, order } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = await uploadImage(req.file, 'leaders');
    }

    const updateData = {
      name,
      position,
      bio: bio || '',
      email: email || '',
      phone: phone || '',
      twitter: twitter || '',
      facebook: facebook || '',
      linkedin: linkedin || '',
      order: parseInt(order) || 0,
      updated_at: new Date().toISOString()
    };
    if (imageUrl) updateData.image = imageUrl;

    const { data, error } = await supabase
      .from('leaders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Update leader error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete leader
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('leaders')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Leader deleted successfully' });
  } catch (error) {
    console.error('Delete leader error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;