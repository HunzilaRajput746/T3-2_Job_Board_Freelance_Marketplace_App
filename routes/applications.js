const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect, allow } = require('../middleware/auth');

const router = express.Router();
const isOwner = (job, user) => job.employerId.toString() === user._id.toString();

router.post('/:jobId', protect, allow('Candidate'), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'Open') return res.status(400).json({ message: 'This job is no longer accepting applications' });
    if (await Application.findOne({ jobId: job._id, candidateId: req.user._id })) return res.status(409).json({ message: 'You have already applied to this job' });
    res.status(201).json(await Application.create({ jobId: job._id, candidateId: req.user._id, coverMessage: req.body.coverMessage, portfolioLink: req.body.portfolioLink }));
  } catch (error) { next(error); }
});

router.get('/my-applications', protect, allow('Candidate'), async (req, res, next) => {
  try { res.json(await Application.find({ candidateId: req.user._id }).populate('jobId', 'title status employerId').sort({ appliedAt: -1 })); } catch (error) { next(error); }
});

router.get('/job/:jobId', protect, allow('Employer'), async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (!isOwner(job, req.user)) return res.status(403).json({ message: 'Only the job creator can view applicants' });
    res.json(await Application.find({ jobId: job._id }).populate('candidateId', 'name email').sort({ appliedAt: -1 }));
  } catch (error) { next(error); }
});

router.put('/:appId/status', protect, allow('Employer'), async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.appId).populate('jobId');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (!isOwner(application.jobId, req.user)) return res.status(403).json({ message: 'Only the job creator can update this application' });
    if (!['Pending', 'Reviewed', 'Accepted', 'Rejected'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid application status' });
    application.status = req.body.status;
    res.json(await application.save());
  } catch (error) { next(error); }
});

module.exports = router;
