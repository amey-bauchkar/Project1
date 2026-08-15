import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to verify Bearer JWT token in Authorization header.
 * Rejects ALL unauthenticated requests with 401 — no fallbacks.
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // REJECT: No Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid token.',
      });
    }

    const token = authHeader.split(' ')[1];

    // REJECT: Empty token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token is missing.',
      });
    }

    // Verify JWT cryptographically — no fallbacks on failure
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attempt to hydrate full user from DB
    try {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
      } else {
        // User deleted but token still valid — trust JWT payload
        req.user = { _id: decoded.id, role: decoded.role, email: decoded.email };
      }
    } catch (dbErr) {
      // MongoDB offline — trust cryptographically verified JWT payload
      console.warn('[requireAuth] DB lookup failed, using JWT payload:', dbErr.message);
      req.user = { _id: decoded.id, role: decoded.role, email: decoded.email };
    }

    next();
  } catch (error) {
    // JWT verification failed — expired, malformed, wrong secret
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.',
    });
  }
};

/**
 * Middleware to enforce admin role
 */
export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access forbidden: Admins only.',
    });
  }
};

/**
 * Middleware to enforce a specific role (or multiple roles)
 * Usage: requireRole('admin'), requireRole('worker'), requireRole('admin', 'worker')
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role: ${roles.join(' or ')}.`,
      });
    }
    next();
  };
};
