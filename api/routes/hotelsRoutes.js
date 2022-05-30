import express from 'express';
import {
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelById,
  getHotels,
} from './../controllers/hotelController';

const router = express.Router();

router.route('/').get(getHotels).post(createHotel);
router.route('/:id').get(getHotelById).patch(updateHotel).delete(deleteHotel);

export default router;
