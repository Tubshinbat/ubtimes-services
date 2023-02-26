const Position = require("../models/HomePosition");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");

exports.createPosition = asyncHandler(async (req, res, next) => {
  let position = 0;

  const last = await Position.findOne({}).sort({
    position: -1,
  });
  if (last) {
    position = last.position + 1;
  }

  req.body.position = position;
  const posi = await Position.create(req.body);

  res.status(200).json({
    success: true,
    data: posi,
  });
});

exports.getPositions = asyncHandler(async (req, res, next) => {
  const positions = await Position.find({}).sort({ position: -1 });

  if (!positions) {
    throw new MyError("Нүүр хуудсанд харагдах дараалал оруулаагүй байна");
  }

  res.status(200).json({
    success: true,
    data: positions,
  });
});

exports.getPosition = asyncHandler(async (req, res, next) => {
  const position = await Position.findById(req.params.id);

  if (!position) {
    throw new MyError(req.params.id + " Өгөгдөл олдсонгүй.", 404);
  }

  res.status(200).json({
    success: true,
    data: position,
  });
});

exports.deletetPosition = asyncHandler(async (req, res, next) => {
  const category = await Position.findById(req.params.id);
  if (!category) {
    throw new MyError(req.params.id + " олдсонгүй", 404);
  }

  category.remove();

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.changePosition = asyncHandler(async (req, res) => {
  const positions = req.body.data;

  if (!positions && positions.length > 0) {
    throw new MyError("Дата илгээгүй байна дахин шалгана уу", 404);
  }

  const positionChange = (posi, pKey = null) => {
    if (posi) {
      posi.map(async (el, index) => {
        const data = {
          position: index,
        };
        await Position.findByIdAndUpdate(el.key, data);
      });
    }
  };

  positionChange(positions);

  res.status(200).json({
    success: true,
  });
});

exports.updatePosition = asyncHandler(async (req, res, next) => {
  const data = await Position.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data) {
    throw new MyError("Өгөгдөл олдсонгүй", 404);
  }

  res.status(200).json({
    success: true,
    data,
  });
});
