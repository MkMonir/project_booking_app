import express from 'express';
import { createRoom, deleteRoom } from './../controllers/roomController';

const router = express.Router();

router.post('/:hotelId', createRoom);

router.delete('/:id/:hotelId', deleteRoom);

export default router;
