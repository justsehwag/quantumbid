const User = require('../models/user');
const Auction = require('../models/auction');
const cloudinary = require('../config/cloudinary');
const asyncHandler = require('../middlewares/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const {
  validateRegister,
  validateLogin,
  isValidUserAvatar,
  validateUserData,
} = require('../validations/user');
const predefinedAvatars = require('../utils/avatars.json');

// @route    POST /api/register
// @desc     Register user to the DB
// @access   Public
module.exports.registerUser = asyncHandler(async (req, res, next) => {
  const userPayload = { ...req.body };

  const { error } = await validateRegister(userPayload);

  if (error)
    return res.status(400).json({
      success: false,
      status: 400,
      message: error.message,
      error,
    });

  const user = new User(userPayload);
  await user.save();

  const token = user.generateAuthToken();

  return res
    .status(201)
    .header('x-auth-token', token)
    .json({
      success: true,
      status: 201,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token,
      },
    });
});

// @route    POST /api/login
// @desc     Login user by sending jwt
// @access   Public
module.exports.loginUser = asyncHandler(async (req, res, next) => {
  const userPayload = { ...req.body };

  const { error } = await validateLogin(userPayload);

  if (error)
    return res.status(400).json({
      success: false,
      status: 400,
      message: error.message,
      error,
    });

  const user = await User.findOne({ email: userPayload.email });
  if (!user)
    return next(new ErrorResponse(401, 'This email is not registered!'));

  if (!(await user.matchPassword(userPayload.password)))
    return next(new ErrorResponse(401, 'Invalid password!'));

  const token = user.generateAuthToken();

  res
    .status(200)
    .header('x-auth-token', token)
    .json({
      success: true,
      status: 200,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token,
      },
    });
});

// @route    GET /api/profile
// @desc     Get details of logged in user
// @access   Private
module.exports.getUserProfile = asyncHandler(async (req, res, next) => {
  let user = req.user;

  if (!user) return next(new ErrorResponse(401, 'Unauthorized access!'));

  const auctionsWonCount = await Auction.find({ winner: user._id }).count();
  const auctionsInitiatedCount = await Auction.find({
    seller: user._id,
  }).count();

  user = { ...req.user._doc };
  user.auctionsWonCount = auctionsWonCount;
  user.auctionsInitiatedCount = auctionsInitiatedCount;
  delete user.password;
  delete user.updatedAt;
  delete user.__v;

  res.status(200).json({
    success: true,
    status: 200,
    data: user,
  });
});

// @route    PATCH /api/profile/changeAvatar
// @desc     Change avatar of user.
// @access   Private
module.exports.changeUserAvatar = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  let avatarUrl = avatar;

  if (!avatar) return next(new ErrorResponse(422, 'Please provide an avatar!'));

  // When data uri (custom image/avatar) is received in request body.
  if (!avatar.startsWith('https://')) {
    try {
      const { isValid, error } = isValidUserAvatar(avatar);
      if (!isValid) return next(new ErrorResponse(400, error));

      const uploadResponse = await cloudinary.uploader.upload(avatar, {
        folder: `auctioneer/users_avatars/${userId}`,
        eager: [
          { aspect_ratio: '1.1', gravity: 'face', crop: 'fill', radius: 'max' },
        ],
      });

      avatarUrl =
        uploadResponse.eager[0]?.secure_url || uploadResponse.secure_url;
    } catch (error) {
      const message = 'Unable to change avatar. Try again after some time!';
      return next(new ErrorResponse(500, message));
    }
  } else {
    // When avatar is one of predefined avatars then validate link.
    const matchAvatars = (predefinedAvatar) => predefinedAvatar === avatarUrl;
    const validPredefinedAvatar = predefinedAvatars.some(matchAvatars);

    if (!validPredefinedAvatar)
      return next(new ErrorResponse(400, 'Predefined avatar URL is incorrect'));
  }

  await User.findByIdAndUpdate(userId, { avatar: avatarUrl });

  res.status(200).json({
    success: true,
    status: 200,
    data: {
      message: 'Your avatar has been updated',
    },
  });
});

// @route    POST /api/profile
// @desc     Update user data
// @access   Private
module.exports.updateUser = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const userPayload = { ...req.body };
  delete userPayload._id;
  delete userPayload.avatar;
  delete userPayload.password;

  const { isValid, error } = await validateUserData(userPayload);

  if (!isValid) return next(new ErrorResponse(400, error.message));

  const emailExist = await User.findOne({
    email: userPayload.email,
    _id: { $ne: userId },
  });

  if (emailExist)
    return next(new ErrorResponse(400, 'Email already used by other account'));

  const updatedUser = await User.findByIdAndUpdate(userId, userPayload, {
    returnDocument: 'after',
  }).select('-password -__v');

  res.status(200).json({
    success: true,
    status: 200,
    data: updatedUser,
  });
});
