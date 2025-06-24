import jwt from 'jsonwebtoken';
import User from "../models/User.js";
import { JWT_SECRET } from "../config/env.js";
import BlacklistedToken from "../models/BlacklistedToken .js"; // ✅ Import this

const authorize = async (req, res, next) => {
    try {
        let token;

        // ✅ Step 1: Extract token from Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // ✅ Step 2: Reject if no token
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        // ✅ Step 3: Check if token is blacklisted
        const isBlacklisted = await BlacklistedToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized: Token has been invalidated' });
        }

        // ✅ Step 4: Verify and decode JWT
        const decode = jwt.verify(token, JWT_SECRET);

        // ✅ Step 5: Fetch user by decoded ID
        const user = await User.findById(decode.userId);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // ✅ Step 6: Attach user to request
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

export default authorize;
