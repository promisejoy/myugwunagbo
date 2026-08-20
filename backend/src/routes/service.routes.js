const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all applications
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

// Submit application
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

    // Prepare data - ONLY include columns that exist in the table
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

// Update application status
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

// Delete application
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