import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Agriculture.css';

// --- THE SMART CROP DICTIONARY (Tailored for Chhattisgarh) ---
const cropCalendarData = [
  { month: 'January', title: 'Rabi Maintenance', crops: 'Wheat, Chana (Gram), Mustard', activities: 'Irrigate wheat at tillering stage. Monitor for aphids in mustard.' },
  { month: 'February', title: 'Late Rabi & Harvest', crops: 'Wheat, Mustard, Vegetables', activities: 'Stop irrigation for mustard. Prepare for early wheat harvest.' },
  { month: 'March', title: 'Zaid Sowing', crops: 'Moong, Urad, Summer Vegetables', activities: 'Sow summer green gram and vegetables (bhindi, lauki) where irrigation is available.' },
  { month: 'April', title: 'Summer Deep Ploughing', crops: 'Summer Vegetables', activities: 'Deep plough vacant fields to expose soil pests to the harsh sun. Maintain summer vegetable irrigation.' },
  { month: 'May', title: 'Pre-Monsoon Prep', crops: 'None', activities: 'Procure Paddy seeds, Urea, and DAP. Repair field bunds and clean irrigation channels.' },
  { month: 'June', title: 'Kharif Sowing', crops: 'Paddy (Nursery), Maize, Soybean', activities: 'Sow paddy nursery with early monsoon showers. Direct sowing of Maize and Soybean.' },
  { month: 'July', title: 'Paddy Transplanting', crops: 'Paddy (Main Field)', activities: 'Transplant paddy seedlings into main fields. Apply first dose of fertilizers.' },
  { month: 'August', title: 'Kharif Maintenance', crops: 'Paddy, Maize', activities: 'Weeding in paddy fields. Monitor for Stem Borer insects. Top dress with Urea.' },
  { month: 'September', title: 'Late Kharif', crops: 'Paddy', activities: 'Maintain water level in paddy during flowering stage. Prepare land for early Rabi.' },
  { month: 'October', title: 'Harvest & Rabi Prep', crops: 'Harvest: Paddy. Sow: Chana, Mustard', activities: 'Harvest early paddy varieties. Sowing of rainfed Chana and Mustard begins.' },
  { month: 'November', title: 'Rabi Sowing', crops: 'Wheat, Chana, Peas', activities: 'Primary sowing month for irrigated Wheat. Harvest remaining late Paddy.' },
  { month: 'December', title: 'Rabi Maintenance', crops: 'Wheat, Pulses', activities: 'First irrigation for wheat (CRI stage). Protect crops from frost.' },
];

const monthsList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Agriculture = () => {
  // Automatically select the current real-world month!
  const currentRealMonth = new Date().getMonth(); 
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentRealMonth);
  
  const [stores, setStores] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgriData = async () => {
      try {
        const { data: storeData } = await supabase.from('karmha_seed_stores').select('*').order('id');
        const { data: buyerData } = await supabase.from('karmha_verified_buyers').select('*').order('id');
        if (storeData) setStores(storeData);
        if (buyerData) setBuyers(buyerData);
      } catch (error) {
        console.error("Error fetching agri data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgriData();
  }, []);

  const activeData = cropCalendarData[selectedMonthIndex];

  if (loading) return <div className="agri-loading">Loading Farm Data...</div>;

  return (
    <div className="google-agri-container">
      <div className="agri-page-header">
        <h1>Smart Agriculture</h1>
        <p>Your daily farming dashboard for crop planning, supplies, and market access.</p>
      </div>

      {/* --- SECTION 1: SMART CROP CALENDAR --- */}
      <div className="agri-section">
        <h2 className="section-title">Interactive Crop Calendar</h2>
        
        {/* Month Slider */}
        <div className="month-slider">
          {monthsList.map((month, index) => (
            <button
              key={index}
              className={`month-pill ${index === selectedMonthIndex ? 'active' : ''}`}
              onClick={() => setSelectedMonthIndex(index)}
            >
              {month}
            </button>
          ))}
        </div>

        {/* Dynamic Recommendation Card */}
        <div className="smart-calendar-card">
          <div className="calendar-header">
            <h3>{activeData.title}</h3>
            <span className="calendar-month-badge">{activeData.month} Guide</span>
          </div>
          <div className="calendar-body">
            <div className="cal-item">
              <span className="cal-icon">🌱</span>
              <div>
                <strong>Recommended Crops</strong>
                <p>{activeData.crops}</p>
              </div>
            </div>
            <div className="cal-item">
              <span className="cal-icon">🚜</span>
              <div>
                <strong>Key Activities</strong>
                <p>{activeData.activities}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: INPUTS & FINANCE (Split View) --- */}
      <div className="agri-section inputs-finance-grid">
        
        {/* Left: Seed Stores */}
        <div className="stores-panel">
          <h2 className="section-title">Govt Seed & Fertilizer Centers</h2>
          <div className="stores-list">
            {stores.map((store) => (
              <div key={store.id} className="store-card google-card-hover">
                
                {/* Store Header with Photo Thumbnail */}
                <div className="store-header">
                  <div className="store-title-area">
                    <h4>{store.name}</h4>
                    <span className="store-type">{store.type}</span>
                  </div>
                  <div className="store-thumbnail">
                    {store.image_url ? (
                      <img src={store.image_url} alt={store.name} />
                    ) : (
                      <span>🏪</span>
                    )}
                  </div>
                </div>

                <p className="store-desc">{store.description}</p>
                <div className="store-footer">
                  <span className="store-contact">{store.contact_info}</span>
                  {store.accepts_kcc && (
                    <span className="kcc-badge">✅ Accepts KCC</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

    {/* Right: KCC Finance Card */}
        <div className="finance-panel">
          <h2 className="section-title">Farming Finance</h2>
          <div className="kcc-card google-card-hover">
            <div className="kcc-icon-area">💳</div>
            <h3>Kisan Credit Card (KCC)</h3>
            <p>Get short-term credit at highly subsidized interest rates (up to 3%) to purchase seeds, fertilizers, and pesticides.</p>
            <ul className="kcc-benefits">
              <li>✔️ Credit limit up to ₹3 Lakhs</li>
              <li>✔️ Valid for 5 years</li>
              <li>✔️ Crop insurance included</li>
            </ul>
            {/* UPDATED: Now an active link to the official GOI portal */}
            <a 
              href="https://www.myscheme.gov.in/schemes/kcc" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="google-btn apply-btn"
            >
              Check Eligibility / Apply
            </a>
          </div>
        </div>

      </div>

      {/* --- SECTION 3: VERIFIED LOCAL BUYERS --- */}
      <div className="agri-section">
        <h2 className="section-title">Verified Local Buyers (Sell Direct)</h2>
        <div className="buyers-grid">
          {buyers.map((buyer) => (
            <div key={buyer.id} className="buyer-card google-card-hover">
              <div className="buyer-header">
                <span className="trust-badge">🛡️ {buyer.trust_badge}</span>
                <h4>{buyer.name}</h4>
              </div>
              <div className="buyer-crops">
                <strong>Buys:</strong>
                <div className="crop-tags">
                  {buyer.crops_bought && buyer.crops_bought.map((crop, idx) => (
                    <span key={idx} className="crop-tag">{crop}</span>
                  ))}
                </div>
              </div>
              <div className="buyer-footer">
                <span className="buyer-address">📍 {buyer.address}</span>
                <button className="call-buyer-btn">📞 {buyer.contact_info}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Agriculture;