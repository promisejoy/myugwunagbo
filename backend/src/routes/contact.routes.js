const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Maximum number of contacts to keep
const MAX_CONTACTS = 20;

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    // Format for frontend compatibility
    const formattedData = data.map(item => ({ ...item, _id: item.id, createdAt: item.created_at }));
    res.json(formattedData || []);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.json([]);
  }
});

// Submit contact with auto-delete of oldest messages
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Prepare data - only include phone if it exists
    const contactData = {
      name,
      email,
      subject,
      message,
      status: 'new',
      created_at: new Date().toISOString()
    };
    
    // Only add phone if it's provided
    if (phone) {
      contactData.phone = phone;
    }

    console.log('📝 Inserting contact data:', contactData);

    // Insert the new contact
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }
    
    console.log('✅ Contact saved successfully:', data);

    // Check total contacts and delete oldest if needed
    await enforceContactLimit();

    res.status(201).json({ ...data, _id: data.id, createdAt: data.created_at });
  } catch (error) {
    console.error('Submit contact error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit contact' });
  }
});

// Function to enforce contact limit
const enforceContactLimit = async () => {
  try {
    // Get total count of contacts
    const { count, error: countError } = await supabase
      .from('contacts')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error counting contacts:', countError);
      return;
    }

    console.log(`📊 Total contacts: ${count}, Max allowed: ${MAX_CONTACTS}`);

    // If we have more than MAX_CONTACTS, delete the oldest ones
    if (count > MAX_CONTACTS) {
      const excessCount = count - MAX_CONTACTS;
      console.log(`🗑️ Deleting ${excessCount} oldest contact(s)...`);

      // Get the oldest contacts to delete
      const { data: oldestContacts, error: fetchError } = await supabase
        .from('contacts')
        .select('id, created_at')
        .order('created_at', { ascending: true })
        .limit(excessCount);

      if (fetchError) {
        console.error('Error fetching oldest contacts:', fetchError);
        return;
      }

      if (oldestContacts && oldestContacts.length > 0) {
        const idsToDelete = oldestContacts.map(contact => contact.id);
        console.log(`🗑️ Deleting contacts with IDs: ${idsToDelete.join(', ')}`);

        // Delete the oldest contacts
        const { error: deleteError } = await supabase
          .from('contacts')
          .delete()
          .in('id', idsToDelete);

        if (deleteError) {
          console.error('Error deleting old contacts:', deleteError);
        } else {
          console.log(`✅ Successfully deleted ${idsToDelete.length} oldest contact(s)`);
        }
      }
    }
  } catch (error) {
    console.error('Error enforcing contact limit:', error);
  }
};

// Optional: Endpoint to manually enforce the limit (for admin use)
router.post('/cleanup', async (req, res) => {
  try {
    await enforceContactLimit();
    res.json({ message: 'Contact cleanup completed successfully' });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;