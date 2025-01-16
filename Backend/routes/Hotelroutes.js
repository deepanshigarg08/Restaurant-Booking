const Express = require('express')

const Router = Express.Router()


const {displayAllHotels , gethoteldetails} = require('../controllers/Hoteldetails')

const {CreateTable , DeleteTable , DeleteOrderandReserved} = require('../controllers/CreateTable')


Router.get('/data' , displayAllHotels)

Router.get('/particular/:id' , gethoteldetails)

Router.post('/book' , CreateTable)

Router.delete('/cancel/:OID' , DeleteTable)

Router.delete('/ordercancel/:Orderid/:reserveid' , DeleteOrderandReserved)


module.exports = Router

