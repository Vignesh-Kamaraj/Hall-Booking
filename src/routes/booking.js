import express from 'express'
import BookingController from '../controller/room.js'
const router = express.Router()
router.post('/create', BookingController.CreateRoom)
router.post('/book/:id', BookingController.BookRoom)
router.get('/allrooms', BookingController.AllRooms)
router.get('/customer/:customerName', BookingController.Customer)
router.get('/customer', BookingController.RoomsWithCustomerDetails)


export default router