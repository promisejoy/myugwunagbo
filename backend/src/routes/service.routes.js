const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { supabase } = require('../config/supabase');

// ============================================
// MULTER CONFIGURATION FOR FILE UPLOADS
// ============================================

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads/authorizations');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// ============================================
// GET ALL APPLICATIONS
// ============================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('service_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    const formattedData = (data || []).map(item => ({ 
      ...item, 
      _id: item.id, 
      createdAt: item.created_at,
      service_type: item.service_type || 'Other',
      description: item.description || '',
      application_id: item.application_id || item.id
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Get applications error:', error);
    res.json([]);
  }
});

// ============================================
// SUBMIT APPLICATION (WITHOUT FILE)
// ============================================
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service_type, description } = req.body;

    console.log('📝 Received application data:', req.body);

    // Validate required fields
    if (!name || !email || !service_type) {
      return res.status(400).json({ 
        error: 'Name, email, and service type are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate application ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const applicationId = `UGW-${timestamp}-${random}`.toUpperCase();

    // Prepare data
    const now = new Date().toISOString();
    const applicationData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      service_type: service_type.trim(),
      description: description ? description.trim() : '',
      application_id: applicationId,
      status: 'pending',
      created_at: now,
      updated_at: now
    };

    console.log('📦 Inserting application data:', applicationData);

    // Insert into Supabase
    const { data, error } = await supabase
      .from('service_applications')
      .insert([applicationData])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      
      // If error is about application_id, try without it
      if (error.message && error.message.includes('application_id')) {
        console.log('⚠️ application_id column issue, trying without...');
        delete applicationData.application_id;
        
        const { data: retryData, error: retryError } = await supabase
          .from('service_applications')
          .insert([applicationData])
          .select();
        
        if (retryError) {
          console.error('❌ Retry error:', retryError);
          return res.status(500).json({ 
            error: 'Database error: ' + retryError.message
          });
        }
        
        const savedData = retryData[0];
        return res.status(201).json({ 
          ...savedData, 
          _id: savedData.id, 
          createdAt: savedData.created_at,
          application_id: applicationId
        });
      }
      
      return res.status(500).json({ 
        error: 'Database error: ' + error.message,
        details: error.details || ''
      });
    }
    
    const savedData = data[0];
    console.log('✅ Application saved successfully:', savedData);
    
    res.status(201).json({ 
      ...savedData, 
      _id: savedData.id, 
      createdAt: savedData.created_at 
    });
    
  } catch (error) {
    console.error('❌ Submit application error:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to submit application'
    });
  }
});

// ============================================
// SUBMIT APPLICATION WITH FILE (FOR LGA AUTHORIZATION)
// ============================================
router.post('/apply-with-file', upload.single('authorization_file'), async (req, res) => {
  try {
    const { 
      name, email, phone, service_type, description,
      traditional_ruler_name, traditional_ruler_title
    } = req.body;
    
    console.log('📝 Received application with file:', { name, email, service_type, traditional_ruler_name });

    // Validate required fields
    if (!name || !email || !service_type) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and service type are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // If Local Government of Origin, validate traditional ruler fields
    if (service_type === 'Local Government of Origin') {
      if (!traditional_ruler_name) {
        return res.status(400).json({ 
          success: false,
          error: 'Traditional Ruler name is required for LGA applications' 
        });
      }
      if (!traditional_ruler_title) {
        return res.status(400).json({ 
          success: false,
          error: 'Traditional Ruler title is required for LGA applications' 
        });
      }
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: 'Authorization letter is required for LGA applications' 
        });
      }
    }

    // Generate application ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const applicationId = `UGW-${timestamp}-${random}`.toUpperCase();

    let authorization_file_url = null;
    let authorization_file_name = null;
    
    // Upload file to Supabase Storage if provided
    if (req.file) {
      try {
        const filePath = `authorizations/${Date.now()}_${req.file.originalname}`;
        
        // Read file buffer
        const fileBuffer = fs.readFileSync(req.file.path);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('service-documents')
          .upload(filePath, fileBuffer, {
            contentType: req.file.mimetype,
            upsert: true
          });
        
        if (uploadError) {
          console.error('❌ Supabase upload error:', uploadError);
          // Continue without file - we'll still save the application
        } else {
          const { data: urlData } = supabase.storage
            .from('service-documents')
            .getPublicUrl(filePath);
          
          authorization_file_url = urlData.publicUrl;
          authorization_file_name = req.file.originalname;
          
          // Clean up local file
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temp file:', err);
          });
        }
      } catch (uploadError) {
        console.error('❌ File upload error:', uploadError);
        // Continue without file - we'll still save the application
      }
    }
    
    // Prepare application data
    const now = new Date().toISOString();
    const applicationData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? phone.trim() : '',
      service_type: service_type.trim(),
      description: description ? description.trim() : '',
      application_id: applicationId,
      status: 'pending',
      traditional_ruler_name: traditional_ruler_name ? traditional_ruler_name.trim() : null,
      traditional_ruler_title: traditional_ruler_title ? traditional_ruler_title.trim() : null,
      authorization_file_url: authorization_file_url,
      authorization_file_name: authorization_file_name,
      created_at: now,
      updated_at: now
    };

    console.log('📦 Inserting application with file data:', applicationData);

    // Insert into database
    const { data, error } = await supabase
      .from('service_applications')
      .insert([applicationData])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Database insert error:', error);
      
      // If columns don't exist yet, try without the new fields
      if (error.message && error.message.includes('traditional_ruler_name')) {
        console.log('⚠️ New columns not found, trying without...');
        delete applicationData.traditional_ruler_name;
        delete applicationData.traditional_ruler_title;
        delete applicationData.authorization_file_url;
        delete applicationData.authorization_file_name;
        
        const { data: retryData, error: retryError } = await supabase
          .from('service_applications')
          .insert([applicationData])
          .select()
          .single();
        
        if (retryError) {
          console.error('❌ Retry error:', retryError);
          return res.status(500).json({ 
            success: false,
            error: 'Database error: ' + retryError.message
          });
        }
        
        return res.status(201).json({
          success: true,
          message: 'Application submitted successfully (without authorization fields)',
          data: retryData,
          application_id: applicationId
        });
      }
      
      return res.status(500).json({ 
        success: false,
        error: 'Database error: ' + error.message
      });
    }
    
    console.log('✅ Application with file saved successfully:', data);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: data,
      application_id: applicationId
    });
    
  } catch (error) {
    console.error('❌ Error submitting application with file:', error);
    
    // Clean up uploaded file if error occurs
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to submit application'
    });
  }
});

// ============================================
// GET SERVICE PRICES
// ============================================
router.get('/prices', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('service_prices')
      .select('*');
    
    if (error) {
      console.error('Error fetching service prices:', error);
      // Return empty object if table doesn't exist yet
      return res.json({ success: true, data: {} });
    }
    
    const prices = {};
    (data || []).forEach(item => {
      prices[item.service_type] = {
        amount: item.amount,
        currency: item.currency || 'NGN',
        description: item.description || ''
      };
    });
    
    res.json({ success: true, data: prices });
    
  } catch (error) {
    console.error('Error fetching service prices:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to fetch service prices'
    });
  }
});

// ============================================
// UPDATE SERVICE PRICE (ADMIN ONLY)
// ============================================
router.put('/prices/:serviceType', async (req, res) => {
  try {
    const { serviceType } = req.params;
    const { amount, currency, description } = req.body;
    
    // Validate amount
    if (amount === undefined || amount === null || amount < 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid amount. Please enter a positive number.'
      });
    }
    
    // Validate amount is a number
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      return res.status(400).json({ 
        success: false,
        error: 'Amount must be a valid number.'
      });
    }
    
    const { data, error } = await supabase
      .from('service_prices')
      .upsert({
        service_type: serviceType,
        amount: parsedAmount,
        currency: currency || 'NGN',
        description: description ? description.trim() : null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error updating service price:', error);
      return res.status(500).json({ 
        success: false,
        error: 'Database error: ' + error.message
      });
    }
    
    res.json({
      success: true,
      message: 'Service price updated successfully',
      data: data
    });
    
  } catch (error) {
    console.error('Error updating service price:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to update service price'
    });
  }
});

// ============================================
// UPDATE APPLICATION STATUS
// ============================================
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const updateData = {
      status: status || 'pending',
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updateData.notes = notes.trim();
    }

    const { data, error } = await supabase
      .from('service_applications')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    const updatedData = data[0];
    res.json({ ...updatedData, _id: updatedData.id });
    
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// DELETE APPLICATION
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('service_applications')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Application deleted successfully' });
    
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;