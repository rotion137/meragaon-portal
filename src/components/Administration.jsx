import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Administration.css';

const Administration = () => {
  const [leaders, setLeaders] = useState([]);
  const [officials, setOfficials] = useState([]);
  const [wardHeads, setWardHeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from the 3 new tables
        const { data: leaderData } = await supabase.from('karmha_leaders').select('*').order('id');
        const { data: officialData } = await supabase.from('karmha_officials').select('*').order('id');
        const { data: wardData } = await supabase.from('karmha_ward_heads').select('*').order('id');
        
        if (leaderData) setLeaders(leaderData);
        if (officialData) setOfficials(officialData);
        if (wardData) setWardHeads(wardData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="admin-loading">Loading Administration...</div>;

  return (
    <div className="google-admin-container">
      <div className="admin-page-header">
        <h1>Village Administration</h1>
        <p>Directory of local leadership and government officials.</p>
      </div>

      {/* --- SECTION 1: TOP LEADERS (Large Cards) --- */}
      <div className="admin-section">
        <div className="admin-grid grid-large">
          {leaders.map(leader => (
            <div key={leader.id} className="google-admin-card card-large">
              <div className="photo-circle large-photo">
                {leader.photo_url ? <img src={leader.photo_url} alt={leader.name} /> : <span>👤</span>}
              </div>
              <div className="card-info-stack">
                <span className="info-pill name-pill">{leader.name}</span>
                <span className="info-pill desc-pill">{leader.designation}</span>
                <span className="info-pill contact-pill">{leader.contact || 'No Contact'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 2: GOVT OFFICIALS (Medium Cards) --- */}
      <div className="admin-section">
        <h2 className="section-title">Govt Officials</h2>
        <div className="admin-grid grid-medium">
          {officials.map(official => (
            <div key={official.id} className="google-admin-card card-medium">
              <div className="photo-circle medium-photo">
                {official.photo_url ? <img src={official.photo_url} alt={official.name} /> : <span>👤</span>}
              </div>
              <div className="card-info-stack">
                <span className="info-pill name-pill">{official.name}</span>
                <span className="info-pill desc-pill">{official.designation}</span>
                <span className="info-pill contact-pill">{official.contact || 'No Contact'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- SECTION 3: WARD HEADS (Small Cards) --- */}
      <div className="admin-section">
        <h2 className="section-title">Ward Heads</h2>
        <div className="admin-grid grid-small">
          {wardHeads.map(ward => (
            <div key={ward.id} className="google-admin-card card-small">
              <div className="photo-circle small-photo">
                {ward.photo_url ? <img src={ward.photo_url} alt={ward.name} /> : <span>👤</span>}
              </div>
              <div className="card-info-stack">
                <span className="info-pill name-pill">{ward.name}</span>
                <span className="info-pill desc-pill">Ward: {ward.ward_number}</span>
                <span className="info-pill contact-pill">{ward.contact || 'No Contact'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Administration;