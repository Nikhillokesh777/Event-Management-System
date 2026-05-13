const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('./config/passport');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

connectDB().then(() => {
  const store = new MongoStore({
    mongooseConnection: mongoose.connection,
    secret: process.env.JWT_SECRET,
    touchAfter: 24 * 3600
  });

  store.on('error', (err) => {
    console.log('Session store error', err);
  });

  app.use(session({
    store,
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  }));

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;
    next();
  });

  app.get('/', (req, res) => {
    res.json({ message: 'Event Management API is running!', user: req.user || null });
  });

  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/events', require('./routes/events'));
  app.use('/api/registrations', require('./routes/Registrations'));
  app.use('/api/attendance', require('./routes/Attendance'));

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong!' } = err;
    res.status(status).json({ message });
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to DB:', err.message);
  process.exit(1);
});
