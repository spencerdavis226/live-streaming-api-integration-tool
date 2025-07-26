import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// OAuth 2.0 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI ||
    'http://localhost:3001/auth/google/callback'
);

// YouTube API scopes
const SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl',
];

// Store for temporary state values (in production, use Redis or database)
const stateStore = new Map();

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Get authentication status
app.get('/api/auth/status', (req, res) => {
  try {
    const isAuthenticated = !!(
      req.session.tokens && req.session.tokens.access_token
    );
    res.json({
      isAuthenticated,
      user: req.session.user || null,
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Initiate Google OAuth flow
app.get('/api/auth/google', (req, res) => {
  try {
    const state = uuidv4();
    stateStore.set(state, { timestamp: Date.now() });

    // Clean up old state values (older than 1 hour)
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    for (const [key, value] of stateStore.entries()) {
      if (value.timestamp < oneHourAgo) {
        stateStore.delete(key);
      }
    }

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      state: state,
      prompt: 'consent', // Force consent screen to get refresh token
    });

    res.json({ authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
});

// Handle OAuth callback
app.get('/auth/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query;

    // Verify state parameter
    if (!state || !stateStore.has(state)) {
      return res.redirect(`${process.env.CLIENT_URL}?error=invalid_state`);
    }
    stateStore.delete(state);

    if (!code) {
      return res.redirect(`${process.env.CLIENT_URL}?error=no_code`);
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // Store tokens and user info in session
    req.session.tokens = tokens;
    req.session.user = {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };

    res.redirect(`${process.env.CLIENT_URL}?auth=success`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.CLIENT_URL}?error=auth_failed`);
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get upcoming YouTube Live broadcasts
app.get('/api/youtube/broadcasts', async (req, res) => {
  try {
    if (!req.session.tokens) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    oauth2Client.setCredentials(req.session.tokens);
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    // Get upcoming live broadcasts
    const response = await youtube.liveBroadcasts.list({
      part: ['id', 'snippet', 'status'],
      broadcastStatus: 'upcoming',
      maxResults: 25,
    });

    const broadcasts = response.data.items || [];

    // Format the response with additional details
    const formattedBroadcasts = broadcasts.map((broadcast) => ({
      id: broadcast.id,
      title: broadcast.snippet.title,
      description: broadcast.snippet.description,
      scheduledStartTime: broadcast.snippet.scheduledStartTime,
      thumbnail: broadcast.snippet.thumbnails?.default?.url || null,
      status: broadcast.status.lifeCycleStatus,
      privacyStatus: broadcast.status.privacyStatus,
    }));

    res.json({
      broadcasts: formattedBroadcasts,
      totalResults: response.data.pageInfo?.totalResults || 0,
    });
  } catch (error) {
    console.error('Error fetching YouTube broadcasts:', error);

    if (error.code === 401) {
      // Token might be expired, clear session
      req.session.destroy();
      return res
        .status(401)
        .json({ error: 'Authentication expired. Please login again.' });
    }

    res.status(500).json({
      error: 'Failed to fetch broadcasts',
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
