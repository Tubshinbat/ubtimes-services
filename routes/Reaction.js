const express = require("express");
const router = express.Router();

const { createReaction, getReactions } = require("../controller/Reaction");

router.route("/").post(createReaction).get(getReactions);

module.exports = router;
