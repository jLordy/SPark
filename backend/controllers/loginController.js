import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config();
import { sql } from "../config/db.js";

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find user by username
    const users = await sql`
      SELECT * FROM users WHERE username = ${username}
    `;

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT token with approval status included
    const token = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        role: user.role,
        is_approved: user.is_approved, // Include approval status in token
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      message: user.is_approved
        ? "Login successful"
        : "Login successful - Account pending approval",
      data: {
        user: userWithoutPassword,
        token,
        is_approved: user.is_approved, // Send approval status to frontend
      },
    });
  } catch (error) {
    console.error("Error in loginUser function", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
