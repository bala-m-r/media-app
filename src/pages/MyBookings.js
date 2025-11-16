import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  };

  const handleCancel = (bookingId) => {
    const updatedBookings = bookings.filter(booking => booking.id !== bookingId);
    setBookings(updatedBookings);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
  };

  return (
    <div className="my-bookings-page">
      <Navbar />
      <div className="bookings-container">
        <h1>My Bookings</h1>
        {bookings.length === 0 ? (
          <div className="no-bookings">
            <p>You have no bookings yet.</p>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking, index) => {
              // Handle both formats: nested (center object) and flat structure
              const hospitalName = booking.center?.['Hospital Name'] || booking['Hospital Name'];
              const address = booking.center?.['Address'] || booking['Address'];
              const city = booking.center?.['City'] || booking['City'];
              const state = booking.center?.['State'] || booking['State'];
              const zipCode = booking.center?.['ZIP Code'] || booking['ZIP Code'];
              const date = booking.formattedDate || booking.bookingDate || booking.date;
              const time = booking.time || booking.bookingTime;
              const bookingId = booking.id || index;

              return (
                <div key={bookingId} className="booking-card">
                  <div className="booking-header">
                    <h3>{hospitalName}</h3>
                    <button
                      className="cancel-button"
                      onClick={() => handleCancel(bookingId)}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="booking-details">
                    {address && <p><strong>Address:</strong> {address}</p>}
                    {city && <p><strong>City:</strong> {city}</p>}
                    {state && <p><strong>State:</strong> {state}</p>}
                    {zipCode && <p><strong>ZIP Code:</strong> {zipCode}</p>}
                    {date && <p><strong>Date:</strong> {date}</p>}
                    {time && <p><strong>Time:</strong> {time}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;

