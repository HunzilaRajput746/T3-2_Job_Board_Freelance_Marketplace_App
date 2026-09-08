const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { issueToken } = require('../middleware/auth');

const router = express.Router();
const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email, role: user.role });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !['Employer', 'Candidate'].includes(role)) return res.status(400).json({ message: 'Name, email, password, and a valid role are required' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'An account with this email already exists' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role });
    res.status(201).json({ user: publicUser(user), token: issueToken(user) });
  } catch (error) { next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email?.toLowerCase() });
    if (!user || !(await bcrypt.compare(req.body.password || '', user.password))) return res.status(401).json({ message: 'Invalid email or password' });
    res.json({ user: publicUser(user), token: issueToken(user) });
  } catch (error) { next(error); }
});

module.exports = router;
