 # Video Connect – MERN Video Conferencing App

  Video Connect is a full-stack video conferencing web application built using the **MERN** stack. It features real-time communication powered by **Socket.IO**, user authentication using **JWT**, and persistent user/room data stored in **MongoDB**.

## 🌐 Live Demo
  Coming soon...

## 🚀 Features

### ✅ Frontend
- Join/Create video conferencing rooms
- Responsive UI with Tailwind CSS
- WebRTC-based video/audio communication
- Real-time updates via Socket.IO

### ✅ Backend
- User Registration & Login with JWT authentication
- Protected API routes
- Create & Join rooms
- MongoDB persistence with Mongoose
- Real-time socket management

## ⚙️ Tech Stack
| Layer     | Tech Stack                            |
| --------- | ------------------------------------- |
| Frontend  | React, Vite, TypeScript, Tailwind CSS |
| Backend   | Node.js, Express, MongoDB, Mongoose   |
| Auth      | JSON Web Token (JWT), bcryptjs        |
| Real-time | Socket.IO                             |

## 🧪 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/SKChauhan17/Video-Conferencing-App.git
cd Video-Conferencing-App
```
### 2. Install dependencies
Backend
```bash
cd server
npm install
cp .env.example .env
# Fill in .env with Mongo URI, JWT secret, etc.
npm run dev
```
Frontend
```bash
cd ../client
npm install
npm run dev
```
### 3. Open App
- Frontend: http://localhost:5173   
- Backend: http://localhost:5000

## 🔐 Environment Variables
```env
MONGO_URI=mongodb://localhost:27017/video-connect
JWT_SECRET=your-secure-secret
JWT_EXPIRES_IN=1d
PORT=5000
CLIENT_URL=http://localhost:5173
```
## 📡 API Endpoints
### 🔐 Auth Routes (/api/auth)
| Method	| Endpoint	| Description |
|---------|-----------|-------------|
| POST	| /register	| Register new user |
| POST	| /login	| Login existing user |

### 📺 Room Routes (/api/rooms)
| Method	| Endpoint	| Description |
|---------|-----------|-------------|
| POST	| /	| Create new room |
| POST	| /:roomId/join	| Join room by ID |

### 💻 Socket.IO Events
| Event	| Payload	| Description |
|---------|-----------|-------------|
| join-room |	{ roomId, userId }	| User joins video room |
| user-joined	| userId	| Notifies others of join |
| user-left	| userId	| Notifies others of disconnect |

## 🚧 To-Do / Next Steps
- ✅ JWT-based Authentication
- ✅ MongoDB Room/User storage
- 🔲 Video grid view improvements
- 🔲 Screen sharing
- 🔲 Chat integration
- 🔲 Admin/host features
- 🔲 Deployment to Render/Vercel
