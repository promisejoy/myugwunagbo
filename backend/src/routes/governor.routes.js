const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Helper to upload image to Supabase Storage
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

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('ugwunagbo-images')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Get governor
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('governor')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    res.json(data || {});
  } catch (error) {
    console.error('Get governor error:', error);
    // Return empty object instead of error for new installations
    res.json({});
  }
});

// Update governor
router.put('/', upload.single('image'), async (req, res) => {
  try {
    console.log('📝 Governor update request received');
    console.log('📦 Body:', req.body);
    console.log('📸 File:', req.file ? req.file.originalname : 'No file');
    
    const { name, title, bio, vision, mission, achievements } = req.body;
    let imageUrl = null;

    // Upload image if provided
    if (req.file) {
      console.log('📸 Uploading image...');
      imageUrl = await uploadImage(req.file, 'governor');
      console.log('✅ Image uploaded:', imageUrl);
    }

    // Check if governor exists
    const { data: existing, error: checkError } = await supabase
      .from('governor')
      .select('id')
      .maybeSingle();

    let result;
    const now = new Date().toISOString();

    if (existing) {
      console.log('🔄 Updating existing governor:', existing.id);
      
      // Prepare update data - only include fields that exist
      const updateData = {
        name: name || 'Governor',
        updated_at: now
      };
      
      // Only add fields if they exist in the request
      if (title !== undefined) updateData.title = title || 'Executive Governor';
      if (bio !== undefined) updateData.bio = bio || '';
      if (vision !== undefined) updateData.vision = vision || '';
      if (mission !== undefined) updateData.mission = mission || '';
      if (achievements !== undefined) updateData.achievements = achievements || '';
      if (imageUrl) updateData.image = imageUrl;

      console.log('📦 Update data:', updateData);

      // Update
      const { data, error } = await supabase
        .from('governor')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Update error:', error);
        throw error;
      }
      result = data;
    } else {
      console.log('🆕 Creating new governor');
      
      // Prepare insert data
      const insertData = {
        name: name || 'Governor',
        title: title || 'Executive Governor',
        bio: bio || '',
        vision: vision || '',
        mission: mission || '',
        achievements: achievements || '',
        created_at: now,
        updated_at: now
      };
      
      if (imageUrl) insertData.image = imageUrl;

      console.log('📦 Insert data:', insertData);

      // Insert
      const { data, error } = await supabase
        .from('governor')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('❌ Insert error:', error);
        throw error;
      }
      result = data;
    }

    console.log('✅ Governor updated successfully:', result);
    res.json(result);
  } catch (error) {
    console.error('❌ Update governor error:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.details || 'An error occurred while updating governor'
    });
  }
});

module.exports = router;