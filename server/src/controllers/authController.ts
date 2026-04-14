import { Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Doctor from "../models/Doctor";
import { AuthRequest } from "../middleware/auth";

// Generate JWT token
const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d" as any,
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists with this email" });
      return;
    }

    // Create the user
    const user = await User.create({ name, email, password, role });

    // If registering as a doctor, also create a Doctor profile
    if (role === "doctor") {
      await Doctor.create({
        userId: user._id,
        name: user.name,
        email: user.email,
        speciality: req.body.speciality || "General Physician",
        experience: 5,
        fees: 50,
        about: "Dedicated medical professional committed to providing high-quality patient care and specialized treatment.",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=003d9b&color=fff`,
        isApproved: true,
      });
    }

    const token = generateToken((user._id as any).toString());

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
      token,
    });
  } catch (error: any) {
    console.error("Register error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken((user._id as any).toString());

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
      },
      token,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      phone: user.phone,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    if (req.body.avatar !== undefined) {
       user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    // SYNC: If user is a doctor, update overlapping fields in Doctor model
    if (updatedUser.role === "doctor") {
      const doctorUpdates: Record<string, any> = {
        name: updatedUser.name,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar
      };
      await Doctor.findOneAndUpdate({ userId: updatedUser._id }, doctorUpdates);
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      phone: updatedUser.phone,
    });
  } catch (error: any) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
