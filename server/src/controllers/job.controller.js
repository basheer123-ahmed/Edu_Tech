const { prisma } = require('../config/db');

const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: { company: { include: { user: { select: { name: true } } } } }
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

const createJob = async (req, res) => {
  const { title, description, salary, location, type, skills } = req.body;
  const company = await prisma.company.findUnique({ where: { userId: req.user.id } });

  if (!company) {
    return res.status(403).json({ message: 'Only companies can post jobs' });
  }

  try {
    const job = await prisma.job.create({
      data: {
        title,
        description,
        salary,
        location,
        type,
        skills,
        companyId: company.id
      }
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error posting job', error: error.message });
  }
};

module.exports = { getAllJobs, createJob };
