const Mongoose = require('mongoose')


const Slot_Schema = new Mongoose.Schema({

    hotel_id : {

         type : Number 
    },

    slot_id : {

        type : Number 
    },

    time : {

        type : String
    },

    type : {

        type : String
    }
})


const Slot_Model = Mongoose.model('Slot_Model' , Slot_Schema)

module.exports = Slot_Model