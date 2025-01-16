
const Mongoose = require('mongoose')


const Table_Schema = new Mongoose.Schema({

    hotel_id : {

        type : Number
    },

    table_id : {

        type : Number 
    },

    capacity : {

        type : Number
    }


})


const Table_Model = Mongoose.model("Table_Model" , Table_Schema)

module.exports = Table_Model