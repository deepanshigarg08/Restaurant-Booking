import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { SERVER_URL } from '@/utils/config';
import styles from '../../../styles/Payment.module.css';
import Layout from '@/pages/Layout';
import Swal from 'sweetalert2';
import Loader from '../Loader';
import { useAuth } from '@/hooks/useAuth';

// Initialize Stripe with your public key
const stripePromise = loadStripe('pk_test_51OnD5DSHKuOJ2OzwK75MUOL0gh3uRoE1bZcBAtUwHfNutdDO82rga092Oh38PgDgZWS3v3gGqSKUM8BUrll0Ln6800rCwKR3jc'); // Replace with your actual publishable key

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

// Payment Form Component
const PaymentForm = ({ OID }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      return; // Stripe.js hasn't loaded yet
    }

    const billingDetails = {
      name: 'Phaninaidu',
      address: {
        line1: 'Door no 203, silver springs apartment, Palwancha, Bhadradri kothagudem, Telangana, 507115',
        city: "Palwancha",
        state: "Telangana",
        postal_code: '507115',
      },
    };

    const card = elements.getElement(CardElement);
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: card,
      billing_details: billingDetails,
    });

    if (stripeError) {
      setError(stripeError.message);
    } else {
      const response = await fetch(`${SERVER_URL}/booking/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          customerName: 'Phaninaidu',
          customerAddress: 'Door no 203, silver springs apartment, Palwancha, Bhadradri kothagudem, Telangana, 507115',
          amount: 10 * 100,
          country: 'IN',
          OID: OID,
        }),
      });

      const { clientSecret, error, Reservation_ID } = await response.json();

      if (error) {
        setError(error);
      } else {
        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

        if (confirmError) {
          setError(confirmError.message);
        } else {
          setIsLoading(false);
          Swal.fire({
            title: "Payment Successful!",
            text: "Your payment was successful.",
            icon: "success",
            confirmButtonText: "OK",
          });
          window.location.pathname = `/components/confirmation/${Reservation_ID}`;
        }
      }
    }
  };

  return (
    <div className={styles.paymentcontainer}>
      <Loader isLoading={isLoading} /> {/* Show loader when isLoading is true */}
      <form onSubmit={handlePayment}>
        <h2 className={styles.formtitle}>Complete Your Payment</h2>
        <div className={styles.cardinput}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <button className={styles.paybutton} type="submit" disabled={!stripe}>
          Pay Now
        </button>
      </form>
    </div>
  );
};

// Main Payment Component
function Payment() {
  const router = useRouter();
  const { id } = router.query;
  const [bookingData, setBookingData] = useState(null);
  const isAuthenticated = useAuth();

  useEffect(() => {
    if (id) {
      axios.get(`${SERVER_URL}/booking/reserve/${id}`)
        .then((response) => {
          setBookingData(response.data.Data); // Assuming `Data` contains {Hotel, Slot, date}
        })
        .catch((error) => console.error(error));
    }
  }, [id]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <h1>You need to login</h1>; // Display this if not authenticated
  }

  return (
    <Layout>
      <div>
        <div className={styles.paymentpage}>
          <h1>Payment Page</h1>
          {bookingData ? (
            <div className={styles.bookinginfo}>
              <div className={styles.hotelinfo}>
                <img
                  src={bookingData.Hotel.H_image_Url}
                  alt={bookingData.Hotel.H_Name}
                  className={styles.hotelimage}
                />
                <div className={styles.hoteldetails}>
                  <h2>{bookingData.Hotel.H_Name}</h2>
                  <p>{bookingData.Hotel.H_Address}</p>
                  <p>Location: {bookingData.Hotel.H_Location}</p>
                  <p>Contact: {bookingData.Hotel.H_Contact}</p>
                  <p>Rating: {bookingData.Hotel.H_Rating} ⭐</p>
                </div>
              </div>
              <div className={styles.slotinfo}>
                <h3>Reservation Details</h3>
                <p>Date: {bookingData.date}</p>
                <p>Time: {bookingData.Slot.time}</p>
                <p>Meal: {bookingData.Slot.type}</p>
              </div>

              {/* User Details */}
              <div className={styles.userinfo}>
                <h3 className={styles.sectionTitle}>User Information</h3>
                <p><strong>Name:</strong> {bookingData.User.UT_Name}</p>
                <p><strong>Email:</strong> {bookingData.User.UT_Email}</p>
                <p><strong>Phone:</strong> {bookingData.User.UT_Phone}</p>
              </div>

              {/* Table Information */}
              <div className={styles.tableinfo}>
                <h3 className={styles.sectionTitle}>Table Information</h3>
                <p><strong>Table ID:</strong> {bookingData.Table.table_id}</p>
              </div>
            </div>
          ) : (
            <p>Loading booking details...</p>
          )}
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm OID={id} />
        </Elements>
      </div>
    </Layout>
  );
}

export default Payment;
