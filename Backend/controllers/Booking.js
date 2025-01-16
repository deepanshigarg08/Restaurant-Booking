const Stripe = require('stripe')


const stripe = Stripe('sk_test_51OnD5DSHKuOJ2Ozwfov2PAvt9eVPFPNr1OW69TbjybEKQigT7xG4ecDE78yGUj2bzmJdswdhDXfRyE6yYutcUZXR00rtZOBiAj'); // Replace with your Stripe secret key


const Reservation_Model = require('../models/Reservation')
const Hotel_Model = require('../models/Hotel')

const Table_Model = require('../models/Table')
const Slot_Model = require('../models/Slots')

const User_Model = require('../models/User')

const Order_Model = require('../models/Order')


const Paymentintent = async(req,res)=>{

    const { paymentMethodId, customerName, customerAddress, amount , country , OID } = req.body;

    try {
        // Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in the smallest unit (paisa for INR)
            currency: 'inr',
            payment_method: paymentMethodId,
            description: `Export transaction for ${customerName}`,
            shipping: {
                name: customerName,
                address: {
                    line1: customerAddress,
                    city: req.body.city,
                    state: req.body.state,
                    postal_code: req.body.postalCode,
                    country : country
                },
            },
            metadata: {
                customer_name: customerName,
                customer_address: customerAddress,
            },


// Disabling redirects for non-card payment methods
automatic_payment_methods: {
    enabled: true,
    allow_redirects: 'never', // Disable redirects
},


            confirm: true, // Automatically confirm the payment after creating the PaymentIntent
        });

        
        const Updateinformation = await Reservation_Model.findOne({_id : OID})

        Updateinformation.Status = 'Confirmed'

        await Updateinformation.save()


        res.json({ clientSecret: paymentIntent.client_secret , Reservation_ID : Updateinformation._id });
    } catch (error) {
        console.error('Error creating PaymentIntent', error);
        res.status(500).send({ error: error.message });
    }

}





// Separate function to save the order
const saveOrder = async (Hoteldata, Slotdata, Tabledata, USER_OID, formattedDate , RID) => {
  // Check if the order already exists for the user, hotel, and slot
  const existingOrder = await Order_Model.findOne({
    O_User_ID: USER_OID,
    O_H_Name: Hoteldata.H_Name,
    O_Slot: Slotdata.time,
    O_Capacity: Tabledata.capacity,
    O_Date: formattedDate,
    O_Reservation_ID : RID
  });

  if (existingOrder) {
    // If the order already exists, prevent saving the duplicate and return a message
    console.log("Order already exists for this reservation");
    return null; // or you can return a message if required
  }

  // If no existing order, create a new order
  const newOrder = new Order_Model({
    O_H_Name: Hoteldata.H_Name,        // From Hotel data
    O_Slot: Slotdata.time,             // From Slot data
    O_Capacity: Tabledata.capacity,    // From Table data
    O_Image_Url: Hoteldata.H_image_Url, // Assuming Hotel has an image URL
    O_User_ID: USER_OID,               // From Reservation/User data
    O_Date: formattedDate,
    
    O_Reservation_ID : RID
  });

  // Save the order to the database
  const savedOrder = await newOrder.save();
  return savedOrder; // Return the saved order
};




const Hoteldata = async (req, res) => {
    try {
      const Reservationdata = await Reservation_Model.findOne({ _id: req.params.OID });
  
      if (!Reservationdata) {
        return res.status(404).json({ message: "Data not found, please reserve" });
      }
  
      const HOTEL_OID = Reservationdata.Hotel_ID;
      const SLOT_OID = Reservationdata.Slot_ID;
      const formattedDate = Reservationdata.Date.toDateString();

      const USER_OID = Reservationdata.User_ID
      const TABLE_OID = Reservationdata.Table_ID
  
      const Hoteldata = await Hotel_Model.findOne({ H_id: HOTEL_OID });
      const Slotdata = await Slot_Model.findOne({ slot_id: SLOT_OID });

      const Userdata = await User_Model.findOne({_id : USER_OID})
      const Tabledata = await Table_Model.findOne({table_id : TABLE_OID})
      
  
      if (!Hoteldata || !Slotdata) {
        return res.status(404).json({ message: "Hotel or Slot data not found" });
      }


      const savedOrder = await saveOrder(Hoteldata, Slotdata, Tabledata, USER_OID, formattedDate , req.params.OID);

      // If the order was not saved (i.e., it already existed), return a response
      // if (!savedOrder) {
      //   return res.status(400).json({ message: "Order already exists for this reservation" });
      // }
  
      // Consolidating response into one object
      return res.status(200).json({
        message: "Fetched data successfully",
        Data: {
          Hotel: Hoteldata,
          Slot: Slotdata,
          date: formattedDate,
          User : Userdata,
          Table : Tabledata
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  



  const AllReservations = async (req, res) => {
    try {
      // Get the User_ID from URL parameter
      const userId = req.params.User;
  
      // Fetch confirmed reservations for the user directly
      const confirmedReservations = await Order_Model.find({
        O_User_ID: userId,
      });
  
      // Send the filtered data back to the client
      res.status(200).json({ Data: confirmedReservations });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      res.status(500).json({ message: 'Failed to fetch reservations' });
    }
  };
  




module.exports = {Paymentintent , Hoteldata , AllReservations}