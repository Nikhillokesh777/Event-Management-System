const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      // 1. Check email domain
 

      // 2. Find user in DB
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { 
          message: '❌ No account found with this email' 
        });
      }

      // 3. Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { 
          message: '❌ Incorrect password' 
        });
      }

      // 4. Success
      return done(null, user);

    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;