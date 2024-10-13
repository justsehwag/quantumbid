const asyncHandler = (cb) => async (req, res, next) => {
  try {
    await cb(req, res, next);
  } catch (error) {
    next(error);
  }
};

module.exports = asyncHandler;
