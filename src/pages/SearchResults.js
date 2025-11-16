import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './SearchResults.css';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [medicalCenters, setMedicalCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const state = searchParams.get('state');
  const city = searchParams.get('city');

  useEffect(() => {
    if (state && city) {
      fetchMedicalCenters(state, city);
    }
  }, [state, city]);

  const fetchMedicalCenters = async (stateName, cityName) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://meddata-backend.onrender.com/data?state=${encodeURIComponent(stateName)}&city=${encodeURIComponent(cityName)}`
      );
      const data = await response.json();
      setMedicalCenters(data);
    } catch (error) {
      console.error('Error fetching medical centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (center) => {
    navigate('/booking', { state: { center } });
  };

  if (loading) {
    return (
      <div className="search-results-page">
        <Navbar />
        <div className="loading-container">
          <p>Loading medical centers... This may take 50-60 seconds.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-page">
      <Navbar />
      <div className="results-container">
        <h1>{medicalCenters.length} medical centers available in {city?.toLowerCase()}</h1>
        <div className="centers-list">
          {medicalCenters.map((center, index) => (
            <div key={index} className="center-card">
              <h3>{center['Hospital Name']}</h3>
              <div className="center-details">
                <p><strong>Address:</strong> {center['Address']}</p>
                <p><strong>City:</strong> {center['City']}</p>
                <p><strong>State:</strong> {center['State']}</p>
                <p><strong>ZIP Code:</strong> {center['ZIP Code']}</p>
                <p><strong>Overall Rating:</strong> {center['Hospital overall rating'] || 'N/A'}</p>
              </div>
              <button
                className="book-button"
                onClick={() => handleBookClick(center)}
              >
                Book FREE Center Visit
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

