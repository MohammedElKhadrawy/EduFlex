const throwCustomError = require('../errors/custom-error');
const { verifyJWT } = require('../utils');

const authenticateUser = async (req, res, next) => {
  // check header
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throwCustomError('Unauthenticated, No token was attached!', 401);
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = verifyJWT(token);
  } catch (error) {
    throw error; // technical errors from JWT's side. Ex: jwt malformed.
  }
  // manage token-expired-like situations
  if (!decodedToken) {
    throwCustomError('Unauthenticated.', 401);
  }
  // attach the user to the request
  req.user = {
    userId: decodedToken.userId,
    name: decodedToken.name,
    role: decodedToken.role,
    profilePicture: decodedToken.profilePicture,
  };
  next();
};

const verifyTokenFromQuery = async (req, res, next) => {
  const { token } = req.query;
  if (!token) {
    throwCustomError('Unauthenticated, No token was attached!', 401);
  }
  let decodedToken;
  try {
    decodedToken = verifyJWT(token);
  } catch (error) {
    throw error; // technical errors from JWT's side. Ex: jwt malformed.
  }
  // manage token-expired-like situations
  if (!decodedToken) {
    throwCustomError('Unauthenticated.', 401);
  }
  // attach the user to the request
  req.user = {
    userId: decodedToken.userId,
    name: decodedToken.name,
    role: decodedToken.role,
    profilePicture: decodedToken.profilePicture,
  };
  next();
};

const authorizeRoles = (...roles) => {
  // we use callback function to not execute it immediately when passing arguments.
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throwCustomError('Unauthorized to access this route', 403);
    }
    next();
  };
};

module.exports = { authenticateUser, verifyTokenFromQuery, authorizeRoles };
