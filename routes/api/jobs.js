const express = require("express");
const router = express.Router();
const jobsController = require("../../controllers/jobsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.User), jobsController.getJobs)
  .post(
    verifyRoles(ROLES_LIST.Editor, ROLES_LIST.User),
    jobsController.createJob
  )
  .delete(verifyRoles(ROLES_LIST.Editor), jobsController.deleteJobs);

module.exports = router;
