const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Get all leadership history
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leadership_history')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error('Get leadership history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add leadership history
router.post('/', async (req, res) => {
  try {
    const { leader_name, title, year_start, year_end, achievements, image } = req.body;

    const { data, error } = await supabase
      .from('leadership_history')
      .insert([{
        leader_name,
        title,
        year_start,
        year_end,
        achievements,
        image,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Add leadership history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update leadership history
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { leader_name, title, year_start, year_end, achievements, image } = req.body;

    const { data, error } = await supabase
      .from('leadership_history')
      .update({
        leader_name,
        title,
        year_start,
        year_end,
        achievements,
        image,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Update leadership history error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete leadership history
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('leadership_history')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Leadership history deleted successfully' });
  } catch (error) {
    console.error('Delete leadership history error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;