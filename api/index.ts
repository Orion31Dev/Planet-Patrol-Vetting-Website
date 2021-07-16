const express = require('express');
const app = express();
const path = require('path');

const port = process.env.PORT || 3000;

// load environment variables from .env if not in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Google Auth Library client creation
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

// Cloudant instance creation (lowercase c for instance)
const Cloudant = require('@cloudant/cloudant');
const cloudant = new Cloudant({ url: process.env.CLOUDANT_URL, plugins: { iamauth: { iamApiKey: process.env.CLOUDANT_API_KEY } } });

const db = cloudant.use('planet-patrol-db');

// Local files
const DIST_DIR = path.join(__dirname, '../dist');
const INDEX_FILE = path.join(__dirname, '../dist/index.html');

// Express Middleware
app.use(express.static(DIST_DIR));
app.use(express.json());

var session = require('express-session');

// Express session settings
let sess = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
  },
};

//app.set('trust proxy', 1); // trust first proxy

if (process.env.NODE_ENV !== 'production') {
  sess.cookie.secure = false;
}

app.use(session(sess));

// Middleware to automatically set req.user property if the user already logged in
app.use(async (req: any, res: any, next: Function) => {
  if (req.session.userId) {
    try {
      req.user = await db.get(req.session.userId);
    } catch {}
  }

  next();
});

// Get user data
app.post('/api/auth/google', async (req: any, res: any) => {
  const { token } = req.body;

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  const { email } = ticket.getPayload();

  let userId = 'user:' + email;

  let user;

  try {
    // Try to find the existing user
    user = await db.get(userId);
  } catch {
    // User not found, create the user
    user = { _id: userId };
    db.insert(user);
  }

  // Save userId for later API calls
  req.session.userId = userId;

  res.status(201);
  res.json(user);
});

// Logout
app.delete('/api/auth/logout', async (req: any, res: any) => {
  await req.session.destroy(); // Destroy saved userId

  res.status(200);
  res.json({
    message: 'Logged out successfully.',
  });
});

app.get('/api/me', async (req: any, res: any) => {
  if (req.user) {
    res.status(200);
  } else {
    res.status(404);
  }

  res.json(req.user);
});

app.get('/*', (_req: any, res: any) => {
  res.sendFile(INDEX_FILE, { DIST_DIR });
});

app.listen(port);
