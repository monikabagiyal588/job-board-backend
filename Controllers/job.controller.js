const db = require('../models');
const Job = db.job;
const User = db.user;
const Application = db.application;

// Create Job (Recruiter)
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, salary } = req.body;
    const job = await Job.create({
      title, company, location, description, salary,
      userId: req.userId  // from middleware
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Jobs (Public)
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      include: [{ model: User, as: 'poster', attributes: ['name', 'email'] }]
    });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Apply to a Job (User)
exports.applyToJob = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Check if already applied
    const exists = await Application.findOne({
      where: { userId: req.userId, jobId }
    });

    if (exists) return res.status(400).json({ message: 'Already applied' });

    await Application.create({
      userId: req.userId,
      jobId
    });

    res.status(200).json({ message: 'Applied successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get My Applications (User)
exports.getMyApplications = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: {
        model: Job,
        as: 'appliedJobs',
        include: ['poster'],
        through: { attributes: ['appliedAt'] }
      }
    });

    const formatted = user.appliedJobs.map(job => ({
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      appliedAt: job.application.appliedAt
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { userId: req.userId }
    });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};