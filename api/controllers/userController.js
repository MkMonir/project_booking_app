import User from './../models/userModel';
import catchAsync from './../utils/catchAsync';
import { updateOne, deleteOne, getOne, getAll } from './handlerFactory';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) note: Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password update. Please use /updateMyPassword.', 400)
    );
  }

  // 3) note: Filterd out unwanted fields name that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'username', 'email');

  // 3) note: Update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
export const getUserById = getOne(User);
export const getUsers = getAll(User);
