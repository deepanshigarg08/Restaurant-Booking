import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../styles/[id].module.css'
import axios from 'axios';
import { SERVER_URL } from '@/utils/config';
import Swal from 'sweetalert2';
import Image from 'next/image';
import Layout from '@/pages/Layout';
import { useAuth } from '@/hooks/useAuth';


function Booking() {
  const router = useRouter();
  const { id } = router.query; // Access the query parameters

const isAuthenticated = useAuth();
  const [hotelDetails, sethoteldetails] = useState(null);

  const [selectedDay, setSelectedDay] = useState("Select day");
  const [selectedGuests, setSelectedGuests] = useState("Select Guests");
  const [selectedMeal, setSelectedMeal] = useState("Lunch");
  const [selectedTime, setSelectedTime] = useState(null);

  const [timeSlots, setTimeSlots] = useState([]); // Dynamic time slots


  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const guests = [2 , 4 , 6 , 8];
  const meals = ["Lunch", "Dinner"];

  const dates = []

  const lunchSlots = [
    '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  ];
  const dinnerSlots = [
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM',
    '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM',
  ];


  const [availableSlots, setAvailableSlots] = useState([]);




  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    // alert(`You selected ${time}`);
  };



  const today = new Date(); // Get today's date

  const currentTime = today.getHours() * 60 + today.getMinutes(); // Current time in minutes
  const fiveThirtyPM = 17 * 60 + 30; // 5:30 PM in minutes
  

  useEffect(() => {
    if (currentTime >= fiveThirtyPM) {
      setSelectedMeal("Dinner"); // Automatically switch to Dinner after 5:30 PM
      setTimeSlots(dinnerSlots); // Show only dinner slots
    } else {
      setTimeSlots(lunchSlots); // Show lunch slots
    }
  }, [currentTime]);




  useEffect(() => {
    const filterSlots = () => {
      const currentTime = new Date();
      const selectedDate = new Date(selectedDay); // Get the selected date
      const isTomorrowOrLater = selectedDate > currentTime; // Check if the selected day is tomorrow or later
  
      if (isTomorrowOrLater) {
        // Show all slots for tomorrow or future dates
        setAvailableSlots(selectedMeal === "Dinner" ? dinnerSlots : lunchSlots);
      } else {
        // Filter slots based on current time for today
        const filteredSlots = selectedMeal === "Dinner" 
          ? dinnerSlots.filter((slot) => {
              const [time, period] = slot.split(' '); // Split into time and AM/PM
              const [hours, minutes] = time.split(':'); // Split hours and minutes
              let slotHours = parseInt(hours, 10);
              const slotMinutes = parseInt(minutes, 10);
  
              if (period === 'PM' && slotHours !== 12) slotHours += 12; // Convert PM to 24-hour format
              if (period === 'AM' && slotHours === 12) slotHours = 0; // Handle midnight case
  
              const slotTime = new Date();
              slotTime.setHours(slotHours, slotMinutes, 0, 0);
  
              return slotTime > currentTime; // Return slots that are after the current time
            })
          : lunchSlots.filter((slot) => {
              const [time, period] = slot.split(' '); // Split into time and AM/PM
              const [hours, minutes] = time.split(':'); // Split hours and minutes
              let slotHours = parseInt(hours, 10);
              const slotMinutes = parseInt(minutes, 10);
  
              if (period === 'PM' && slotHours !== 12) slotHours += 12; // Convert PM to 24-hour format
              if (period === 'AM' && slotHours === 12) slotHours = 0; // Handle midnight case
  
              const slotTime = new Date();
              slotTime.setHours(slotHours, slotMinutes, 0, 0);
  
              return slotTime > currentTime; // Return slots that are after the current time
            });
  
        setAvailableSlots(filteredSlots);
      }
    };
  
    filterSlots(); // Filter slots on component mount
  
    // Optional: Set up an interval to update the slots every minute
    const interval = setInterval(filterSlots, 60000);
  
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [selectedDay, selectedMeal]); // Re-run the effect when selectedDay or selectedMeal changes
  


  for (let i = 0; i < 5; i++) {
    const newDate = new Date(today); // Clone today's date
    newDate.setDate(today.getDate() + i); // Add i days to today

   

    dates.push(newDate.toDateString()); // Add the formatted date to the array
  }




  useEffect(()=>{


    if (id) {
      axios
        .get(`${SERVER_URL}/hotel/particular/${id}`)
        .then((response) => {
          console.log(response.data);
          sethoteldetails(response.data.Data); // Assuming `Data` contains {Hotel, Slot, date}
        })
        .catch((error) => console.error(error));
    }

  },[id])
  

  const User_OID = typeof window !== "undefined" ? localStorage.getItem('User_OID') : null;


  
  const Senddata = async()=>{
        
    if (
      selectedDay === "Select day" ||
      selectedGuests === "Select Guests" ||
      selectedMeal === "Select Meal" ||
      !selectedTime
    ) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select all fields before proceeding.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return; // Stop the function execution if validation fails
    }

        const data = {

             Day : selectedDay,

             Guests : selectedGuests,

             Meal : selectedMeal,

             Time : selectedTime,

             HotelID : id,

             UserID : User_OID

        }

        try{

             const response = await axios.post(`${SERVER_URL}/hotel/book` , data)

             const {message , reservationId} = response.data

             Swal.fire({
              title: 'Success!',
              text: message,
              icon: 'success',
              confirmButtonText: 'OK',
            });

            window.location.pathname = `/components/payment/${reservationId}`
        }

        catch(error){

          console.error(error)

            Swal.fire({
                        title: "Error!",
                        text: error.response.data.message,
                        icon: "error",
                        confirmButtonText: "OK",
                      });
        }
  }





  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <h1>You need to login</h1>; // Display this if not authenticated
  }








 

  return (
   <Layout>


<div  className={styles.maincontainer} >



{hotelDetails ? (

<div className={styles.hotelDetailsWrapper}>
<div className={styles.hotelImageContainer}>
  <img src={hotelDetails.H_image_Url} alt={hotelDetails.H_Name} className={styles.hotelImage} />
</div>
<div className={styles.hotelInfo}>
  <h1 className={styles.hotelName}>{hotelDetails.H_Name}</h1>
  <div className={styles.hotelRating}>
    <span className={styles.rating}>Rating: {hotelDetails.H_Rating} ⭐</span>
  </div>
  <p className={styles.hotelAddress}>{hotelDetails.H_Address}</p>
  <p className={styles.hotelLocation}>
    <strong>Location:</strong> {hotelDetails.H_Location}
  </p>
  <p className={styles.hotelContact}>
    <strong>Contact:</strong> {hotelDetails.H_Contact}
  </p>
</div>
<div className={styles.hotelActions}>
  <button className={styles.bookNowButton}>Book Now</button>
</div>
</div>

) : (
  <p>Loading Hotel details...</p>
  
)}













<div className={styles.container}>
      {/* Day Dropdown */}
      <div className={styles.dropdown}>
        <button className={styles.dropdownButton}>{selectedDay}</button>
        <ul className={styles.dropdownMenu}>
          {dates.map((day, index) => (
            <li key={index} onClick={() => setSelectedDay(day)}>
              {day}
            </li>
          ))}
        </ul>
      </div>

      {/* Guests Dropdown */}
      <div className={styles.dropdown}>
        <button className={styles.dropdownButton}>{selectedGuests}</button>
        <ul className={styles.dropdownMenu}>
          {guests.map((guest, index) => (
            <li key={index} onClick={() => setSelectedGuests(`${guest}`)}>
              {guest} {guest > 1 ? "Guests" : "Guest"}
            </li>
          ))}
        </ul>
      </div>

      {/* Meal Dropdown */}
      <div className={styles.dropdown}>
        <button className={styles.dropdownButton}>{selectedMeal}</button>
        <ul className={styles.dropdownMenu}>
          {meals.map((meal, index) => (
            <li key={index} onClick={() => setSelectedMeal(meal)}>
              {meal}
            </li>
          ))}
        </ul>
      </div>
    </div>





{/* Representation of slots based on lunch or dinner */}

   {/* Display available time slots */}
   <div className={styles.timeslotContainer}>
          <h3 className={styles.title}>
            Available Time Slots for {selectedDay}:
          </h3>
          <div className={styles.timeslots}>
            {availableSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => handleTimeSelect(slot)}
                className={`${styles.timeslot} ${selectedTime === slot ? styles.selected : ''}`}
              >
                {slot}
              </button>
            ))}
          </div>



        <button  onClick={Senddata} type="button" className={styles.proceedButton}>Proceed to cart</button>


      </div>

    </div>


   </Layout>
  );
}

export default Booking;
