import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import userRouter from './routes/userRoutes.js';
import channelRouter from './routes/channelRoutes.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from "./routes/commentRoutes.js";
import replyRouter from "./routes/replyRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',  // Update with your front-end URL in production
  },
});

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,   
  }));


app.use(express.json());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/channels', channelRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/replies', replyRouter);

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('a user connected');

  // Listen for new messages
  socket.on('send-message', (data) => {
    // Emit message to the channel
    io.to(data.channelId).emit('receive-message', data);
    console.log('Message sent:', data);
  });

  // Join a channel room
  socket.on('join-channel', (channelId) => {
    socket.join(channelId);
    console.log(`User joined channel: ${channelId}`);
  });

  // Leave a channel room
  socket.on('leave-channel', (channelId) => {
    socket.leave(channelId);
    console.log(`User left channel: ${channelId}`);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

app.get("/", (req,res)=>{
  res.send("Server is working!")
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});