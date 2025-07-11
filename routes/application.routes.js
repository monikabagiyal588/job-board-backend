const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
// const { Application } = require('../models'); // Sequelize model
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/cloudinary');
const db = require('../models');
const Job = db.job;
const User = db.user;
const Application = db.application;

// Storage config
// const storage = multer.diskStorage({
//   destination: './uploads/resumes/',
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   }
// });
const { sendConfirmationEmail } = require('../utils/emailService');
// const upload = multer({ storage });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'job-board-resumes',
    resource_type: 'auto', // allow PDF, DOC, etc.
    public_id: (req, file) => `${Date.now()}_${file.originalname}`
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX allowed'));
    }
  }
});

// POST /api/applications
router.post('/', upload.single('resume'), async (req, res) => {

  try {
    const { jobId, userId, message } = req.body;
    const resumeUrl = req.file.path;

    const application = await Application.create({
      jobId,
      userId,
      message,
      resumeUrl,
      appliedAt: new Date()
    });
 // Fetch user email & job title (for email)
    const user = await User.findByPk(userId);
    const job = await Job.findByPk(jobId);

    if (user && job) {
      await sendConfirmationEmail(user.email, job.title,resumeUrl);
    }
    res.status(201).json({ message: 'Application submitted', application });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});
// GET /api/applications?jobId=xyz
// router.get('/', async (req, res) => {
//   try {
//     const applications = await Application.findAll({
//       where: {
//         jobId: req.query.jobId // or userId for "My Applications"
//       }
//     });

//     res.json(applications);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching applications' });
//   }
// });



// GET /api/applications?jobId=1&page=1&limit=5
router.get('/', async (req, res) => {
  
  try {
    const { jobId, page ,limit } = req.query;
    const offset = (page - 1) * limit;

    const { rows, count } = await Application.findAndCountAll({
      where: { jobId },
      include: [
        { model: Job, attributes: ['title'] },
        { model: User, attributes: ['name', 'email'] }
      ],
      
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['appliedAt', 'DESC']]
      
    });

    res.status(200).json({
      applications: rows,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching applicants' });
  }
});

module.exports = router;

