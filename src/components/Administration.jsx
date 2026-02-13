import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Administration.css';

const Administration = () => {
  const [leaders, setLeaders] = useState([]);
  const [officials, setOfficials] = useState([]);
  const [formerReps, setFormerReps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching all 3 tables
        const { data: leaderData } = await supabase.from('village_leaders').select('*').order('display_order');
        const { data: officialData } = await supabase.from('village_officials').select('*');
        const { data: formerData } = await supabase.from('former_representatives').select('*');
        
        setLeaders(leaderData || []);
        setOfficials(officialData || []);
        setFormerReps(formerData || []);
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
    <div className="admin-page">
      <h1 className="admin-main-title">Administration</h1>

      {/* --- TOP LEADERS (Sarpanch, Vice-Sarpanch, Sachiv) --- */}
      <div className="leaders-container">
        {leaders.length > 0 ? leaders.map(leader => (
          <div key={leader.id} className="leader-card">
            <div className="leader-photo" style={{ backgroundImage: `url(${leader.photo_url || 'https://via.placeholder.com/150'})` }}></div>
            <div className="leader-details">
              <h3>{leader.name}</h3>
              <p className="admin-designation">{leader.designation}</p>
              <p className="admin-desc">{leader.description}</p>
            </div>
          </div>
        )) : <p>No leaders found in database.</p>}
      </div>

      {/* --- GOVT OFFICIALS --- */}
      <h2 className="admin-section-header">Govt Officials</h2>
      <div className="admin-grid">
        {officials.filter(o => o.designation !== 'Ward Head').map(off => (
          <div key={off.id} className="admin-small-card">
            <div className="admin-circle-img" style={{ backgroundImage: `url(${off.photo_url || 'https://via.placeholder.com/100'})` }}></div>
            <h4>{off.name}</h4>
            <p>{off.designation}</p>
            <p className="admin-contact">{off.contact_no}</p>
          </div>
        ))}
      </div>

      {/* --- WARD HEADS --- */}
      <h2 className="admin-section-header">Ward Heads</h2>
      <div className="admin-grid">
        {officials.filter(o => o.designation === 'Ward Head').map(ward => (
          <div key={ward.id} className="admin-small-card">
            <div className="admin-circle-img" style={{ backgroundImage: `url(${ward.photo_url || 'https://via.placeholder.com/100'})` }}></div>
            <h4>{ward.name}</h4>
            <p>Ward No: {ward.ward_no}</p>
            <p className="admin-contact">{ward.contact_no}</p>
          </div>
        ))}
      </div>

      {/* --- FORMER REPRESENTATIVES --- */}
      <h2 className="admin-section-header">List of Former Village Representatives</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Serving Period</th>
            </tr>
          </thead>
          <tbody>
            {formerReps.map((rep, index) => (
              <tr key={rep.id}>
                <td>{index + 1}</td>
                <td>{rep.name}</td>
                <td>{rep.designation}</td>
                <td>{rep.serving_period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Administration;