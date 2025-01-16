import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Order.module.css'; // Importing the styles

import Layout from './Layout';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import {format} from 'date-fns';
import {FaCalendarAlt , FaRegClock , FaUsers} from 'react-icons/fa'; // Icons for navigation
import { useAuth } from '@/hooks/useAuth';
import { SERVER_URL } from '@/utils/config';

function OrderHistory() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const isAuthenticated = useAuth();

  
  // Check if we are in the browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('User_OID');
      setUserId(storedUserId); // Set userId once it's available in localStorage
    }
  }, []);

  // Fetch the confirmed reservations
  useEffect(() => {
    if (userId) {
      const fetchReservations = async () => {
        try {
          const response = await axios.get(`${SERVER_URL}/booking/reserveall/${userId}`);
          setReservations(response.data.Data);
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch reservations');
          setLoading(false);
        }
      };
      fetchReservations();
    }
  }, [userId]);

  const cancelBooking = (reservationId , RID) => {

    setIsDeleting(true);

    console.log(reservationId , RID)

    // Add logic to cancel the booking here
    axios
      .delete(`${SERVER_URL}/hotel/ordercancel/${reservationId}/${RID}`)
      .then((response) => {
        
        Swal.fire({
                     title: 'Success!',
                     text: response.data.message,
                     icon: 'success',
                     confirmButtonText: 'OK',
                   }); 

setReservations((prevReservations) =>
          prevReservations.filter((reservation) => reservation._id !== reservationId)
        );

// if(reservations.length === 0){

//     router.push('/components/Home'); // Redirect user to homepage or booking page
// }
       
      })
      .catch((error) => {
        // alert('Failed to cancel booking. Please try again.');
        
              Swal.fire({
                title: "Error!",
                text: error.response.data.message,
                icon: "error",
                confirmButtonText: "OK",
              });


        console.error(error);
      })
      .finally(() => setIsDeleting(false));
  };

  const isCancelButtonDisabled = (O_Date) => {
    // Convert the reservation date (in UTC) to a JavaScript Date object
    const reservationDate = new Date(O_Date);
  
    // Get the current date and time
    const currentDate = new Date();
  
    // Add 30 minutes to the reservation date
    const reservationDatePlus30Min = new Date(reservationDate.getTime() + 30 * 60 * 1000); // 30 minutes in milliseconds
  
    // Compare if the current date and time is greater than the reservation time + 30 minutes
    console.log("Current time:", currentDate);
    console.log("Reservation time:", reservationDatePlus30Min);
    
    // Disable the button if the current time is greater than the reservation time + 30 minutes
    return currentDate >= reservationDatePlus30Min;
  };

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <h1>You need to login</h1>; // Display this if not authenticated
  }


  return (
    <Layout>
      <div className={styles['order-history-container']}>
        <h1>Booking History</h1>

        {loading && <p>Loading...</p>}  
        {error && <p>{error}</p>}

        <div className={styles['order-history-list']}>
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <div className={styles['order-history-card']} key={reservation._id}>
                <img
                  src={reservation.O_Image_Url}
                  alt={reservation.O_H_Name}
                  className={styles['order-history-img']}
                />
                <div className={styles['order-history-details']}>
                  <h2>{reservation.O_H_Name}</h2>
                  {/* <p><strong>Slot:</strong> {reservation.O_Slot}</p>
                  <p><strong>Capacity:</strong> {reservation.O_Capacity} people</p> */}
                  {/* <p><strong>Date:</strong> {new Date(reservation.O_Date).toLocaleDateString()}</p> */}
                  {/* <p><strong>Date:</strong> {format(new Date(reservation.O_Date), 'yyyy-MM-dd')}</p> */}


                  <p className={styles.paracon} >
        <strong>Slot:</strong>
        <FaRegClock style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
        {reservation.O_Slot}
      </p>
      <p className={styles.paracon} >
        <strong>Capacity:</strong>
        <FaUsers style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
        {reservation.O_Capacity} people
      </p>

                  <p className={styles.paracon} >
        <strong>Date:</strong> 
        <FaCalendarAlt style={{ marginLeft: '10px', verticalAlign: 'middle' }} />
        {format(new Date(reservation.O_Date), 'yyyy-MM-dd')}
      </p>


                  <button
                    className={styles['cancel-button']}
                    onClick={() => cancelBooking(reservation._id , reservation.O_Reservation_ID)}
                    // disabled={isCancelButtonDisabled(reservation.O_Date)} // Disable button based on the date
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No confirmed reservations found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default OrderHistory;
