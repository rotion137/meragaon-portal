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
  
  const [stats, setStats] = useState([]);
  const [sliderImages, setSliderImages] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: statsData } = await supabase.from('village_stats').select('*').order('display_order', { ascending: true });
        const { data: imageData } = await supabase.from('village_images').select('image_url').order('display_order', { ascending: true });

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

  useEffect(() => {
    if (sliderImages.length > 0) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [sliderImages]);

  return (
    <div className="google-detail-container">
      
      <div className="detail-header">
        <h1>Village Overview</h1>
        <p>Explore the details, statistics, and location of KarmhaGaon.</p>
      </div>

      {/* --- TOP SECTION: Split Layout (Image left, Info right) --- */}
      <div className="detail-top-grid">
        
        {/* Left: Smaller Image Slider */}
        <div className="google-card detail-gallery-card">
          {sliderImages.length > 0 ? (
            sliderImages.map((img, index) => (
              <div 
                key={index}
                className={`gallery-slide ${index === currentImageIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url(${img})` }}
              />
            ))
          ) : (
            <div className="gallery-placeholder">Loading Images...</div>
          )}
        </div>

        {/* Right: Info & Stats */}
        <div className="google-card detail-info-card">
          <h2>KarmhaGaon</h2>
          <p className="detail-description">
            Welcome to KarmhaGaon. Our village data is managed securely to provide real-time updates and transparency for all residents and visitors.
          </p>
          
          <div className="detail-stats-grid">
            {loading ? (
              <p className="loading-text">Loading stats...</p>
            ) : (
              stats.map((stat) => (
                <div key={stat.id} className="google-stat-chip">
                  <span className="stat-title">{stat.title}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* --- BOTTOM SECTION: Map --- */}
      <div className="google-card detail-map-card">
        <div className="map-header">
          <div className="map-title-area">
            <span className="map-icon">📍</span>
            <h2>Location & Directions</h2>
          </div>
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="google-btn map-btn"
          >
            Get Directions
          </a>
        </div>
        
        <div className="map-wrapper">
          <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position}><Popup>KarmhaGaon is here!</Popup></Marker>
          </MapContainer>
        </div>
      </div>

    </div>
  );
};

export default Detail;