const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../../middleware/verifyRoles");

router
  .route("/")
  .get(verifyRoles(ROLES_LIST.Editor), userController.getAllUser)
  .put(userController.updateUser)
  .delete(verifyRoles(ROLES_LIST.Editor), userController.deleteUser);

router
  .route("/role:roles?")
  .get(verifyRoles(ROLES_LIST.Editor), userController.filterUsers);
router.route("/:id").get(userController.getUser);

module.exports = router;
