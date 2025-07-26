# YouTube Live Streaming API Integration Tool


## 📺 Demo Video

Check out a short demo of this project on YouTube:

[![YouTube Demo](https://img.youtube.com/vi/4e_eCN_Lsqs/0.jpg)](https://youtube.com/shorts/4e_eCN_Lsqs?feature=share)

---
# YouTube Live Streaming API Integration Tool
A full-stack application for managing YouTube Live broadcasts with Google OAuth 2.0 authentication. Built with React (frontend) and Node.js/Express (backend).

## Features

### Current (MVP)

- ✅ Google OAuth 2.0 authentication
- ✅ View upcoming YouTube Live broadcasts
- ✅ Display broadcast details (title, scheduled time, thumbnail, status)
- ✅ Responsive design
- ✅ Session management
- ✅ Error handling

### Future Ideas

- 📋 Create new live broadcasts
- ⚙️ Edit broadcast settings
- 📊 View broadcast analytics
- 📱 Real-time chat integration
- 🔔 Notification system for upcoming streams
- 📺 Multi-platform streaming (Twitch, Facebook Live)
- 🎥 Stream management tools
- 📈 Audience engagement metrics

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── assets/         # Static assets
│   ├── public/
│   └── package.json
├── server/                 # Node.js/Express backend
│   ├── index.js           # Main server file
│   ├── .env.example       # Environment variables template
│   └── package.json
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google Cloud Console account
- YouTube channel (for testing)

## Setup Instructions

### 1. Google OAuth Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3:
   - Go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3001/auth/google/callback` (development)
     - Your production callback URL (when deployed)
   - Add authorized JavaScript origins:
     - `http://localhost:3001` (development)
     - Your production domain (when deployed)
5. Copy the Client ID and Client Secret

### 2. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
PORT=3001
CLIENT_URL=http://localhost:5173

# Google OAuth 2.0 Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/auth/google/callback

# Session Configuration
SESSION_SECRET=your-very-secure-session-secret-change-this-in-production

# Environment
NODE_ENV=development
```

Start the backend server:

```bash
npm run dev
```

The server will run on http://localhost:3001

### 3. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
```

Edit the client `.env` file if needed:

```env
# Client Configuration
VITE_API_URL=http://localhost:3001
```

Start the frontend development server:

```bash
npm run dev
```

The client will run on http://localhost:5173

### 4. Testing the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign in with Google"
3. Authorize the application with your Google account
4. You should see your upcoming YouTube Live broadcasts (if any)

## API Endpoints

### Authentication

- `GET /api/auth/status` - Get current authentication status
- `GET /api/auth/google` - Get Google OAuth URL
- `GET /auth/google/callback` - Handle OAuth callback
- `POST /api/auth/logout` - Logout user

### YouTube API

- `GET /api/youtube/broadcasts` - Get upcoming live broadcasts

## OAuth Scopes

The application requests the following Google OAuth scopes:

- `https://www.googleapis.com/auth/youtube.readonly` - Read access to YouTube data
- `https://www.googleapis.com/auth/youtube.force-ssl` - Manage YouTube account

## Environment Variables

### Server (.env)

- `PORT` - Server port (default: 3001)
- `CLIENT_URL` - Frontend URL for CORS
- `GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth Client Secret
- `GOOGLE_REDIRECT_URI` - OAuth callback URL
- `SESSION_SECRET` - Session encryption secret
- `NODE_ENV` - Environment (development/production)

### Client (.env)

- `VITE_API_URL` - Backend API URL

## Development

### Backend Development

```bash
cd server
npm run dev  # Uses --watch flag for auto-restart
```

### Frontend Development

```bash
cd client
npm run dev  # Vite development server with HMR
```

### Linting

```bash
cd client
npm run lint
```

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Use HTTPS URLs for all OAuth redirect URIs
3. Set `cookie.secure=true` in session configuration
4. Use a proper session store (Redis, Database) instead of in-memory
5. Add rate limiting and security headers

### Build

```bash
# Backend
cd server
npm start

# Frontend
cd client
npm run build
npm run preview
```

## Troubleshooting

### Common Issues

1. **OAuth Error: "redirect_uri_mismatch"**

   - Ensure the redirect URI in Google Console matches exactly
   - Check for trailing slashes or protocol mismatches

2. **"No broadcasts found"**

   - Create a test broadcast in YouTube Studio
   - Ensure your account has a verified YouTube channel
   - Check that broadcasts are scheduled for the future

3. **CORS Errors**

   - Verify `CLIENT_URL` in server `.env`
   - Check that the frontend is running on the specified port

4. **Session Issues**
   - Clear browser cookies
   - Restart the server
   - Check `SESSION_SECRET` is set

### Debug Mode

Set `NODE_ENV=development` and check console logs for detailed error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues related to:

- Google OAuth: Check [Google OAuth 2.0 documentation](https://developers.google.com/identity/protocols/oauth2)
- YouTube API: Check [YouTube Data API documentation](https://developers.google.com/youtube/v3)
- React/Vite: Check [Vite documentation](https://vitejs.dev/)
- Express: Check [Express.js documentation](https://expressjs.com/)
