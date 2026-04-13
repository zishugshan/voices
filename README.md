# Your Commento — Anonymous Comments App

A beautiful, no-login comment board backed by MongoDB.

## Stack
- **Frontend**: Pure HTML/CSS/JS (served as static from Express)
- **Backend**: Node.js + Express
- **Database**: MongoDB (via Mongoose)

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set your MongoDB URI (optional)
By default connects to `mongodb://localhost:27017/commentsdb`.
Set the env var to use a cloud DB (e.g. MongoDB Atlas):
```bash
export MONGO_URI="mongodb+srv://user:pass@cluster.mongodb.net/commentsdb"
```

### 3. Start the server
```bash
node server.js
```

Then open **http://localhost:3000** in your browser.

---

## Features
- 🔒 No login required — each visitor gets a persistent UUID stored in `localStorage`
- 🎨 Random avatar color assigned per guest
- ♥ Like comments (tracked in localStorage, no duplicate likes)
- ⌨️ `Ctrl+Enter` / `Cmd+Enter` to post
- 📜 Last 200 comments shown, newest first
- 💾 All data in MongoDB: `commentsdb.comments` collection

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/comments` | Fetch all comments |
| POST | `/api/comments` | Create a comment |
| POST | `/api/comments/:id/like` | Like a comment |

## MongoDB Comment Schema
```json
{
  "guestId": "uuid-string",
  "nickname": "Anonymous",
  "avatarColor": "#c0392b",
  "message": "Hello, world!",
  "likes": 0,
  "createdAt": "2025-01-01T00:00:00Z"
}
```
