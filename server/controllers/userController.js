import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getUserByUsername, createUser, getUserById } from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in the environment variables!");
  process.exit(1); // Exit the app if the secret is not defined
}

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await createUser(username, email, hashedPassword);

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Error creating user' });
  }
};

// Login a user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' } // The token expires in 1 hour
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Error logging in' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // Get userId from the token
    const { userId } = req.user;

    // Fetch the user profile from the database
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar || 'https://via.placeholder.com/150', // Add a default avatar if none exists
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

export { registerUser, loginUser, getUserProfile };