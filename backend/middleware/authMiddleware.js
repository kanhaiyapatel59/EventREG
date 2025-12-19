import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User no longer exists' });
            }

            return next(); // Use return to exit function
        } catch (error) {
            console.error("TOKEN VALIDATION ERROR:", error.message);
            // If token is expired or invalid
            return res.status(401).json({ message: 'Not authorized, token failed or expired' });
        }
    }

    // If we get here, it means no token was found at all
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided' });
    }
};

export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admin role required' });
    }
};