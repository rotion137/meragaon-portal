import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '../supabaseClient'; 
import './Detail.css';

// Leaflet Icon Fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const Detail = () => {
  const position = [23.197118, 83.274861]; 
  
  // States for dynamic data
  const [stats, setStats] = useState([]);
  const [sliderImages, setSliderImages] = useState([]); // Now an empty array initially
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Stats
        const { data: statsData } = await supabase
          .from('village_stats')
          .select('*')
          .order('display_order', { ascending: true });

        // 2. Fetch Images
        const { data: imageData } = await supabase
          .from('village_images')
          .select('image_url')
          .order('display_order', { ascending: true });

        if (statsData) setStats(statsData);
        if (imageData) setSliderImages(imageData.map(img => img.image_url));

      } catch (error) {
        console.error('Error loading detail data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Slider Timer
  useEffect(() => {
    if (sliderImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [sliderImages]);

  return (
    <div className="detail-container">
      <h1 className="detail-title">Detail</h1>

      {/* Dynamic Image Slider */}
      <div className="detail-slider">
        {sliderImages.length > 0 ? (
          sliderImages.map((img, index) => (
            <div 
              key={index}
              className={`slider-slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))
        ) : (
          <div className="slider-placeholder">Loading Images...</div>
        )}
      </div>

      <div className="detail-text-section">
        <p>Welcome to KarmhaGaon. Our village data is managed via Supabase for real-time updates.</p>
      </div>

      {/* Dynamic Stats Cards */}
      <div className="detail-stats-grid">
        {loading ? (
          <p>Loading stats...</p>
        ) : (
          stats.map((stat) => (
            <div key={stat.id} className="stat-card">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          ))
        )}
      </div>

      {/* Map Section */}
      <div className="detail-map-section">
        <h2>Location</h2>
        <div className="map-container">
          <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}><Popup>KarmhaGaon is here!</Popup></Marker>
          </MapContainer>
        </div>
        <a href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`} target="_blank" rel="noopener noreferrer" className="directions-btn">
          Get Directions
        </a>
      </div>
    </div>
  );
};

export default Detail;