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

// Get all NGOs
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ngos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    const formattedData = data.map(item => ({ 
      ...item, 
      _id: item.id,
      yearFounded: item.year_founded,
      focusArea: item.focus_area,
      logo: item.logo
    }));
    res.json(formattedData || []);
  } catch (error) {
    console.error('Get NGOs error:', error);
    res.json([]);
  }
});

// Add NGO
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { 
      name, type, description, location, yearFounded, 
      focusArea, projects, website, email, phone 
    } = req.body;

    console.log('📝 Received NGO data:', req.body);

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    let logoUrl = null;
    if (req.file) {
      logoUrl = await uploadImage(req.file, 'ngos');
    }

    const { data, error } = await supabase
      .from('ngos')
      .insert([{
        name: name.trim(),
        type: type || '',
        description: description || '',
        location: location || '',
        year_founded: yearFounded || '',
        focus_area: focusArea || '',
        projects: projects || '',
        website: website || '',
        email: email || '',
        phone: phone || '',
        logo: logoUrl,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Add NGO error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update NGO
router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, type, description, location, yearFounded, 
      focusArea, projects, website, email, phone 
    } = req.body;

    let logoUrl = null;
    if (req.file) {
      logoUrl = await uploadImage(req.file, 'ngos');
    }

    const updateData = {
      name: name.trim(),
      type: type || '',
      description: description || '',
      location: location || '',
      year_founded: yearFounded || '',
      focus_area: focusArea || '',
      projects: projects || '',
      website: website || '',
      email: email || '',
      phone: phone || '',
      updated_at: new Date().toISOString()
    };
    if (logoUrl) updateData.logo = logoUrl;

    const { data, error } = await supabase
      .from('ngos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ ...data, _id: data.id });
  } catch (error) {
    console.error('Update NGO error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete NGO
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('ngos')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ message: 'NGO deleted successfully' });
  } catch (error) {
    console.error('Delete NGO error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;