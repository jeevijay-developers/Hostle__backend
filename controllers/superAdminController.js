import SuperAdmin from "../model/SuperAdmin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const createSuperAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if SuperAdmin already exists
    const existingAdmin = await SuperAdmin.findOne({ email });
    if (existingAdmin) {
      return res.status(401).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new SuperAdmin
    const newSuperAdmin = new SuperAdmin({
      name,
      email,
      password: hashedPassword,
      role: "SuperAdmin",
    });

    await newSuperAdmin.save();

    res.status(201).json({
      message: "SuperAdmin created successfully",
      admin: {
        name: newSuperAdmin.name,
        email: newSuperAdmin.email,
        role: newSuperAdmin.role,
      },
    });
  } catch (error) {
    console.error("Error creating SuperAdmin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { createSuperAdmin };
