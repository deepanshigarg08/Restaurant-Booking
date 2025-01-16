import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaCheckCircle } from 'react-icons/fa';
import { SERVER_URL } from '@/utils/config';
import Layout from '@/pages/Layout';
import Swal from 'sweetalert2';
import { useAuth } from '@/hooks/useAuth';

function Confirmation() {
  const router = useRouter();
  const { id } = router.query;
  const [bookingData, setBookingData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAuthenticated = useAuth();



  useEffect(() => {
    if (id) {
      axios
        .get(`${SERVER_URL}/booking/reserve/${id}`)
        .then((response) => {
          console.log(response.data);
          setBookingData(response.data.Data); // Assuming `Data` contains {Hotel, Slot, date}
        })
        .catch((error) => console.error(error)
      
      
      );
    }
  }, [id]);

  const handleCancelBooking = () => {
    setIsDeleting(true);
    axios
      .delete(`${SERVER_URL}/hotel/cancel/${id}`)
      .then((response) => {
        
        Swal.fire({
                     title: 'Success!',
                     text: response.data.message,
                     icon: 'success',
                     confirmButtonText: 'OK',
                   }); 



        router.push('/components/Home'); // Redirect user to homepage or booking page
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


  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <h1>You need to login</h1>; // Display this if not authenticated
  }



  return (
    <Layout>
      <div className="confirmation-container">
        <div className="success-banner">
          <FaCheckCircle className="success-icon" />
          <h1 className="success-message">Payment Successful!</h1>
          <p className="success-subtext">Your booking has been confirmed.</p>
        </div>
        {bookingData ? (
          <div className="details-card">
            <div className="hotel-section">
              <img
                src={bookingData.Hotel.H_image_Url}
                alt={bookingData.Hotel.H_Name}
                className="hotel-image"
              />
              <div className="hotel-info">
                <h2 className="hotel-name">{bookingData.Hotel.H_Name}</h2>
                <p className="hotel-address">{bookingData.Hotel.H_Address}</p>
                <p className="hotel-location">
                  <strong>Location:</strong> {bookingData.Hotel.H_Location}
                </p>
                <p className="hotel-contact">
                  <strong>Contact:</strong> {bookingData.Hotel.H_Contact}
                </p>
                <p className="hotel-rating">
                  <strong>Rating:</strong> {bookingData.Hotel.H_Rating} ⭐
                </p>
              </div>
            </div>
            <div className="reservation-section">
              <h3 className="reservation-title">Reservation Details</h3>
              <p className="reservation-date">
                <strong>Date:</strong> {bookingData.date}
              </p>
              <p className="reservation-time">
                <strong>Time:</strong> {bookingData.Slot.time}
              </p>
              <p className="reservation-meal">
                <strong>Meal:</strong> {bookingData.Slot.type}
              </p>
              {/* User details section */}
              <div className="user-section">
                <p><strong>Name:</strong> {bookingData.User.UT_Name}</p>
                <p><strong>Email:</strong> {bookingData.User.UT_Email}</p>
                <p><strong>Phone:</strong> {bookingData.User.UT_Phone}</p>
              </div>
              {/* Table details */}
              <div className="table-section">
                <p><strong>Table ID:</strong> {bookingData.Table.table_id}</p>
              </div>
            </div>
            <button
              className={`cancel-booking-btn ${isDeleting ? 'loading' : ''}`}
              onClick={handleCancelBooking}
              disabled={isDeleting}
            >
              {isDeleting ? 'Cancelling...' : 'Cancel Booking'}
            </button>
          </div>
        ) : (
          <p className="loading-message">Fetching your booking details...</p>
        )}
        <style jsx>{`
          .confirmation-container {
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            text-align: center;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
          }
          .success-banner {
            padding: 20px;
            background: linear-gradient(90deg, #4caf50, #2e7d32);
            color: #fff;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .success-icon {
            font-size: 4rem;
            color: #fff;
            margin-bottom: 10px;
          }
          .success-message {
            font-size: 2rem;
            margin: 0;
            font-weight: bold;
          }
          .success-subtext {
            font-size: 1.2rem;
            margin-top: 10px;
          }
          .details-card {
            padding: 20px;
            background: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }
          .hotel-section {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
          }
          .hotel-image {
            width: 150px;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
            border: 2px solid #ddd;
          }
          .hotel-info {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            text-align: left;
          }
          .hotel-name {
            font-size: 1.5rem;
            color: #333;
            margin: 0;
          }
          .hotel-address,
          .hotel-location,
          .hotel-contact,
          .hotel-rating {
            font-size: 1rem;
            color: #555;
            margin: 5px 0;
          }
          .reservation-section {
            text-align: left;
            padding: 15px;
            background: #fff;
            border-radius: 10px;
            border: 1px solid #ddd;
          }
          .reservation-title {
            font-size: 1.3rem;
            color: #2e7d32;
            margin-bottom: 10px;
            font-weight: bold;
          }
          .reservation-date,
          .reservation-time,
          .reservation-meal {
            font-size: 1rem;
            color: #555;
            margin: 5px 0;
          }
          .loading-message {
            font-size: 1.2rem;
            color: #777;
            margin-top: 20px;
          }
          .user-section,
          .table-section {
            font-size: 1rem;
            color: #555;
            margin-top: 10px;
          }
          .cancel-booking-btn {
            padding: 10px 20px;
            background-color: #d32f2f;
            color: white;
            font-size: 1.2rem;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-top: 20px;
          }
          .cancel-booking-btn:hover {
            background-color: #c62828;
          }
          .cancel-booking-btn.loading {
            background-color: #9e9e9e;
            cursor: not-allowed;
          }


 /* Media queries for responsiveness */
  @media (max-width: 768px) {
    .confirmation-container {
      padding: 15px;
    }

    .success-message {
      font-size: 1.5rem;
    }

    .success-icon {
      font-size: 3rem;
    }

    .details-card {
      padding: 15px;
    }

    .hotel-section {
      flex-direction: column;
      align-items: center;
    }

    .hotel-image {
      width: 120px;
      height: 120px;
    }

    .hotel-name {
      font-size: 1.2rem;
    }

    .hotel-address,
    .hotel-location,
    .hotel-contact,
    .hotel-rating {
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .success-message {
      font-size: 1.2rem;
    }

    .success-icon {
      font-size: 2.5rem;
    }

    .hotel-image {
      width: 100px;
      height: 100px;
    }

    .hotel-name {
      font-size: 1rem;
    }

    .reservation-title {
      font-size: 1.1rem;
    }

    .cancel-booking-btn {
      font-size: 1rem;
      padding: 8px 16px;
    }
  }







        `}</style>
      </div>
    </Layout>
  );
}

export default Confirmation;
