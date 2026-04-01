import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Education.css';

const Education = () => {
  const [schools, setSchools] = useState([]);
  const [anganbadis, setAnganbadis] = useState([]);
  const [otherEdu, setOtherEdu] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State to track if a specific institute is open in the detail view
  const [selectedInstitute, setSelectedInstitute] = useState(null);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const { data: schoolData } = await supabase.from('karmha_schools').select('*').order('id');
        const { data: anganData } = await supabase.from('karmha_anganbadis').select('*').order('id');
        const { data: otherData } = await supabase.from('karmha_other_edu').select('*').order('id');

        if (schoolData) setSchools(schoolData);
        if (anganData) setAnganbadis(anganData);
        if (otherData) setOtherEdu(otherData);
      } catch (error) {
        console.error("Error fetching education data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducationData();
  }, []);

  if (loading) return <div className="edu-loading">Loading Education Data...</div>;

  // ==========================================
  // VIEW 2: THE DETAILED INSTITUTE LAYOUT
  // ==========================================
  if (selectedInstitute) {
    return (
      <div className="google-edu-container">
        <button className="google-back-btn" onClick={() => setSelectedInstitute(null)}>
          ← Back to Education
        </button>

        <div className="edu-detail-card">
          <h1 className="detail-title">{selectedInstitute.name}</h1>
          
          <div className="detail-hero-image">
            {selectedInstitute.image_url ? (
              <img src={selectedInstitute.image_url} alt={selectedInstitute.name} />
            ) : (
              <div className="img-placeholder">🏫</div>
            )}
          </div>

          <p className="detail-description">{selectedInstitute.description}</p>

          {/* Staff Section */}
          {selectedInstitute.staff && selectedInstitute.staff.length > 0 && (
            <div className="detail-staff-section">
              <h2 className="staff-title">STAFF</h2>
              <div className="staff-grid">
                {selectedInstitute.staff.map((staffMember, index) => (
                  <div key={index} className="staff-card">
                    <div className="staff-photo">
                      {staffMember.photo_url ? (
                        <img src={staffMember.photo_url} alt={staffMember.name} />
                      ) : (
                        <span>👤</span>
                      )}
                    </div>
                    <div className="staff-info">
                      <span className="staff-name">{staffMember.name}</span>
                      <span className="staff-designation">{staffMember.designation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // HELPER FUNCTION: Renders the lists
  // (Moved outside the return statement!)
  // ==========================================
  const renderCards = (title, data) => (
    <div className="edu-section">
      <h2 className="edu-section-title">{title}</h2>
      {data.length === 0 ? (
        <p className="empty-text">No data available.</p>
      ) : (
        <div className="edu-grid">
          {data.map((inst) => (
            <div key={inst.id} className="google-edu-card">
              <div className="card-image-area">
                {inst.image_url ? (
                  <img src={inst.image_url} alt={inst.name} />
                ) : (
                  <div className="img-placeholder">🏫</div>
                )}
              </div>
              <div className="card-content-area">
                <h3 className="card-title">{inst.name}</h3>
                <div className="card-bottom-row">
                  <span className="class-pill">For: {inst.classes}</span>
                  <button 
                    className="google-btn explore-btn"
                    onClick={() => setSelectedInstitute(inst)}
                  >
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ==========================================
  // VIEW 1: THE MAIN LIST LAYOUT
  // ==========================================
  return (
    <div className="google-edu-container">
      <div className="edu-page-header">
        <h1>Education</h1>
        <p>Explore schools, Anganbadis, and educational facilities in KarmhaGaon.</p>
      </div>

      {/* Now we just call the function cleanly! */}
      {renderCards('SCHOOL', schools)}
      {renderCards('ANGANBADI', anganbadis)}
      {renderCards('OTHER EDUCATION', otherEdu)}

    </div>
  );
};

export default Education;