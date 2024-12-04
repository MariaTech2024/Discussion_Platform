import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js'; // Import the middleware

const userRouter = express.Router();

// Register route - no authentication required
userRouter.post('/register', registerUser);

// Login route - no authentication required
userRouter.post('/login', loginUser);

// Protected route - only accessible with valid token
userRouter.get('/profile', authenticateToken, getUserProfile); 

export default userRouter;