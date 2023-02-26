const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  createPosition,
  getPositions,
  changePosition,
  getPosition,
  deletetPosition,
  updatePosition,
} = require("../controller/HomePosition");

router
  .route("/")
  .post(protect, authorize("admin"), createPosition)
  .get(getPositions);

router.route("/change").post(protect, authorize("admin"), changePosition);

// "/api/v1/News-categories/id"
router
  .route("/:id")
  .get(getPosition)
  .delete(protect, authorize("admin"), deletetPosition)
  .put(protect, authorize("admin"), updatePosition);

module.exports = router;
