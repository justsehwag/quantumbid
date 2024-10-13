const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.verifyToken = async (socket, next) => {
  try {
    const { token } = socket.handshake.auth;
    if (!token) {
      const message = 'Login to participate in auctions!';
      return next(new Error(message));
    }

    const key = process.env.SECRET;
    const payload = jwt.verify(token, key);

    const user = await User.findById(payload.id).select('-password');
    if (!user) next(new Error('You are not logged in as a valid user!'));

    socket.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
