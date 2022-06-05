import Room from './../models/roomModel';
import Hotel from './../models/hotelModel';
import catchAsync from './../utils/catchAsync';
import AppError from './../utils/appError';
import { updateOne, getOne, getAll } from './handlerFactory';

export const createRoom = catchAsync(async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const newRoom = await Room.create(req.body);

  await Hotel.findByIdAndUpdate(hotelId, { $push: { rooms: newRoom._id } });

  res.status(201).json({
    status: 'success',
    data: {
      newRoom,
    },
  });
});

export const deleteRoom = catchAsync(async (req, res, next) => {
  const hotelId = req.params.hotelId;

  const doc = await Room.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: req.params.id } });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const updateHotel = updateOne(Room);
export const getRoomById = getOne(Room);
export const getRooms = getAll(Room);
