
const Mongoose = require('mongoose')

const User_Table = new Mongoose.Schema({

    UT_Name : {

         type : String
    },

    UT_Email : {

        type : String 
    },

    UT_Phone : {

        type : String 
    },

    UT_Password : {

        type : String
    }
})


const User_Model = Mongoose.model('User_Model' , User_Table)


module.exports = User_Model