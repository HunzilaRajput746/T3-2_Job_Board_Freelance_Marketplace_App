const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverMessage: { type: String, required: true, trim: true },
  portfolioLink: { type: String, trim: true },
  status: { type: String, enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], default: 'Pending' },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
module.exports = mongoose.model('Application', applicationSchema);
