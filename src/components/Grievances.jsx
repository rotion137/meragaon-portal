import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import emailjs from '@emailjs/browser'; 
import './Grievances.css'; 

const Grievances = ({ user, setShowAuthModal }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sendTo, setSendTo] = useState('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Official Email Directory ---
  const OFFICIAL_EMAILS = {
    admin: 'roshanpaikra26@gmail.com', 
    sdm: 'roshanpaikra26@gmail.com',              
    dm: 'roshanpaikra26@gmail.com'               
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Supabase
      const { error: dbError } = await supabase
        .from('grievances')
        .insert([{ user_id: user.id, title, description, send_to: sendTo }]);

      if (dbError) throw dbError;

      // 2. Send the Automated Email
      const serviceID = 'service_4lo0d5x'; 
      const templateID = 'template_89xlm4f'; 
      const publicKey = 'wR6kAJKPq4PMIAjWS'; 

      const templateParams = {
        to_email: OFFICIAL_EMAILS[sendTo], 
        user_email: user.email,
        title: title,
        description: description,
      };

      await emailjs.send(serviceID, templateID, templateParams, publicKey);

      // 3. Success Reset
      alert('Grievance submitted and official email sent successfully!');
      setTitle('');
      setDescription('');
      setSendTo('admin');
      
    } catch (error) {
      console.error("Error submitting grievance:", error);
      alert('Failed to submit grievance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="google-grievance-wrapper">
      <div className="google-grievance-card">
        
        <div className="google-grievance-header">
          <div className="header-icon-wrapper">
            <span className="header-icon">🚩</span>
          </div>
          <div>
            <h2>Report an Issue</h2>
            <p>Submit your complaints to the Gram Panchayat or higher authorities.</p>
          </div>
        </div>

        <form className="google-grievance-form" onSubmit={handleSubmit}>
          
          <div className="google-form-group">
            <label>Issue Title</label>
            <input 
              type="text" 
              className="google-input"
              placeholder="e.g., Broken water pipe in Ward 4" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="google-form-group">
            <label>Detailed Description</label>
            <textarea 
              rows="5" 
              className="google-input google-textarea"
              placeholder="Please explain the issue in detail..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required 
            />
          </div>

          <div className="google-form-group">
            <label>Send Complaint To:</label>
            <select 
              className="google-input google-select"
              value={sendTo} 
              onChange={(e) => setSendTo(e.target.value)}
            >
              <option value="admin">Gram Panchayat (Local Admin)</option>
              <option value="sdm">Sub-Divisional Magistrate (SDM)</option>
              <option value="dm">District Magistrate (DM)</option>
            </select>
          </div>

          <div className="google-form-actions">
            {user ? (
              <button type="submit" className="google-btn primary-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Submit Grievance'}
              </button>
            ) : (
              <button type="button" className="google-btn outline-btn" onClick={() => setShowAuthModal(true)}>
                Log in to Submit
              </button>
            )}
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default Grievances;