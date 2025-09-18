import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";


// helper fn to create random userId
const generateUserId = (role) => {
    let prefix;
    if (role === "Admin") prefix = "ADM";
    else if (role === "Operator") prefix = "OPR";
    else if (role === "SectionController") prefix = "SEC";
    else prefix = "USR";

    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // random 6 chars
    const randomNum = Math.floor(1000 + Math.random() * 9000); // random 4 digit num
    return `${prefix}-${randomStr}${randomNum}`;
};

// ================== REGISTER ==================
export const registerAdmin = async (req, res) => {
    const { name, password } = req.body;
    try {
        if (!name || !password) {
            return res
                .status(400)
                .json({ message: "Name and password are required", success: false });
        }

        const userId = generateUserId("Admin");

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await userModel.create({
            userId,
            name,
            role: "Admin",
            password: hashedPassword,
        });

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie("token", token, { httpOnly: true });

        res.status(201).json({
            message: "Admin registered successfully",
            success: true,
            admin: {
                _id: admin._id,
                userId: admin.userId,
                name: admin.name,
                role: admin.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering Admin", success: false });
    }
};

export const registerOperator = async (req, res) => {
    const { name, password } = req.body;

    try {
        if (!name || !password) {
            return res
                .status(400)
                .json({ message: "Name and password are required", success: false });
        }

        const userId = generateUserId("Operator");

        const hashedPassword = await bcrypt.hash(password, 10);

        const operator = await userModel.create({
            userId,
            name,
            role: "Operator",
            password: hashedPassword,
        });

        const token = jwt.sign(
            { id: operator._id, role: operator.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true });

        res.status(201).json({
            message: "Operator registered successfully",
            success: true,
            operator: {
                _id: operator._id,
                userId: operator.userId,
                name: operator.name,
                role: operator.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error registering Operator", success: false });
    }
};

// ================== LOGIN ==================
export const loginAdmin = async (req, res) => {
    const { userId, password } = req.body;
  console.log(req.body)
    try {
        const admin = await userModel.findOne({ userId, role: "Admin" });
        if (!admin) {
            return res
                .status(400)
                .json({ message: "Invalid UserId or Password", success: false });
        }

        const isValid = await bcrypt.compare(password, admin.password);
        if (!isValid) {
            return res
                .status(400)
                .json({ message: "Invalid UserId or Password", success: false });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({
            message: "Admin logged in successfully",
            success: true,
            admin: {
                _id: admin._id,
                userId: admin.userId,
                name: admin.name,
                role: admin.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in Admin", success: false });
    }
};

export const loginOperator = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const operator = await userModel.findOne({ userId, role: "Operator" });
        if (!operator) {
            return res
                .status(400)
                .json({ message: "Invalid UserId or Password", success: false });
        }

        const isValid = await bcrypt.compare(password, operator.password);
        if (!isValid) {
            return res
                .status(400)
                .json({ message: "Invalid UserId or Password", success: false });
        }

        const token = jwt.sign(
            { id: operator._id, role: operator.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, { httpOnly: true });

        res.status(200).json({
            message: "Operator logged in successfully",
            success: true,
            operator: {
                _id: operator._id,
                userId: operator.userId,
                name: operator.name,
                role: operator.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in Operator", success: false });
    }
};

// Register a Section Controller
export const registerSectionController = async (req, res) => {
  try {
    const { name, password } = req.body;

    // Generate a userId automatically
    let userId = generateUserId("SectionController");

    // Make sure generated userId is unique
    while (await userModel.findOne({ userId })) {
      userId = generateUserId("SectionController");
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const newController = await userModel.create({
      userId,
      name,
      role: "SectionController",
      password: hashedPassword
    });

    res.status(201).json({
      message: "Section Controller registered successfully",
      success: true,
      controller: newController
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering Section Controller", success: false });
  }
};


// Login Section Controller
export const loginSectionController = async (req, res) => {
  try {
    const { userId, password } = req.body;

    const controller = await userModel.findOne({ userId, role: "SectionController" });
    if (!controller) return res.status(404).json({ message: "Section Controller not found", success: false });

    if (controller.password) {
      const isMatch = await bcrypt.compare(password, controller.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign(
      { id: controller._id, role: controller.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      sectionController: controller
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in", success: false });
  }
};

// List all Section Controllers (Admin only)
export const listSectionControllers = async (req, res) => {
  try {
    const controllers = await userModel.find({ role: "SectionController" });
    res.status(200).json({
      message: "Section Controllers fetched",
      success: true,
      controllers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching controllers", success: false });
  }
};

// ================== LOGOUT ==================
export const logout = (req, res) => {
  const token = req.cookies?.token; // check if token cookie exists

  if (!token) {
    return res
      .status(401)
      .json({ message: "Log in first to logout", success: false });
  }

  res.clearCookie("token");
  res
    .status(200)
    .json({ message: "Logged out successfully", success: true });
};

