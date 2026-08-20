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

// Get all traditional rulers
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('traditional_rulers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    // Format data for frontend
    const formattedData = data.map(item => ({ 
      ...item, 
      _id: item.id,
      // Map database column names to frontend expected names
      biography: item.bio || item.biography || '',
    }));
    res.json(formattedData || []);
  } catch (error) {
    console.error('Get traditional rulers error:', error);
    res.json([]);
  }
});

// Add traditional ruler
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, title, role, village, year, bio, biography, phone, email } = req.body;

    console.log('📝 Received traditional ruler data:', req.body);

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file, 'traditional-rulers');
    }

    // Use bio or biography - whichever is provided
    const bioText = bio || biography || '';

    const { data, error } = await supabase
      .from('traditional_rulers')
      .insert([{
        name: name.trim(),
        title: title || 'Traditional Ruler',
        role: role || 'Traditional Leader',
        village: village || '',
        year: year || '',
        bio: bioText,
        biography: bioText, // Store in both fields for compatibility
        phone: phone || '',
        email: email || '',
        image: imageUrl,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('✅ Traditional ruler added successfully:', data);
    res.status(201).json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Add traditional ruler error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update traditional ruler
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, role, village, year, bio, biography, phone, email } = req.body;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImage(req.file, 'traditional-rulers');
    }

    const bioText = bio || biography || '';

    const updateData = {
      name: name.trim(),
      title: title || 'Traditional Ruler',
      role: role || 'Traditional Leader',
      village: village || '',
      year: year || '',
      bio: bioText,
      biography: bioText,
      phone: phone || '',
      email: email || '',
      updated_at: new Date().toISOString()
    };
    if (imageUrl) updateData.image = imageUrl;

    const { data, error } = await supabase
      .from('traditional_rulers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Update traditional ruler error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete traditional ruler
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('traditional_rulers')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Traditional ruler deleted successfully' });
  } catch (error) {
    console.error('Delete traditional ruler error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;