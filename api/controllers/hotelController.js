import Hotel from './../models/hotelModel';
import Room from './../models/roomModel';
import catchAsync from './../utils/catchAsync';
import { createOne, updateOne, deleteOne, getOne, getAll } from './handlerFactory';

export const createHotel = createOne(Hotel);
export const updateHotel = updateOne(Hotel);
export const deleteHotel = deleteOne(Hotel);
export const getHotelById = getOne(Hotel);
export const getHotels = getAll(Hotel);

export const countByCity = catchAsync(async (req, res, next) => {
  const cities = req.query.cities.split(',');

  const list = await Promise.all(
    cities.map((city) => {
      return Hotel.countDocuments({ city });
    })
  );

  res.status(200).json({
    status: 'success',
    data: list,
  });
});

export const countByType = catchAsync(async (req, res, next) => {
  const hotelCount = await Hotel.countDocuments({ type: 'hotel' });
  const apartmentCount = await Hotel.countDocuments({ type: 'apartment' });
  const resortCount = await Hotel.countDocuments({ type: 'resort' });
  const villaCount = await Hotel.countDocuments({ type: 'villa' });
  const cabinCount = await Hotel.countDocuments({ type: 'cabin' });

  res.status(200).json({
    status: 'success',
    data: [
      { type: 'hotel', count: hotelCount },
      { type: 'apartments', count: apartmentCount },
      { type: 'resorts', count: resortCount },
      { type: 'villas', count: villaCount },
      { type: 'cabins', count: cabinCount },
    ],
  });
});

export const getHotelRooms = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);
  const roomList = await Promise.all(hotel.rooms.map((room) => Room.findById(room)));

  res.status(200).json(roomList);
});
