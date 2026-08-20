const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to format user for frontend
const formatUser = (user) => ({
  id: user.id,
  _id: user.id,
  username: user.username,
  email: user.email,
  fullName: user.full_name || user.fullName,
  full_name: user.full_name || user.fullName,
  role: user.role || 'user',
  createdAt: user.created_at,
  updated_at: user.updated_at
});

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, role } = req.body;

    console.log('📝 Registration attempt:', { username, email, fullName });

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('username, email')
      .or(`username.eq.${username},email.eq.${email}`);

    if (checkError) {
      console.error('❌ Check user error:', checkError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (existingUser && existingUser.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in Supabase
    const { data: user, error: createError } = await supabase
      .from('users')
      .insert([{
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        full_name: fullName || username,
        role: role || 'user',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (createError) {
      console.error('❌ Create user error:', createError);
      return res.status(500).json({ error: 'Failed to create user: ' + createError.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'ugwunagbo_super_secret_key_2024',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    console.log('✅ User registered successfully:', user.username);

    res.status(201).json({
      success: true,
      token,
      user: formatUser(user)
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('📝 Login attempt:', username);

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username or email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq.${username},email.eq.${username}`)
      .maybeSingle();

    if (error) {
      console.error('❌ Find user error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for user:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'ugwunagbo_super_secret_key_2024',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    console.log('✅ User logged in successfully:', user.username);

    res.json({
      success: true,
      token,
      user: formatUser(user)
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

// Get profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ugwunagbo_super_secret_key_2024');
    
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, full_name, role, created_at')
      .eq('id', decoded.id)
      .single();

    if (error) {
      console.error('❌ Profile error:', error);
      return res.status(401).json({ error: 'User not found' });
    }

    res.json(formatUser(user));
  } catch (error) {
    console.error('❌ Profile error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Change password
router.put('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ugwunagbo_super_secret_key_2024');
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('password')
      .eq('id', decoded.id)
      .single();

    if (error) throw error;

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ 
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', decoded.id);

    if (updateError) throw updateError;

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update profile
router.put('/update-profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ugwunagbo_super_secret_key_2024');
    const { fullName, email, currentPassword, newPassword } = req.body;

    const updateData = {};
    if (fullName) updateData.full_name = fullName;
    if (email) updateData.email = email.trim().toLowerCase();
    updateData.updated_at = new Date().toISOString();

    // If changing password
    if (currentPassword && newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('password')
        .eq('id', decoded.id)
        .single();

      if (userError) throw userError;

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', decoded.id)
      .select('id, username, email, full_name, role')
      .single();

    if (error) throw error;

    res.json({
      message: 'Profile updated successfully',
      user: formatUser(user)
    });
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;