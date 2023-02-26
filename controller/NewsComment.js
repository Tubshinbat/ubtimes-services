const NewsComment = require("../models/NewsComment");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const News = require("../models/News");
const { valueRequired } = require("../lib/check");
const Paginate = require("../utils/paginate");

exports.createComment = asyncHandler(async (req, res, next) => {
  let comment = await NewsComment.create(req.body);

  res.status(200).json({
    success: true,
    data: comment,
  });
});

const newsSearch = async (key) => {
  const ids = await News.find({
    name: { $regex: ".*" + key + ".*", $options: "i" },
  }).select("_id");
  return ids;
};

exports.getComments = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  let sort = req.query.sort || { createAt: -1 };
  const select = req.query.select;

  // News Comment fields
  const newsId = req.query.newsId;
  const news = req.query.news;
  const name = req.query.name;
  const comment = req.query.comment;

  let query = NewsComment.find();

  if (valueRequired(newsId)) {
    query.where("news").equals(newsId);
  }

  if (valueRequired(name)) {
    query.find({ name: { $regex: ".*" + name + ".*", $options: "i" } });
  }

  if (valueRequired(comment)) {
    query.find({ comment: { $regex: ".*" + comment + ".*", $options: "i" } });
  }

  if (valueRequired(news)) {
    const newsIds = await newsSearch(news);
    if (newsIds.length > 0) {
      query.where("news").in(newsIds);
    }
  }

  // sort

  if (valueRequired(sort)) {
    if (typeof sort === "string") {
      const spliteSort = sort.split(":");
      if (spliteSort.length > 0) {
        let convertSort = {};
        if (spliteSort[1] === "ascend") {
          convertSort = { [spliteSort[0]]: 1 };
        } else {
          convertSort = { [spliteSort[0]]: -1 };
        }
        if (spliteSort[0] != "undefined") query.sort(convertSort);
      }

      const splite = sort.split("_");
      if (splite.length > 0) {
        let convertSort = {};
        if (splite[1] === "ascend") {
          convertSort = { [splite[0]]: 1 };
        } else {
          convertSort = { [splite[0]]: -1 };
        }
        if (splite[0] != "undefined") query.sort(convertSort);
      }
    } else {
      query.sort(sort);
    }
  }

  query.populate("news");
  // query.select(select);

  const qc = query.toConstructor();
  const clonedQuery = new qc();
  const result = await clonedQuery.count();

  const pagination = await Paginate(page, limit, NewsComment, result);
  query.limit(limit);
  query.skip(pagination.start - 1);
  const newsComments = await query.exec();

  res.status(200).json({
    success: true,
    data: newsComments,
    pagination,
  });
});

exports.getFullData = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  let sort = req.query.sort || { createAt: -1 };
  const select = req.query.select;

  // News Comment fields
  const newsId = req.query.newsId;
  const news = req.query.news;
  const name = req.query.name;
  const comment = req.query.comment;

  let query = NewsComment.find();

  if (valueRequired(newsId)) {
    query.where("news").equals(newsId);
  }

  if (valueRequired(name)) {
    query.find({ name: { $regex: ".*" + name + ".*", $options: "i" } });
  }

  if (valueRequired(comment)) {
    query.find({ comment: { $regex: ".*" + comment + ".*", $options: "i" } });
  }

  if (valueRequired(news)) {
    const newsIds = await newsSearch(news);
    if (newsIds.length > 0) {
      query.where("news").in(newsIds);
    }
  }

  // sort

  if (valueRequired(sort)) {
    if (typeof sort === "string") {
      const spliteSort = sort.split(":");
      if (spliteSort.length > 0) {
        let convertSort = {};
        if (spliteSort[1] === "ascend") {
          convertSort = { [spliteSort[0]]: 1 };
        } else {
          convertSort = { [spliteSort[0]]: -1 };
        }
        if (spliteSort[0] != "undefined") query.sort(convertSort);
      }

      const splite = sort.split("_");
      if (splite.length > 0) {
        let convertSort = {};
        if (splite[1] === "ascend") {
          convertSort = { [splite[0]]: 1 };
        } else {
          convertSort = { [splite[0]]: -1 };
        }
        if (splite[0] != "undefined") query.sort(convertSort);
      }
    } else {
      query.sort(sort);
    }
  }

  query.populate("news");
  query.select(select);

  const newsComments = await query.exec();

  res.status(200).json({
    success: true,
    data: newsComments,
  });
});

exports.getComment = asyncHandler(async (req, res) => {
  const comment = await NewsComment.findById(req.params.id).populate("news");

  if (!comment) {
    throw new MyError(req.params.id + " Өгөгдөл олдсонгүй.", 404);
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await NewsComment.findById(req.params.id);
  if (!comment) {
    throw new MyError(req.params.id + " өгөгдөл олдсонгүй", 404);
  }
  comment.remove();

  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.updateComment = asyncHandler(async (req, res, next) => {
  const comment = await NewsComment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!comment) {
    throw new MyError("Уучлаарай хадгалах явцад алдаа гарлаа", 400);
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.multDeleteComment = asyncHandler(async (req, res, next) => {
  const ids = req.queryPolluted.id;
  const findComment = await NewsComment.find({ _id: { $in: ids } });

  if (findComment.length <= 0) {
    throw new MyError("Таны сонгосон өгөгдөлүүд олдсонгүй", 400);
  }

  const comments = await NewsComment.deleteMany({ _id: { $in: ids } });

  res.status(200).json({
    success: true,
  });
});

exports.getCountNewsComment = asyncHandler(async (req, res, next) => {
  const newsId = req.query.newsId;
  let comment = 0;
  if (newsId) {
    comment = await NewsComment.count({ news: newsId });
  } else {
    comment = await NewsComment.count();
  }

  res.status(200).json({
    success: true,
    data: comment,
  });
});
