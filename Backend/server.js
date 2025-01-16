const Express = require('express')


const App = Express()

const Mongoose = require('mongoose')

const CORS = require('cors')

const path = require('path')




require('dotenv').config();

App.use(Express.urlencoded())


App.use(Express.json())

App.use(CORS())

const DB = require('./config/db')

DB()

const dbschema = require('./models/Reservation')

dbschema()



const HotelRoutes = require('./routes/Hotelroutes')
const PaymentRoutes = require('./routes/Paymentroute')

const Userroutes = require('./routes/Userroutes')

App.set('view engine', 'ejs');
App.set('views', path.join(__dirname, 'views')); // 'views' folder for EJS files

App.use('/hotel' , HotelRoutes)

App.use('/booking' , PaymentRoutes)


App.use('/user' , Userroutes)







App.listen(5000 , ()=>{

    console.log("Port is running at 5000")
})