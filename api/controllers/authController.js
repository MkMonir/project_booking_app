import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import catchAsync from './../utils/catchAsync';
import AppError from './../utils/appError';
import User from './../models/userModel';

const signToken = (id, isAdmin) =>
  jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.isAdmin);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'none',
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // REMOVE THE PASSWORD FROM THE OUTPUT
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

export const register = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }

  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }

  createSendToken(user, 201, res);
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) note: GETTING TOKEN AND CHECK IF IT'S THERE
  let token;
  if (req.headers.token) {
    token = req.headers.token;
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access', 401));
  }

  // 2) note: VERIFICATION TOKEN
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) note: CHECK IF USER STILL EXIST
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new Error('The user belonging to this token is no longer exist', 401));
  }

  // 4) note: CHEK ID USER CHANGE PASSWORD AFTER THE TOKEN WAS ISSUED
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(new Error('User recently changed password! Please log in again!'), 401);
  }

  // note: GRANT ACCESS TO PROTECTED DATA
  req.user = currentUser;
  next();
});

export const restrictTo = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new AppError('You do not have permission to perform this action', 403));
  }
  next();
};
