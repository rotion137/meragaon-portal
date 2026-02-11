import React, { useState, useEffect } from 'react';
import './HeroSlider.css';

const HeroSlider = () => {
  // 1. Array of placeholder village images
  const images = [
    "https://images.unsplash.com/photo-1518176258769-f227c798150e?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2670&auto=format&fit=crop"
  ];

  // 2. State to keep track of the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // 3. Effect to handle automatic sliding
  useEffect(() => {
    const interval = setInterval(() => {
      // Move to the next image, wrapping back to 0 at the end
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    // Cleanup the interval when component unmounts
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="slider-container">
      {images.map((imgUrl, index) => (
        <img 
          key={index}
          src={imgUrl} 
          alt={`Slide ${index}`} 
          // Apply 'active' class only to the current image
          className={`slide-image ${index === currentIndex ? 'active' : ''}`}
        />
      ))}
      
      {/* Overlay Content (Text & Weather) - Stays on top */}
      <div className="slider-overlay">
        <h1>Welcome to Green Valley</h1>
        <p>Experience the serenity of our village.</p>
      </div>
    </div>
  );
};

export default HeroSlider;