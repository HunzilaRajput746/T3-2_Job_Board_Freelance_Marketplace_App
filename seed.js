require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

async function seed() {
  await connectDB();
  await Promise.all([Application.deleteMany(), Job.deleteMany(), User.deleteMany()]);
  const password = await bcrypt.hash('Orbitwork2026!', 12);
  const [employer, candidate] = await User.create([
    { name: 'Maya Chen', email: 'employer@demo.com', password, role: 'Employer' },
    { name: 'Jordan Rivera', email: 'candidate@demo.com', password, role: 'Candidate' }
  ]);
  await Job.create([
    { title: 'Senior React Developer', description: 'Lead the frontend architecture for a climate analytics platform. Strong React, TypeScript, and accessibility experience required.', employerId: employer._id },
    { title: 'Product UI/UX Designer', description: 'Shape a thoughtful workflow for independent creators, from discovery through project delivery.', employerId: employer._id },
    { title: 'Node.js API Engineer', description: 'Build reliable REST services and data integrations for a growing remote-first product team.', employerId: employer._id, status: 'Closed' }
  ]);
  console.log('Seed complete. Demo password for both accounts: Orbitwork2026!');
  await mongoose.disconnect();
}
seed().catch(async (error) => { console.error(error); await mongoose.disconnect(); process.exit(1); });
