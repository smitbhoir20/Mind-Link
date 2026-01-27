# 🧠 MindLink+

**Your Personal Peer Support & Wellbeing Platform**

A modern, student-friendly mental wellbeing web application featuring anonymous peer chat rooms, an AI-powered wellness companion, and daily self-care challenges. Built as a real startup-style platform for college students (ages 16-24).

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Express.js](https://img.shields.io/badge/Express.js-4.x-green?logo=express)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-white?logo=socketdotio)
![MySQL](https://img.shields.io/badge/MySQL-8.x-blue?logo=mysql)
![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?logo=openai)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 💬 **Peer Chat Rooms** | Anonymous themed chat rooms (Exam Stress, Career Talk, Positive Vibes, Focus Zone) |
| 🤖 **AI MoodBot** | 24/7 AI wellness companion powered by OpenAI |
| 🌿 **Daily Self-Care** | Personalized daily challenges for mental wellness |
| 🛡️ **Safe Space** | Anonymous identity protection and moderated environment |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MySQL Server running (optional for basic functionality)
- OpenAI API key (optional, fallback responses available)

### Installation

1. **Clone and enter the project:**
   ```bash
   cd trial2
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configure Environment (Optional):**
   ```bash
   # Edit backend/.env file
   OPENAI_API_KEY=your_api_key_here
   DB_PASSWORD=your_mysql_password
   ```

5. **Set up Database (Optional):**
   ```bash
   # In MySQL, run:
   mysql -u root -p < ../database/schema.sql
   ```

### Running the Application

**Option 1: Frontend Only (Recommended for Quick Testing)**
```bash
cd frontend
npm run dev
```
Open http://localhost:3000

**Option 2: Full Stack (With Backend)**

Terminal 1 - Backend:
```bash
cd backend
node server.js
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

## 📁 Project Structure

```
trial2/
├── frontend/                 # Next.js 14 Application
│   ├── app/
│   │   ├── page.js          # Dashboard/Home
│   │   ├── chat/page.js     # Chat Rooms
│   │   ├── moodbot/page.js  # AI Companion
│   │   ├── selfcare/page.js # Daily Challenges
│   │   └── about/page.js    # About Page
│   └── components/
│       ├── Navbar.js        # Navigation
│       └── FeatureCard.js   # Reusable Card
│
├── backend/                  # Express.js Server
│   ├── server.js            # Main server + Socket.io
│   ├── routes/
│   │   ├── api.js           # REST API
│   │   └── moodbot.js       # OpenAI Integration
│   └── db/connection.js     # MySQL
│
└── database/
    └── schema.sql           # Database tables
```

## 🎨 Design System

- **Colors:** Purple (#8B5CF6), Teal (#14B8A6), Light Blue (#60A5FA)
- **Typography:** Inter (Google Fonts)
- **Style:** Soft gradients, rounded cards (16-24px radius), subtle shadows
- **Animations:** Hover lift effects, floating icons, smooth transitions
- **Vibe:** Clean, calming, Gen-Z friendly (not childish, not corporate)

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rooms` | GET | List all chat rooms |
| `/api/selfcare/challenge` | GET | Random daily challenge |
| `/api/moodbot/chat` | POST | Chat with AI MoodBot |

## ⚡ Socket.io Events

| Event | Description |
|-------|-------------|
| `join_room` | Join a chat room |
| `send_message` | Send message to room |
| `receive_message` | Receive messages |
| `typing` / `stop_typing` | Typing indicators |

## 🔐 Environment Variables

```env
# Backend (.env)
PORT=5000
OPENAI_API_KEY=your_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=mindlink
```

## 📱 Pages Overview

1. **Dashboard (/)** - Hero section, feature cards, testimonials, CTA
2. **Chat (/chat)** - Real-time peer chat rooms with toggle options
3. **MoodBot (/moodbot)** - AI wellness companion interface
4. **Self-Care (/selfcare)** - Daily challenge generator with progress
5. **About (/about)** - Mission, problem/solution, technology stack

## 🎯 Overall Goal

- Promote mental health awareness among college students
- Encourage empathy and peer support
- Make students feel safe, heard, and emotionally supported
- Present the platform as a real, trustworthy startup

## ⚠️ Important Note

MindLink+ is a peer support platform and **not a substitute for professional mental health care**. If you're experiencing a crisis, please contact your local mental health helpline.

## 📄 License

© 2026 MindLink+. Built with 💜 for student wellbeing.
