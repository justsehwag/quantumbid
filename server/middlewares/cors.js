const ErrorResponse = require('../utils/errorResponse');

const validateOrigin = (req, res, next) => {
  const requestOrigin = req.get('origin');
  const origin = process.env.ORIGIN;

  if (origin == requestOrigin) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  } else {
    return next(new ErrorResponse(403, 'Access denied!'));
  }
};

module.exports = validateOrigin;
