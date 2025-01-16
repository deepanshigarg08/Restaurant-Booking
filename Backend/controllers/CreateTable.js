const Tables_model = require('../models/Table')

const Slots_Model = require('../models/Slots')

const Hotels_Model = require('../models/Hotel')

const Reservation_model = require('../models/Reservation');
const Order_Model = require('../models/Order');




const CreateTable = async (req, res) => {
    try {
        const { Day, Guests, Meal, Time, HotelID, UserID } = req.body;

        const slotData = await Slots_Model.findOne({
            $and: [{ time: { $eq: Time } }, { hotel_id: { $eq: HotelID } }]
        });

        if (!slotData) {
            return res.status(400).json({ success: false, message: "Invalid time or hotel ID." });
        }

        const slotId = slotData.slot_id;

        const tableData = await Tables_model.find({
            $and: [{ hotel_id: { $eq: HotelID } }, { capacity: { $eq: Guests } }]
        });

        if (!tableData || tableData.length === 0) {
            return res.status(400).json({ success: false, message: "No tables available for the requested guest capacity." });
        }

        let availableTable = null;

        for (const table of tableData) {
            const existingReservation = await Reservation_model.findOne({
                $and: [
                    { Hotel_ID: { $eq: HotelID } },
                    { Table_ID: { $eq: table.table_id } },
                    { Slot_ID: { $eq: slotId } },
                    { Date: { $eq: Day } }
                ]
            });

            if (!existingReservation) {
                availableTable = table;
                break;
            }
        }

        if (!availableTable) {
            return res.status(400).json({
                success: false,
                message: `All tables for ${Guests} guests are booked for ${Time} on ${Day}.`
            });
        }

        const newReservation = new Reservation_model({
            Hotel_ID: HotelID,
            Table_ID: availableTable.table_id,
            Slot_ID: slotId,
            Date: Day,
            User_ID: UserID,
            Status: "pending" // Initial status
        });

        await newReservation.save();

        res.status(201).json({
            success: true,
            message: "Reservation created. Please proceed with payment.",
            reservationId: newReservation._id // Send reservation ID to frontend
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred while creating the reservation." });
    }
};



const DeleteTable = async(req,res)=>{

    const bookingId = req.params.OID;

  try {
    // Find the booking by ObjectID and delete it
    const deletedBooking = await Reservation_model.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Booking successfully deleted' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'An error occurred while deleting the booking' });
  }

}





const DeleteOrderandReserved = async (req, res) => {

    console.log('Hello')

    try {
      const Order_id = req.params.Orderid;
      const Reserve_id = req.params.reserveid;
  
      // Delete the order from Order_Model
      const Order_delete = await Order_Model.findOneAndDelete({ _id: Order_id });
  
      // Delete the reservation from Reservation_model
      const Reserve_delete = await Reservation_model.findOneAndDelete({ _id: Reserve_id });
  
      if (!Order_delete || !Reserve_delete) {
        return res.status(404).json({ message: "Order or Reservation not found" });
      }
  
      res.status(200).json({ message: "Order and Reservation successfully canceled" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  





module.exports = {CreateTable , DeleteTable , DeleteOrderandReserved}