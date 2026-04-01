import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Service.css';

const Service = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('government'); 

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('village_services')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const displayedServices = services.filter(
    (service) => service.service_type === activeTab
  );

  return (
    <div className="google-services-container">
      
      {/* Segmented Toggle (Google Style) */}
      <div className="toggle-wrapper">
        <div className="segmented-control">
          <button 
            className={`segment-btn ${activeTab === 'government' ? 'active' : ''}`}
            onClick={() => setActiveTab('government')}
          >
            Government
          </button>
          <button 
            className={`segment-btn ${activeTab === 'private' ? 'active' : ''}`}
            onClick={() => setActiveTab('private')}
          >
            Private
          </button>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="loading-state">Loading services...</div>
      ) : displayedServices.length === 0 ? (
        <div className="empty-state">
          <p>No {activeTab} services are currently available.</p>
        </div>
      ) : (
        <div className="google-grid">
          {displayedServices.map((service) => (
            <div key={service.id} className="google-card">
              
              {/* Image Section */}
              <div className="card-image-area">
                {service.image_url ? (
                  <img src={service.image_url} alt={service.title} className="service-img" />
                ) : (
                  <div className="placeholder-img">
                    <span className="placeholder-icon">📷</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="card-content-area">
                <h3 className="card-title">{service.title}</h3>
                <p className="card-description">{service.description}</p>
              </div>

              {/* Contact Footer */}
              <div className="card-footer">
                <span className="contact-label">Contact:</span>
                <span className="contact-value">{service.contact_info}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Service;