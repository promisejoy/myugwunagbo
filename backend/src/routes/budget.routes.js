const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed'));
    }
  }
});

// Helper to upload file to Supabase Storage
const uploadFile = async (file, folder) => {
  try {
    if (!file) return null;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${folder}/${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('ugwunagbo-documents')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600'
      });

    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage
      .from('ugwunagbo-documents')
      .getPublicUrl(fileName);
    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Get budgets error:', error);
    res.json([]);
  }
});

// Upload budget
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, year, description } = req.body;

    console.log('📝 Received budget data:', req.body);
    console.log('📸 File:', req.file ? req.file.originalname : 'No file');

    if (!title || !req.file) {
      return res.status(400).json({ error: 'Title and file are required' });
    }

    // Upload file to Supabase Storage
    const fileUrl = await uploadFile(req.file, 'budgets');

    // Save budget record to database
    const { data, error } = await supabase
      .from('budgets')
      .insert([{
        title: title.trim(),
        year: year || new Date().getFullYear().toString(),
        description: description || '',
        file_url: fileUrl,
        size: req.file.size,
        uploaded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;

    console.log('✅ Budget uploaded successfully:', data);
    res.status(201).json(data);
  } catch (error) {
    console.error('❌ Upload budget error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload budget' });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Get the file URL first
    const { data: budget, error: fetchError } = await supabase
      .from('budgets')
      .select('file_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from database
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;