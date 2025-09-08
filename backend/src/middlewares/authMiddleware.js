import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";

// ================== Admin Middleware ==================
export const authAdminMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      message: "Please login first",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await userModel.findById(decoded.id);
    if (!admin || admin.role !== "Admin") {
      return res.status(403).json({
        message: "Access denied. Admins only",
        success: false,
      });
    }

    req.admin = admin; // attach to request
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

// ================== Operator Middleware ==================
export const authOperatorMiddleware = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({
      message: "Please login first",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const operator = await userModel.findById(decoded.id);
    if (!operator || operator.role !== "Operator") {
      return res.status(403).json({
        message: "Access denied. Operators only",
        success: false,
      });
    }

    req.operator = operator; // attach to request
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};
