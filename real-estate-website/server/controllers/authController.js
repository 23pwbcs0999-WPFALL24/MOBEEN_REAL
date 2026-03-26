import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/helpers.js";

const getAssignedRole = (email) => {
  const normalizedEmail = (email || "").toLowerCase().trim();
  const mobeenAdminEmail = (process.env.MOBEEN_AGENT_EMAIL || "").toLowerCase().trim();
  return mobeenAdminEmail && normalizedEmail === mobeenAdminEmail ? "admin" : "user";
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const assignedRole = getAssignedRole(normalizedEmail);

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email: normalizedEmail, password: hashed, role: assignedRole });

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const assignedRole = getAssignedRole(user.email);
    if (user.role !== assignedRole) {
      user.role = assignedRole;
      await user.save();
    }

    const token = signToken(user._id);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const assignedRole = getAssignedRole(user.email);
    if (user.role !== assignedRole) {
      user.role = assignedRole;
      await user.save();
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};
