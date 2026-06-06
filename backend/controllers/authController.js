import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper: Generate JWT Token signed with the database User ID
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Basic body validations
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists in DB
    const userExists = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.trim() }
      ]
    });

    if (userExists) {
      return res.status(400).json({ message: 'Username or Email is already registered' });
    }

    // Create and save new user
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password,
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Registration Error:', error.message);
    return res.status(500).json({ message: 'Server error during registration. Please try again.' });
  }
};

// @desc    Authenticate a user & return credentials
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Basic body validations
    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    // Find user by email address
    const user = await User.findOne({ email: email.toLowerCase() });

    // Verify user exists and compare passwords
    if (user && (await user.comparePassword(password))) {
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ message: 'Server error during login. Please try again.' });
  }
};

// @desc    Get user profile data
// @route   GET /api/auth/me
// @access  Private (requires token verification middleware)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      });
    } else {
      return res.status(404).json({ message: 'User profile not found' });
    }
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving profile details.' });
  }
};
