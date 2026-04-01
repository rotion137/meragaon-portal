import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './HealthCare.css';

const HealthCare = () => {
  const [hospitals, setHospitals] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [healthInfo, setHealthInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const { data: hospData } = await supabase.from('karmha_hospitals').select('*');
        const { data: workData } = await supabase.from('karmha_health_workers').select('*');
        const { data: emerData } = await supabase.from('karmha_emergency_contacts').select('*');
        const { data: infoData } = await supabase.from('karmha_health_info').select('*');

        if (hospData) setHospitals(hospData);
        if (workData) setWorkers(workData);
        if (emerData) setEmergencies(emerData);
        if (infoData) setHealthInfo(infoData);
      } catch (error) {
        console.error("Error fetching healthcare data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHealthData();
  }, []);

  if (loading) return <div className="health-loading">Loading Healthcare Info...</div>;

  return (
    <div className="google-health-container">
      <div className="health-page-header">
        <h1>Health & Medical Care</h1>
        <p>Access emergency contacts, local facilities, and health schemes.</p>
      </div>

      {/* --- SECTION 1: EMERGENCY CONTACTS --- */}
      <div className="health-section">
        <h2 className="health-section-title emergency-title">🚨 Emergency Contacts</h2>
        <div className="emergency-pill-container">
          {emergencies.map((contact) => (
            <div key={contact.id} className="emergency-pill">
              <strong>{contact.name}</strong>
              <span className="contact-number">{contact.contact_number}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 2: HEALTH CARE CENTRES --- */}
      <div className="health-section">
        <h2 className="health-section-title">🏥 Health Care Centres</h2>
        <div className="health-grid hospital-grid">
          {hospitals.map((hosp) => (
            <div key={hosp.id} className="google-health-card hospital-card">
              <div className="hospital-image-area">
                {hosp.image_url ? <img src={hosp.image_url} alt={hosp.name} /> : <div className="img-placeholder">🏥</div>}
              </div>
              <div className="hospital-info">
                <h3>{hosp.name}</h3>
                <div className="hospital-actions">
                  <span className="distance-badge">Distance: {hosp.distance}</span>
                  {/* Google Maps Direction Link */}
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.coordinates}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="direction-btn"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 3: HEALTH RELATED WORKERS (Mitanin) --- */}
      <div className="health-section">
        <h2 className="health-section-title">👩‍⚕️ Health Related Workers (Mitanin)</h2>
        <div className="health-grid worker-grid">
          {workers.map((worker) => (
            <div key={worker.id} className="google-health-card worker-card">
              <div className="worker-photo">
                {worker.photo_url ? <img src={worker.photo_url} alt={worker.name} /> : <span>👤</span>}
              </div>
              <div className="worker-details">
                <span className="worker-name">{worker.name}</span>
                <span className="worker-designation">{worker.designation}</span>
                <span className="worker-contact">{worker.contact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 4: OTHER INFORMATION (Ayushman etc.) --- */}
      <div className="health-section">
        <h2 className="health-section-title">📄 Other Information & Schemes</h2>
        <div className="health-grid info-grid">
          {healthInfo.map((info) => (
            <div key={info.id} className="google-health-card info-card">
              <div className="info-image">
                {info.image_url && <img src={info.image_url} alt={info.title} />}
              </div>
              <div className="info-content">
                <h3>{info.title}</h3>
                <p className="info-description">{info.description}</p>
                {info.action_url && (
                  <a href={info.action_url} target="_blank" rel="noopener noreferrer" className="action-btn">
                    {info.button_text || 'View Details'}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HealthCare;