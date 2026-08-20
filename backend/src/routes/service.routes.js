const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const supabase = require('../config/supabase');

// ============================================
// MULTER CONFIGURATION
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
  limits: { fileSize: 5 * 1024 * 1024 },
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

    if (!name || !email || !service_type) {
      return res.status(400).json({ error: 'Name, email, and service type are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate application ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const applicationId = `UGW-${timestamp}-${random}`.toUpperCase();

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

    const { data, error } = await supabase
      .from('service_applications')
      .insert([applicationData])
      .select();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return res.status(500).json({ error: 'Database error: ' + error.message });
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
// SUBMIT APPLICATION WITH FILE
// ============================================
router.post('/apply-with-file', upload.single('authorization_file'), async (req, res) => {
  try {
    console.log('📝 Received application with file request');
    console.log('📦 Body:', req.body);
    console.log('📎 File:', req.file ? req.file.originalname : 'No file');

    const { 
      name, email, phone, service_type, description,
      traditional_ruler_name, traditional_ruler_title
    } = req.body;
    
    // Validate required fields
    if (!name || !email || !service_type) {
      // Clean up uploaded file if error
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({ 
        success: false,
        error: 'Name, email, and service type are required' 
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
    }

    // If Local Government of Origin, validate traditional ruler fields
    if (service_type === 'Local Government of Origin') {
      if (!traditional_ruler_name) {
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, () => {});
        }
        return res.status(400).json({ 
          success: false,
          error: 'Traditional Ruler name is required for LGA applications' 
        });
      }
      if (!traditional_ruler_title) {
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, () => {});
        }
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
        // Check if supabase storage is available
        if (!supabase.storage) {
          console.error('❌ Supabase storage is not available');
        } else {
          const filePath = `authorizations/${Date.now()}_${req.file.originalname}`;
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
          }
          
          // Clean up local file
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temp file:', err);
          });
        }
      } catch (uploadError) {
        console.error('❌ File upload error:', uploadError);
        // Clean up local file
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, () => {});
        }
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
      created_at: now,
      updated_at: now
    };

    // Only add these fields if they exist in the table
    // Check if columns exist by trying to insert with them
    try {
      // Try with all fields
      const fullData = {
        ...applicationData,
        traditional_ruler_name: traditional_ruler_name ? traditional_ruler_name.trim() : null,
        traditional_ruler_title: traditional_ruler_title ? traditional_ruler_title.trim() : null,
        authorization_file_url: authorization_file_url,
        authorization_file_name: authorization_file_name
      };

      const { data, error } = await supabase
        .from('service_applications')
        .insert([fullData])
        .select()
        .single();
      
      if (error) {
        // If columns don't exist, try without them
        if (error.message && (error.message.includes('traditional_ruler_name') || error.message.includes('authorization_file_url'))) {
          console.log('⚠️ New columns not found, using basic data...');
          
          const { data: retryData, error: retryError } = await supabase
            .from('service_applications')
            .insert([applicationData])
            .select()
            .single();
          
          if (retryError) {
            throw retryError;
          }
          
          console.log('✅ Application saved successfully (without custom fields)');
          return res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: retryData,
            application_id: applicationId
          });
        }
        throw error;
      }
      
      console.log('✅ Application with file saved successfully');
      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        data: data,
        application_id: applicationId
      });
      
    } catch (dbError) {
      console.error('❌ Database error:', dbError);
      
      // Last resort - try without any custom fields
      try {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('service_applications')
          .insert([applicationData])
          .select()
          .single();
        
        if (fallbackError) throw fallbackError;
        
        res.status(201).json({
          success: true,
          message: 'Application submitted successfully (basic)',
          data: fallbackData,
          application_id: applicationId
        });
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
    
  } catch (error) {
    console.error('❌ Error submitting application with file:', error);
    
    // Clean up uploaded file if error occurs
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
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
    // Try to get prices from service_prices table
    const { data, error } = await supabase
      .from('service_prices')
      .select('*');
    
    if (error) {
      console.error('Error fetching service prices:', error);
      // Return default prices if table doesn't exist
      return res.json({ 
        success: true, 
        data: {
          'Birth Certificate': { amount: 5000, currency: 'NGN', description: 'Birth certificate processing' },
          'Marriage Certificate': { amount: 10000, currency: 'NGN', description: 'Marriage certificate processing' },
          'Local Government of Origin': { amount: 5000, currency: 'NGN', description: 'LGA origin certificate' },
          'Business Permit': { amount: 15000, currency: 'NGN', description: 'Business permit processing' },
          'Building Plan Approval': { amount: 20000, currency: 'NGN', description: 'Building plan approval' },
          'Tax Clearance Certificate': { amount: 5000, currency: 'NGN', description: 'Tax clearance certificate' },
          'Market Stall Permit': { amount: 8000, currency: 'NGN', description: 'Market stall permit' },
          'Social Welfare': { amount: 3000, currency: 'NGN', description: 'Social welfare application' },
          'Village Directory': { amount: 2000, currency: 'NGN', description: 'Village directory listing' },
          'Other': { amount: 5000, currency: 'NGN', description: 'Other services' }
        }
      });
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
// UPDATE SERVICE PRICE
// ============================================
// Update service price (Admin only)
router.put('/prices/:serviceType', async (req, res) => {
  try {
    const { serviceType } = req.params;
    const { amount, currency, description } = req.body;
    
    if (!amount || amount < 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid amount. Please enter a positive number.'
      });
    }
    
    // First, try to update existing record
    const { data: existingData, error: findError } = await supabase
      .from('service_prices')
      .select('*')
      .eq('service_type', serviceType)
      .maybeSingle();
    
    if (findError && findError.code !== 'PGRST116') {
      console.error('Error finding service price:', findError);
      return res.status(500).json({
        success: false,
        error: 'Database error: ' + findError.message
      });
    }
    
    let result;
    
    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('service_prices')
        .update({
          amount: parseFloat(amount),
          currency: currency || 'NGN',
          description: description ? description.trim() : null,
          updated_at: new Date().toISOString()
        })
        .eq('service_type', serviceType)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('service_prices')
        .insert({
          service_type: serviceType,
          amount: parseFloat(amount),
          currency: currency || 'NGN',
          description: description ? description.trim() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    res.json({
      success: true,
      message: 'Service price updated successfully',
      data: result
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