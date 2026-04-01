import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // ⚠️ Make sure this path points to your actual Supabase config file
import './HeroSlider.css';

const HeroSlider = () => {
  // 1. State for images, current index, and loading status
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Effect to fetch images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('url, alt_text')
          .order('id', { ascending: true });

        if (error) {
          console.error("Error fetching hero images:", error.message);
        } else if (data) {
          setImages(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false); // Stop loading regardless of success or error
      }
    };

    fetchImages();
  }, []); // Empty dependency array means this runs once on mount

  // 3. Effect to handle automatic sliding
  useEffect(() => {
    // Prevent interval from running if images haven't loaded yet
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  // Optional: Simple loading screen
  if (isLoading) {
    return <div className="slider-container"><div className="slider-overlay">Loading...</div></div>;
  }

  return (
    <div className="slider-container">
      {images.map((image, index) => (
        <img 
          key={index}
          src={image.url} 
          // Use the alt_text from your Supabase table, with a fallback
          alt={image.alt_text || `Slide ${index}`} 
          className={`slide-image ${index === currentIndex ? 'active' : ''}`}
        />
      ))}
      
      {/* Overlay Content */}
      <div className="slider-overlay">
        <h1>Welcome to Our Village</h1>
        <p>Experience the serenity and culture of our home.</p>
      </div>
    </div>
  );
};

export default HeroSlider;