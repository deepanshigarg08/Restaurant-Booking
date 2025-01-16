const mongoose = require('mongoose')


const Hotel_Schema = new mongoose.Schema({


    H_id : {
        type : Number
    },


    H_Name : {

        type : String 
    },

    H_Address : {

        type : String 
    },

    H_Rating : {

        type : Number
    },

    H_image_Url : {

        type : String
    },

    H_Location : {

        type : String
    },

    H_Contact : {

         type : Number
    }

})




const Hotel_Model = mongoose.model('Hotel_Model' , Hotel_Schema)


module.exports = Hotel_Model