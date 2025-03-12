import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js'; 

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access Denied: No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Fix: Use Admin Model to find Admin by `_id`
        const admin = await Admin.findById(decoded.adminId).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found in the database" });
        }

        req.user = admin; // Attach admin to request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token", error: error.message });
    }
};

// ✅ Admin Authorization Middleware
export const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No Admin Found" });
    }

    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
        return res.status(403).json({ message: "Access Denied: Admins Only" });
    }

    next();
};

export default authMiddleware;
