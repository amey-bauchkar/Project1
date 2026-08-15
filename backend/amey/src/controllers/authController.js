import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

// Fail fast if JWT_SECRET is not configured
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Exiting.');
  process.exit(1);
}

const generateToken = (userId, role, email) => {
  return jwt.sign({ id: userId, role, email }, JWT_SECRET, { expiresIn: '7d' });
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

    // Database-backed authentication only
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id, user.role, user.email);

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
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
};

/**
 * @desc    Register a new user (Protected — admin only can create accounts)
 * @route   POST /api/auth/register
 * @access  Protected (Admin)
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

    // Validate role
    const allowedRoles = ['admin', 'citizen', 'worker'];
    const userRole = allowedRoles.includes(role) ? role : 'citizen';

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
      role: userRole,
    });

    const token = generateToken(newUser._id, newUser.role, newUser.email);

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
    });
  }
};

