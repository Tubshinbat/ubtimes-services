const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createComment,
  getComments,
  getComment,
  multDeleteComment,
  updateComment,
  getCountNewsComment,
  getFullData,
} = require("../controller/NewsComment");

router.route("/").post(createComment).get(getComments);
router.route("/delete").delete(protect, authorize("admin"), multDeleteComment);
router.route("/count").get(getCountNewsComment);
router.route("/excel").get(protect, getFullData);

router
  .route("/:id")
  .get(protect, authorize("admin"), getComment)
  .put(protect, authorize("admin"), updateComment);

module.exports = router;
