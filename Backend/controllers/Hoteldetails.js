const Hotel_Model = require('../models/Hotel')


const displayAllHotels = async(req , res)=>{

    try{

        const Hotels_data = await Hotel_Model.find()
        res.status(200).json({message : 'Data fetched successfully' , HOTEL : Hotels_data})

    }

    catch(error){

        res.status(500).json({message : 'Internal Server error'})
    }

}



const gethoteldetails = async(req,res)=>{


    try{

        const Hotel_info = await Hotel_Model.findOne({H_id : req.params.id})

        console.log(Hotel_info)
        res.status(200).json({message : "Successfully fetched" , Data : Hotel_info})

    }

    catch(error){

        console.error(error)
        return res.status(500).json({message : "Internal Server error"})
    }


}










module.exports = {displayAllHotels , gethoteldetails}