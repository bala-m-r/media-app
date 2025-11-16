import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './BookingPage.css';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const center = location.state?.center;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState({
    morning: ['09:00', '10:00', '11:00'],
    afternoon: ['12:00', '13:00', '14:00', '15:00'],
    evening: ['16:00', '17:00', '18:00']
  });

  useEffect(() => {
    if (!center) {
      navigate('/');
      return;
    }
    generateAvailableDates();
  }, []);

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
    setSelectedDate(dates[0]);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }

    const booking = {
      id: Date.now(),
      center: center,
      date: selectedDate.toISOString(),
      time: selectedTime,
      formattedDate: formatDate(selectedDate)
    };

    const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    existingBookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(existingBookings));

    navigate('/my-bookings');
  };

  const getTimeOfDay = (time) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'Morning';
    if (hour < 17) return 'Afternoon';
    return 'Evening';
  };

  if (!center) {
    return null;
  }

  return (
    <div className="booking-page">
      <Navbar />
      <div className="booking-container">
        <div className="booking-header">
          <h2>Book Appointment</h2>
          <div className="center-info">
            <h3>{center['Hospital Name']}</h3>
            <p>{center['Address']}, {center['City']}, {center['State']} {center['ZIP Code']}</p>
          </div>
        </div>

        <div className="booking-content">
          <div className="calendar-section">
            <h3>Select Date</h3>
            <div className="dates-grid">
              {availableDates.map((date, index) => (
                <button
                  key={index}
                  className={`date-button ${selectedDate?.toDateString() === date.toDateString() ? 'selected' : ''}`}
                  onClick={() => handleDateSelect(date)}
                >
                  {isToday(date) && <p>Today</p>}
                  <span>{date.getDate()}</span>
                  <span className="month">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div className="time-section">
              <h3>Select Time</h3>
              <div className="time-slots">
                <div className="time-group">
                  <p>Morning</p>
                  <div className="time-buttons">
                    {timeSlots.morning.map((time) => (
                      <button
                        key={time}
                        className={`time-button ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="time-group">
                  <p>Afternoon</p>
                  <div className="time-buttons">
                    {timeSlots.afternoon.map((time) => (
                      <button
                        key={time}
                        className={`time-button ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="time-group">
                  <p>Evening</p>
                  <div className="time-buttons">
                    {timeSlots.evening.map((time) => (
                      <button
                        key={time}
                        className={`time-button ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            className="confirm-booking-button"
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

