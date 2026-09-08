const express = require('express');
const Job = require('../models/Job');
const { protect, allow } = require('../middleware/auth');

const router = express.Router();
const owner = (job, user) => job.employerId.toString() === user._id.toString();

router.get('/', async (req, res, next) => {
  try { res.json(await Job.find().populate('employerId', 'name').sort({ createdAt: -1 })); } catch (error) { next(error); }
});

router.post('/', protect, allow('Employer'), async (req, res, next) => {
  try { res.status(201).json(await Job.create({ title: req.body.title, description: req.body.description, status: req.body.status || 'Open', employerId: req.user._id })); } catch (error) { next(error); }
});

router.put('/:id', protect, allow('Employer'), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!owner(job, req.user)) return res.status(403).json({ message: 'Only the job creator can edit it' });
    Object.assign(job, { title: req.body.title ?? job.title, description: req.body.description ?? job.description, status: req.body.status ?? job.status });
    res.json(await job.save());
  } catch (error) { next(error); }
});

router.delete('/:id', protect, allow('Employer'), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!owner(job, req.user)) return res.status(403).json({ message: 'Only the job creator can delete it' });
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (error) { next(error); }
});

module.exports = router;
