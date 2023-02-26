const Reaction = require("../models/Reaction");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");

exports.createReaction = asyncHandler(async (req, res, next) => {
  const newsId = req.body.newsId;
  const type = req.body.type;
  const isReaction = await Reaction.findOne({})
    .where("type")
    .equals(type)
    .where("news")
    .equals(newsId);

  if (isReaction) {
    req.body.count = isReaction.count + 1;
    await Reaction.findOneAndUpdate({ type: type, news: newsId }, req.body);
  } else {
    req.body.count + 1;
    Reaction.create(req.body);
  }

  res.status(200).json({
    success: true,
  });
});

exports.getReactions = asyncHandler(async (req, res, next) => {
  const newsId = req.query.newsId;

  if (newsId) {
    query = await Reaction.find({})
      .where("news")
      .in(newsId)
      .sort({ createAt: -1 });
  }

  res.status(200).json({
    success: true,
    data: query,
  });
});
