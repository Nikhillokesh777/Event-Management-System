// backEnd/seedAdmins.js
// ─────────────────────────────────────────────────────────────────────────────
// Run this script once to insert the 4 admin accounts into MongoDB.
// Command:  npm run seed:admins
//
// What this script does:
//   1. Connects to MongoDB using MONGO_URI from your .env file
//   2. Loops through the 4 admins in config/admins.js
//   3. For each admin — checks if that email already exists in the DB
//      - EXISTS   → skips it (never overwrites an existing admin)
//      - MISSING  → hashes the plain password with bcrypt, then inserts the record
//   4. Disconnects and exits
//
// Safe to run multiple times — will never create duplicates.
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();                  // reads MONGO_URI from backEnd/.env
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');
const admins   = require('./config/admins');

async function seedAdmins() {
  try {
    // 1. Connect
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // 2. Loop through each admin in config
    for (const admin of admins) {

      // 3. Check if this email already exists
      const existing = await User.findOne({ email: admin.email });

      if (existing) {
        console.log(`⏭️  Already exists, skipping: ${admin.email}`);
        continue;
      }

      // 4. Hash the plain password before saving — NEVER store plain text
      const salt           = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(admin.password, salt);

      // 5. Insert admin — role is hardcoded to 'admin' from config, not from any request
      await User.create({
        name:     admin.name,
        email:    admin.email,
        password: hashedPassword,
        role:     'admin'          // always 'admin' — never comes from user input
      });

      console.log(`✅ Admin seeded: ${admin.email}`);
    }

    console.log('\n🎉 Seeding complete.');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seedAdmins();