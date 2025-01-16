const Mongoose = require('mongoose')


const Reservation_Schema = new Mongoose.Schema({

    Hotel_ID : {

           type : Number
    },

    Table_ID : {

        type : Number 
    },

    Slot_ID : {

        type : Number 
    },

    Date : {

        type : Date
    },

    User_ID : {

        type : Mongoose.Schema.Types.ObjectId

    },

    Status : {

        type : String
    }




})



const Reservation_Model = Mongoose.model('Reservation_Model' , Reservation_Schema)


module.exports = Reservation_Model