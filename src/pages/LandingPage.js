import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Navbar from '../components/Navbar';
import './LandingPage.css';

const LandingPage = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
    } else {
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedState]);

  const fetchStates = async () => {
    try {
      const response = await fetch('https://meddata-backend.onrender.com/states');
      const data = await response.json();
      setStates(data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (state) => {
    try {
      setLoading(true);
      const response = await fetch(`https://meddata-backend.onrender.com/cities/${state}`);
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedState && selectedCity) {
      navigate(`/search?state=${encodeURIComponent(selectedState)}&city=${encodeURIComponent(selectedCity)}`);
    }
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setStateDropdownOpen(false);
    setSelectedCity('');
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('#state')) {
        setStateDropdownOpen(false);
      }
      if (!event.target.closest('#city')) {
        setCityDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="landing-page">
      <Navbar />
      <div className="landing-content">
        <div className="features-carousel">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            <SwiperSlide>
              <div className="feature-card">
                <h3>Find Doctors</h3>
                <p>Search and book appointments with qualified doctors</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="feature-card">
                <h3>Hospitals</h3>
                <p>Discover medical centers near you</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="feature-card">
                <h3>Medicines</h3>
                <p>Access information about medications</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="feature-card">
                <h3>Easy Booking</h3>
                <p>Book appointments quickly and easily</p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="search-section">
          <h1>Find Medical Centers</h1>
          <p>Search for medical centers in your area</p>
          <form onSubmit={handleSubmit} className="search-form">
            <div className="form-group">
              <label htmlFor="state-select">State</label>
              <div id="state" className="custom-dropdown">
                <div
                  className="dropdown-toggle"
                  onClick={() => setStateDropdownOpen(!stateDropdownOpen)}
                >
                  {selectedState || 'Select State'}
                  <span className="dropdown-arrow">▼</span>
                </div>
                {stateDropdownOpen && (
                  <ul className="dropdown-menu">
                    {states.map((state, index) => (
                      <li
                        key={index}
                        onClick={() => handleStateSelect(state)}
                        className={selectedState === state ? 'selected' : ''}
                      >
                        {state}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="city-select">City</label>
              <div id="city" className="custom-dropdown">
                <div
                  className={`dropdown-toggle ${!selectedState || loading ? 'disabled' : ''}`}
                  onClick={() => !loading && selectedState && setCityDropdownOpen(!cityDropdownOpen)}
                >
                  {selectedCity || 'Select City'}
                  <span className="dropdown-arrow">▼</span>
                </div>
                {cityDropdownOpen && selectedState && !loading && (
                  <ul className="dropdown-menu">
                    {cities.map((city, index) => (
                      <li
                        key={index}
                        onClick={() => handleCitySelect(city)}
                        className={selectedCity === city ? 'selected' : ''}
                      >
                        {city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button type="submit" id="searchBtn" className="search-button">
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

