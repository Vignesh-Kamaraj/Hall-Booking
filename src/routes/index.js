import express from 'express'
import BookingRoutes from './booking.js'
const router = express.Router()

router.get('/',(req,res)=>{
    res.status(200).send(`
    <h1 style="text-align:center">Welcome to Backend of Hall Booking</h1>`)
})

router.use('/',BookingRoutes)

export default router