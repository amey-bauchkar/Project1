import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'supersecretjwtkey_jharkhand_sih2025';
  return jwt.sign({ id: userId, role }, secret, { expiresIn: '7d' });
};

/**
 * @desc    Authenticate admin or citizen & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        const isMatch = await user.comparePassword(password);
        if (isMatch) {
          const token = generateToken(user._id, user.role);
          return res.status(200).json({
            success: true,
            token,
            role: user.role,
            user: {
              id: user._id,
              email: user.email,
              role: user.role,
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn('[DB Login Fallback]:', dbErr.message);
    }

    // Default development municipal admin login credentials
    const cleanEmail = email.toLowerCase().trim();
    if (
      (cleanEmail === 'admin@jharkhand.gov.in' || cleanEmail === 'admin@jharkhand.gov' || cleanEmail === 'admin' || cleanEmail === 'admin@gmail.com') &&
      (password === 'Admin@123' || password === 'password123' || password === 'admin123' || password === 'admin')
    ) {
      const demoAdminId = 'admin_demo_001';
      const token = generateToken(demoAdminId, 'admin');
      return res.status(200).json({
        success: true,
        token,
        role: 'admin',
        user: {
          id: demoAdminId,
          email: cleanEmail,
          role: 'admin',
        },
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials. Use admin@jharkhand.gov.in / Admin@123',
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
      error: error.message,
    });
  }
};

/**
 * @desc    Register a new user (Utility / Seed helper)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists.',
      });
    }

    const newUser = await User.create({
      email: email.toLowerCase(),
      password,
      role: role || 'citizen',
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      token,
      role: newUser.role,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
      error: error.message,
    });
  }
};
