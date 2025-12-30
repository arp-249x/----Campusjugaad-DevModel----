import authRoutes from './routes/auth';
import questRoutes from './routes/quests';
import transactionRoutes from './routes/transactions';
import { checkExpiredQuests } from './services/cron';
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http'; // <--- NEW
import { Server } from 'socket.io';  // <--- NEW

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- 🔌 SOCKET.IO SETUP ---
const httpServer = createServer(app); // Wrap Express
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow Frontend to connect from anywhere (Hackathon friendly)
    methods: ["GET", "POST"]
  }
});

// Store 'io' in the app so Routes can access it (e.g., to broadcast messages)
app.set('io', io);

// Socket Logic
// ... imports ...

// Global Map to track online users: <username, socketId>
const onlineUsers = new Map();

io.on('connection', (socket) => {
  const username = socket.handshake.query.username as string;
  
  if (username) {
      onlineUsers.set(username, socket.id);
      console.log(`⚡ ${username} connected (${socket.id})`);
      // Broadcast to everyone that this user is online
      io.emit('user_status', { username, status: 'online' });
  }

  // Join Quest Room
  socket.on('join_quest', (questId) => {
    socket.join(questId);
  });

  // 👇 NEW: Allow Frontend to check if a specific user is online
  socket.on('check_online', ({ username }) => {
    const isOnline = onlineUsers.has(username);
    // Send answer ONLY to the person who asked
    socket.emit('is_online_response', { username, isOnline });
  });
  

  // Typing Events
  socket.on('typing', ({ questId, isTyping }) => {
    // Broadcast to everyone in the room EXCEPT the sender
    socket.to(questId).emit('other_typing', isTyping);
  });

  socket.on('disconnect', () => {
    if (username) {
        onlineUsers.delete(username);
        io.emit('user_status', { username, status: 'offline' });
    }
  });
});



// Database Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host} 🍃`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('CampusJugaad API + Socket.io is running! 🚀');
});

// Run Refund Checker
setInterval(() => {
  checkExpiredQuests();
}, 60000); 

// --- START SERVER (Changed from app.listen to httpServer.listen) ---
if (process.env.NODE_ENV !== 'production') {
  httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;