// Sample admin accounts for local seeding.
// Replace these placeholder values in your private environment before running:
// npm run seed:admins
//
// Passwords here are plain text only until seedAdmins.js hashes them with bcrypt.

module.exports = [
  {
    name: 'Admin One',
    email: 'admin1@example.com',
    password: 'change-me-admin-1',
    role: 'admin'
  },
  {
    name: 'Admin Two',
    email: 'admin2@example.com',
    password: 'change-me-admin-2',
    role: 'admin'
  },
  {
    name: 'Admin Three',
    email: 'admin3@example.com',
    password: 'change-me-admin-3',
    role: 'admin'
  },
  {
    name: 'Admin Four',
    email: 'admin4@example.com',
    password: 'change-me-admin-4',
    role: 'admin'
  }
];
