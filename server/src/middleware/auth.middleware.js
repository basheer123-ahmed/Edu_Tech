const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

const authenticate = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('[Auth Middleware] Header:', authHeader);
  
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    console.warn('[Auth Middleware] No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Auth Middleware] Decoded token:', decoded);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      console.warn('[Auth Middleware] User not found for ID:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    console.log('[Auth Middleware] Authenticated user:', user.email, 'Role:', user.role);
    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth Middleware] Token validation failed:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toUpperCase();
    const authorizedRoles = roles.map(r => r.toUpperCase());
    
    console.log('[Auth Middleware] Authorizing roles:', authorizedRoles, 'User role:', userRole);
    
    if (!req.user || !authorizedRoles.includes(userRole)) {
      console.warn('[Auth Middleware] Access denied for role:', userRole);
      return res.status(403).json({ 
        message: `Access denied: Unauthorized role (${userRole || 'None'})` 
      });
    }
    
    console.log('[Auth Middleware] Access granted for role:', userRole);
    next();
  };
};

module.exports = { 
  authenticate, 
  authorize,
  authenticateUser: authenticate,
  authorizeRoles: authorize
};
