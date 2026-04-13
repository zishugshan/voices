const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/commentsdb';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Comment Schema
const commentSchema = new mongoose.Schema({
  guestId: { type: String, required: true },       // UUID stored in localStorage
  nickname: { type: String, default: 'Anonymous' }, // optional display name
  avatarColor: { type: String, required: true },    // random color for avatar
  message: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
});

const Comment = mongoose.model('Comment', commentSchema);

// GET all comments (sorted newest first)
app.get('/api/comments', async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 }).limit(200);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST new comment
app.post('/api/comments', async (req, res) => {
  try {
    const { guestId, nickname, avatarColor, message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    const comment = new Comment({
      guestId: guestId || uuidv4(),
      nickname: nickname?.trim().substring(0, 30) || 'Anonymous',
      avatarColor: avatarColor || '#6366f1',
      message: message.trim().substring(0, 1000),
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// POST like a comment
app.post('/api/comments/:id/like', async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json({ likes: comment.likes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to like comment' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
