import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Tourism.css';

// --- SUB-COMPONENT: Auto-Changing Image Slider ---
const AutoSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If there is only 1 or 0 images, no need to set a timer
    if (!images || images.length <= 1) return;

    // Change image every 4 seconds (4000ms)
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval); // Cleanup timer on unmount
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="slider-placeholder">No Images Available</div>;
  }

  return (
    <div className="tourism-slider-container">
      {images.map((img, index) => (
        <div
          key={index}
          className={`tourism-slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
      
      {/* Optional: Small dots at the bottom to show how many images there are */}
      <div className="slider-dots">
        {images.length > 1 && images.map((_, idx) => (
          <span key={idx} className={`dot ${idx === currentIndex ? 'active' : ''}`}></span>
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const Tourism = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourismData = async () => {
      try {
        const { data } = await supabase.from('karmha_tourism').select('*').order('id');
        if (data) setPlaces(data);
      } catch (error) {
        console.error("Error fetching tourism data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTourismData();
  }, []);

  if (loading) return <div className="tourism-loading">Loading Destinations...</div>;

  return (
    <div className="google-tourism-container">
      <div className="tourism-page-header">
        <h1>Tourism & Heritage</h1>
        <p>Discover the beautiful landmarks and natural spots around KarmhaGaon.</p>
      </div>

      <div className="tourism-cards-list">
        {places.map((place) => (
          <div key={place.id} className="google-tourism-card">
            
            {/* Top: Auto-changing images */}
            <AutoSlider images={place.image_urls} />

            {/* Bottom: Place Name & Map Button */}
            <div className="tourism-card-footer">
              <h2 className="place-name">{place.place_name}</h2>
              <a 
                href={`http://maps.google.com/?q=${place.coordinates}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="map-action-btn"
              >
                <span className="map-icon">📍</span> View on Map
              </a>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Tourism;