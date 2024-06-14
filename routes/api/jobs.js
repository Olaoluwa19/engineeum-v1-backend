const express = require("express");
const router = express.Router();
const jobsController = require("../../controllers/jobsController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.User), jobsController.getJobs)
  .delete(verifyRoles(ROLES_LIST.Editor), jobsController.deleteJobs);

router
  .route("/:userid")
  .get(
    verifyRoles(ROLES_LIST.Editor, ROLES_LIST.User),
    jobsController.getUserJobs
  )
  .post(
    verifyRoles(ROLES_LIST.Editor, ROLES_LIST.User),
    jobsController.createJob
  );

router
  .route("/:id")
  .patch(
    verifyRoles(ROLES_LIST.Editor, ROLES_LIST.User),
    jobsController.updateJob
  );

module.exports = router;
