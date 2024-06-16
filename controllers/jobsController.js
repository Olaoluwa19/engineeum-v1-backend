const mongoose = require("mongoose");
const Job = require("../models/Job");
const moment = require("moment");

const getJobs = async (req, res) => {
  const jobs = await Job.find();
  if (!jobs) return res.status(204).json({ message: "No jobs found." });
  res.status(200).json({
    totaljobs: jobs.length,
    jobs,
  });
};

const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    return res
      .status(400)
      .json({ message: "Please fill in the required fields." });
  }

  req.body.createdBy = req.params.userId;
  // req.body.createdBy = await Job.find({ user: req.user.userId }).exec();

  if (!mongoose.isValidObjectId(req.body.createdBy))
    return res
      .status(400)
      .json({ message: `No user ID matches ${req.body.createdBy}.` });

  console.log(req.body.createdBy);
  const job = await Job.create(req.body);
  res.status(201).json({ job });
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: `No job ID matches ${id}` });
    }

    const job = await Job.findOne({ _id: id }).exec();

    const updatedJob = await Job.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    return res.status(201).json({
      success: true,
      message: `${updatedJob.id} updated Successfully.`,
      updatedJob,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Error in Updating Job details",
      sucess: false,
      error: `${error.message}`,
    });
  }
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

const getUserJobs = async (req, res) => {
  const userJobs = await Job.find({ createdBy: req.params.userId }).sort({
    createdAt: -1,
  });

  if (!userJobs) {
    return res.status(204).json({ message: "No Jobs Found." });
  }
  res.status(200).json({
    totaljobs: userJobs.length,
    userJobs,
  });
};

const getJobStats = async (req, res) => {
  const stats = await Job.aggregate([
    // search by user jobs
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.params.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // default stats
  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  // monthly yearly stats
  let monthlyApplication = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.params.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  res
    .status(200)
    .json({ totalJStats: stats.length, defaultStats, monthlyApplication });
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  deleteJobs,
  getUserJobs,
  getJobStats,
};
