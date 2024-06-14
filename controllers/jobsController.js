const mongoose = require("mongoose");
const Job = require("../models/Job");
const bcrypt = require("bcryptjs");

const getJobs = async (req, res) => {
  const jobs = await Job.find();
  if (!jobs) return res.status(204).json({ message: "No jobs found." });
  res.status(200).json({
    totaljobs: jobs.length,
    jobs,
  });
};

const createJob = async (req, res) => {
  const { user, company, position } = req.body;
  if (!user || !company || !position) {
    return res
      .status(400)
      .json({ message: "Please fill in the required fields." });
  }

  if (!mongoose.isValidObjectId(user))
    return res.status(400).json({ message: `No user ID matches ${user}.` });

  const job = await Job.create({
    user,
    company,
    position,
  });
  res.status(201).json({ job });
};

const deleteJobs = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Job ID required." });
  }
  if (!mongoose.isValidObjectId(req.body.id))
    return res
      .status(400)
      .json({ message: `No job ID matches ${req.body.id}.` });

  const job = await Job.findOne({ _id: req.body.id }).exec();
  const result = await job.deleteOne({ _id: req.body.id });

  res.json(result);
};

module.exports = {
  getJobs,
  createJob,
  deleteJobs,
};
