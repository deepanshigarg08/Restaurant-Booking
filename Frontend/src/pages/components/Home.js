import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import styles from '../../styles/Home.module.css'; // Importing CSS module
import { SERVER_URL } from '@/utils/config';
import Layout from '../Layout';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

function Home() {
  const router = useRouter();
  const isAuthenticated = useAuth();
  const [hotelData, setHotelData] = useState([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  // If authentication is still being checked (isAuthenticated is null), don't render content yet
  

  // Fetch hotel data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${SERVER_URL}/hotel/data`);
        console.log(response.data);
        setHotelData(response.data.HOTEL);
      } catch (error) {
        setError('Error fetching hotel data. Please try again later.');
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false once the request is done
      }
    };

    fetchData();
  }, []);


  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <h1>You need to login</h1>; // Display this if not authenticated
  }


  // Render loading or error state
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Layout>
      <div className={styles.container}>
        {hotelData.length === 0 ? (
          <p>No hotels available at the moment.</p>
        ) : (
          hotelData.map((hotel) => (
            <div className={styles.card} key={hotel.H_Contact}>
              <Image
                src={hotel.H_image_Url}
                alt={hotel.H_Name}
                width={300}
                height={200}
                className={styles.hotelImage}
              />
              <div className={styles.content}>
                <h2 className={styles.hotelName}>{hotel.H_Name}</h2>
                <p className={styles.hotelAddress}>{hotel.H_Address}</p>
                <p className={styles.hotelLocation}>{hotel.H_Location}</p>
                <p className={styles.hotelRating}>
                  Rating: <strong>{hotel.H_Rating}</strong>
                </p>
                <p className={styles.hotelContact}>Contact: {hotel.H_Contact}</p>
                <a href={`/components/particularhotel/${hotel.H_id}`}>
                  <button className={styles.bookButton}>Book Now</button>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}

export default Home;
