import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './DashboardHero.css';

const DashboardHero = () => {
  // --- States ---
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [population, setPopulation] = useState('Loading...');
  const [notices, setNotices] = useState([]);
  const [weather, setWeather] = useState({ temp: 'Loading...', aqi: 'Loading...' });

  // --- 1. Fetch Images ---
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.from('hero_images').select('url, alt_text');
      if (data) setImages(data);
    };
    fetchImages();
  }, []);

  // --- 2. Image Slider Interval ---
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // --- 3. Fetch Population & Notices from Supabase ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: popData, error: popError } = await supabase.from('village_stats2').select('population').single();
        if (!popError && popData) setPopulation(popData.population.toLocaleString()); 

        const { data: noticeData, error: noticeError } = await supabase.from('notices').select('id, text').order('created_at', { ascending: false }).limit(5); 
        if (!noticeError && noticeData) setNotices(noticeData);
      } catch (err) {
        console.error("Unexpected error fetching dashboard data:", err);
      }
    };
    fetchDashboardData();
  }, []);

  // --- 4. Fetch Live Weather & AQI ---
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY; 
        const locationCoords = '23.197092,83.274870'; 
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${locationCoords}&aqi=yes`);
        
        if (!response.ok) throw new Error('Failed to fetch weather data');
        const data = await response.json();
        const epaIndex = data.current.air_quality['us-epa-index'];
        let aqiStatus = 'Good';
        if (epaIndex === 2) aqiStatus = 'Moderate';
        if (epaIndex === 3) aqiStatus = 'Unhealthy';
        if (epaIndex >= 4) aqiStatus = 'Poor';

        setWeather({ 
          temp: `${Math.round(data.current.temp_c)}°C`, 
          aqi: `${epaIndex} (${aqiStatus})` 
        });
      } catch (error) {
        setWeather({ temp: '--°C', aqi: '--' });
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="google-dashboard-container">
      
      {/* Top Section: Slider + Stats */}
      <div className="google-dashboard-top-row">
        
        {/* Left: Image Slider */}
        <div className="google-slider-card">
          {images.map((image, index) => (
            <img 
              key={index}
              src={image.url} 
              alt={image.alt_text || `Slide ${index}`} 
              className={`google-slide-image ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
          {images.length === 0 && (
            <div className="google-slide-placeholder">Loading Images...</div>
          )}
        </div>

        {/* Right: Data Widgets */}
        <div className="google-stats-column">
          
          <div className="google-widget-card">
            <div className="widget-header">
              <span className="widget-icon weather-icon">⛅</span>
              <h3>Local Weather</h3>
            </div>
            <div className="widget-body">
              <p className="widget-main-value">{weather.temp}</p>
              <p className="widget-sub-value">Air Quality: <strong>{weather.aqi}</strong></p>
            </div>
          </div>
          
          <div className="google-widget-card">
            <div className="widget-header">
              <span className="widget-icon pop-icon">👥</span>
              <h3>Village Population</h3>
            </div>
            <div className="widget-body">
              <p className="widget-main-value">{population}</p>
              <p className="widget-sub-value">Current Residents</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Notices */}
      <div className="google-notices-section">
        <div className="google-notices-card">
          <div className="notices-header">
            <span className="widget-icon notice-icon">📢</span>
            <h3>Official Notices & Announcements</h3>
          </div>
          
          {notices.length === 0 ? (
            <div className="empty-notices">No new announcements at this time.</div>
          ) : (
            <ul className="google-notice-list">
              {notices.map((notice) => (
                <li key={notice.id} className="google-notice-item">
                  <div className="notice-bullet"></div>
                  <p>{notice.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
};

export default DashboardHero;