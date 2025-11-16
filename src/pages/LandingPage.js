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
    setCityDropdownOpen(false); // Close city dropdown when state changes
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setCityDropdownOpen(false);
  };

  // Close dropdowns when clicking outside (with delay for Cypress compatibility)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const stateDiv = document.getElementById('state');
      const cityDiv = document.getElementById('city');
      
      // Check if click is outside state dropdown
      if (stateDropdownOpen && stateDiv && !stateDiv.contains(event.target)) {
        // Don't close if clicking on city dropdown
        if (!cityDiv || !cityDiv.contains(event.target)) {
          setStateDropdownOpen(false);
        }
      }
      
      // Check if click is outside city dropdown
      if (cityDropdownOpen && cityDiv && !cityDiv.contains(event.target)) {
        // Don't close if clicking on state dropdown
        if (!stateDiv || !stateDiv.contains(event.target)) {
          setCityDropdownOpen(false);
        }
      }
    };

    if (stateDropdownOpen || cityDropdownOpen) {
      // Use a small delay to allow Cypress interactions
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 50);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [stateDropdownOpen, cityDropdownOpen]);

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
              <div 
                id="state" 
                className="custom-dropdown"
                onClick={(e) => {
                  // If clicking on the toggle or container (but not on menu items), toggle dropdown
                  if (!e.target.closest('li')) {
                    setStateDropdownOpen(!stateDropdownOpen);
                  }
                }}
              >
                <div className="dropdown-toggle">
                  {selectedState || 'Select State'}
                  <span className="dropdown-arrow">▼</span>
                </div>
                {stateDropdownOpen && (
                  <ul className="dropdown-menu">
                    {states.map((state, index) => (
                      <li
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStateSelect(state);
                        }}
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
              <div 
                id="city" 
                className="custom-dropdown"
                onClick={(e) => {
                  // If clicking on the toggle or container (but not on menu items), toggle dropdown
                  // Always allow opening if state is selected (for Cypress compatibility)
                  if (!e.target.closest('li') && selectedState) {
                    setCityDropdownOpen(!cityDropdownOpen);
                  }
                }}
              >
                <div className={`dropdown-toggle ${!selectedState || loading ? 'disabled' : ''}`}>
                  {selectedCity || 'Select City'}
                  <span className="dropdown-arrow">▼</span>
                </div>
                {cityDropdownOpen && selectedState && (
                  <ul className="dropdown-menu">
                    {loading ? (
                      <li className="loading-item">Loading cities...</li>
                    ) : cities.length > 0 ? (
                      cities.map((city, index) => (
                        <li
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCitySelect(city);
                          }}
                          className={selectedCity === city ? 'selected' : ''}
                        >
                          {city}
                        </li>
                      ))
                    ) : (
                      <li className="no-items">No cities available</li>
                    )}
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

