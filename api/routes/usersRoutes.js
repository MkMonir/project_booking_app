import express from 'express';

import {
  updateUser,
  deleteUser,
  getUserById,
  getUsers,
  getMe,
  updateMe,
  deleteMe,
} from './../controllers/userController';
import { protect, restrictTo } from './../controllers/authController';

const router = express.Router();

router.use(protect);

router.get('/getMe', getMe);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo);

router.route('/').get(getUsers);
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

export default router;
