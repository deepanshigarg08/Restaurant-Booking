const Mongoose = require('mongoose')

const Order_Schema = new Mongoose.Schema({

    O_H_Name : {

        type : String 
    },

    O_Slot : {

        type : String 
    },

    O_Capacity : {

        type : Number 
    },

    O_Image_Url : {

        type : String
    },

    O_User_ID : {

        type : Mongoose.Schema.Types.ObjectId
    },

    O_Date : {

        type : Date
    },

    O_Reservation_ID : {
        type : Mongoose.Schema.Types.ObjectId
    }

    
})


const Order_Model = Mongoose.model('Order_Model' , Order_Schema)

module.exports = Order_Model