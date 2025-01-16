const Express = require('express')

const Router = Express.Router()


const {Paymentintent , Hoteldata , AllReservations} = require('../controllers/Booking')

Router.post('/payment' , Paymentintent)

Router.get('/reserve/:OID' ,  Hoteldata) 

Router.get('/reserveall/:User', AllReservations)


module.exports = Router