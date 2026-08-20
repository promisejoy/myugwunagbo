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

// Get all academicians
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('academia')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const formattedData = data.map(item => ({ 
      ...item, 
      _id: item.id,
      full_name: item.full_name,
      photo: item.photo
    }));
    res.json(formattedData || []);
  } catch (error) {
    console.error('Get academia error:', error);
    res.json([]);
  }
});

// Add academician
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { full_name, title, village, qualification } = req.body;

    console.log('📝 Received academia data:', req.body);

    if (!full_name || full_name.trim() === '') {
      return res.status(400).json({ error: 'Full name is required' });
    }

    let photoUrl = null;
    if (req.file) {
      photoUrl = await uploadImage(req.file, 'academia');
    }

    const { data, error } = await supabase
      .from('academia')
      .insert([{
        full_name: full_name.trim(),
        title: title || '',
        village: village || '',
        qualification: qualification || '',
        photo: photoUrl,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Add academia error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update academician
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, title, village, qualification } = req.body;

    let photoUrl = null;
    if (req.file) {
      photoUrl = await uploadImage(req.file, 'academia');
    }

    const updateData = {
      full_name: full_name.trim(),
      title: title || '',
      village: village || '',
      qualification: qualification || '',
      updated_at: new Date().toISOString()
    };
    if (photoUrl) updateData.photo = photoUrl;

    const { data, error } = await supabase
      .from('academia')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Update academia error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete academician
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('academia')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'Academician deleted successfully' });
  } catch (error) {
    console.error('Delete academia error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;