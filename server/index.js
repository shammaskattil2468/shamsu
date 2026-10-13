import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Portfolio } from './models/Portfolio.js';
import { Message } from './models/Message.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve MongoDB connection string (supports mongodb://localhost:27017/)
let rawUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mubashira_portfolio';
if (rawUri.endsWith('/')) {
  rawUri = rawUri + 'mubashira_portfolio';
}
const MONGODB_URI = rawUri;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' })); // allow larger payloads for base64 photo uploads

// Connect to MongoDB
let isDbConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isDbConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${MONGODB_URI}`);
  } catch (err) {
    isDbConnected = false;
    console.error('[MongoDB] Connection error:', err.message);
    console.log('[MongoDB] Running with local fallback mode until MongoDB is reachable.');
  }
};

mongoose.connection.on('disconnected', () => {
  isDbConnected = false;
  console.warn('[MongoDB] Disconnected from server');
});

mongoose.connection.on('connected', () => {
  isDbConnected = true;
  console.log('[MongoDB] Connection re-established');
});

// Health & Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: isDbConnected ? 'connected' : 'disconnected',
    uri: MONGODB_URI,
    database: mongoose.connection?.name || 'mubashira_portfolio',
    serverTime: new Date().toISOString(),
  });
});

// --- Portfolio Endpoints ---

// Get portfolio data
app.get('/api/portfolio', async (req, res) => {
  try {
    if (!isDbConnected) {
      return res.status(503).json({ error: 'Database not connected', offline: true });
    }
    const doc = await Portfolio.findOne({ key: 'main' });
    if (!doc) {
      return res.status(404).json({ message: 'No portfolio data saved yet' });
    }
    res.json(doc.data);
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio data' });
  }
});

// Save / update portfolio data
app.post('/api/portfolio', async (req, res) => {
  try {
    if (!isDbConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const updated = await Portfolio.findOneAndUpdate(
      { key: 'main' },
      { $set: { data: req.body, updatedAt: new Date() } },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Portfolio saved to MongoDB', updatedAt: updated.updatedAt });
  } catch (err) {
    console.error('Error saving portfolio:', err);
    res.status(500).json({ error: 'Failed to save portfolio data' });
  }
});

// Reset portfolio in DB
app.post('/api/portfolio/reset', async (req, res) => {
  try {
    if (!isDbConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    await Portfolio.deleteOne({ key: 'main' });
    res.json({ success: true, message: 'Portfolio reset in database' });
  } catch (err) {
    console.error('Error resetting portfolio:', err);
    res.status(500).json({ error: 'Failed to reset portfolio in database' });
  }
});

// --- Contact Messages Endpoints ---

// Submit a new contact message
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email, and message' });
    }

    if (!isDbConnected) {
      // Return 200 with offline status so client still continues gracefully
      return res.status(200).json({ 
        success: true, 
        offline: true, 
        message: 'Saved locally (MongoDB offline)' 
      });
    }

    const newMessage = await Message.create({ name, email, message });
    res.status(201).json({
      success: true,
      message: 'Message stored in MongoDB successfully',
      data: newMessage,
    });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message in database' });
  }
});

// Get all messages (for Admin viewer)
app.get('/api/messages', async (req, res) => {
  try {
    if (!isDbConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    const messages = await Message.find().sort({ createdAt: -1 }).limit(100);
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Delete a message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    if (!isDbConnected) {
      return res.status(503).json({ error: 'Database not connected' });
    }
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`[Express] Backend server running on http://localhost:${PORT}`);
  await connectDB();
});
