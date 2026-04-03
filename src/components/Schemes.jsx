import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Schemes.css';

// Hardcoded static list for standard government schemes
const citizenSchemes = [
  {
    id: 1,
    title: 'Pradhan Mantri Awas Yojana (PMAY-G)',
    icon: '🏠',
    description: 'Financial assistance to build a pucca house for families living in kutcha houses.',
    eligibility: ['Must be a resident of the village', 'No pucca house anywhere in India', 'Listed in SECC 2011 data'],
    link: 'https://pmayg.nic.in/'
  },
  {
    id: 2,
    title: 'Swachh Bharat Mission (SBM)',
    icon: '🚽',
    description: 'Grant of ₹12,000 for the construction of an individual household latrine (IHHL).',
    eligibility: ['BPL households', 'Aadhar Card', 'Bank Passbook'],
    link: 'https://swachhbharatmission.gov.in/'
  },
  {
    id: 3,
    title: 'PM Kisan Samman Nidhi',
    icon: '🌾',
    description: 'Direct income support of ₹6,000 per year (in 3 equal installments) to landholding farmer families.',
    eligibility: ['Must own cultivable land', 'Valid Aadhar Card linked to Bank Account'],
    link: 'https://pmkisan.gov.in/'
  }
];

const Schemes = () => {
  const [activeView, setActiveView] = useState('funds'); // 'funds', 'projects', 'schemes'
  const [funds, setFunds] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransparencyData = async () => {
      try {
        const { data: fundsData } = await supabase.from('karmha_funds_received').select('*').order('date_received', { ascending: false });
        const { data: projectsData } = await supabase.from('karmha_projects_expenditure').select('*').order('id', { ascending: false });
        
        if (fundsData) setFunds(fundsData);
        if (projectsData) setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching transparency data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransparencyData();
  }, []);

  // --- AUTOMATIC MATH CALCULATIONS ---
  const totalReceived = funds.reduce((sum, item) => sum + Number(item.amount_received), 0);
  const totalSpent = projects.reduce((sum, item) => sum + Number(item.allocated_budget), 0);
  const remainingBudget = totalReceived - totalSpent;
  const utilizationPercentage = totalReceived > 0 ? ((totalSpent / totalReceived) * 100).toFixed(1) : 0;

  // Helper to format currency nicely (e.g., ₹15,00,000)
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) return <div className="schemes-loading">Loading Transparency Data...</div>;

  return (
    <div className="google-schemes-container">
      <div className="schemes-page-header">
        <h1>Transparency & Schemes</h1>
        <p>Track village development funds, current projects, and apply for your benefits.</p>
      </div>

      {/* --- INTERNAL NAVIGATION TABS --- */}
      <div className="schemes-nav-tabs">
        <button className={`tab-btn ${activeView === 'funds' ? 'active' : ''}`} onClick={() => setActiveView('funds')}>
          💰 Panchayat Funds
        </button>
        <button className={`tab-btn ${activeView === 'projects' ? 'active' : ''}`} onClick={() => setActiveView('projects')}>
          🏗️ Project Tracker
        </button>
        <button className={`tab-btn ${activeView === 'schemes' ? 'active' : ''}`} onClick={() => setActiveView('schemes')}>
          📝 Citizen Schemes
        </button>
      </div>

      {/* ==========================================
          VIEW 1: FUNDS TRACKER (MACRO VIEW)
          ========================================== */}
      {activeView === 'funds' && (
        <div className="schemes-section animation-fade-in">
          <h2 className="section-title">Financial Year Overview</h2>
          
          <div className="macro-summary-grid">
            <div className="summary-card total-in">
              <span className="card-label">Total Funds Received</span>
              <h3 className="card-amount">{formatINR(totalReceived)}</h3>
            </div>
            <div className="summary-card total-out">
              <span className="card-label">Allocated to Projects</span>
              <h3 className="card-amount">{formatINR(totalSpent)}</h3>
            </div>
            <div className="summary-card remaining">
              <span className="card-label">Remaining Balance</span>
              <h3 className="card-amount">{formatINR(remainingBudget)}</h3>
            </div>
          </div>

          <div className="utilization-bar-container">
            <div className="utilization-header">
              <span>Fund Utilization</span>
              <strong>{utilizationPercentage}%</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${utilizationPercentage}%` }}></div>
            </div>
          </div>

          <h3 className="sub-title">Recent Fund Deposits</h3>
          <div className="google-table-container">
            <table className="google-schemes-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Fund Source</th>
                  <th>Financial Year</th>
                  <th className="align-right">Amount Received</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((fund) => (
                  <tr key={fund.id}>
                    <td>{new Date(fund.date_received).toLocaleDateString('en-IN')}</td>
                    <td className="fw-500">{fund.fund_source}</td>
                    <td>{fund.financial_year}</td>
                    <td className="align-right text-green fw-600">+{formatINR(fund.amount_received)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 2: PROJECT TRANSPARENCY (MICRO VIEW)
          ========================================== */}
      {activeView === 'projects' && (
        <div className="schemes-section animation-fade-in">
          <h2 className="section-title">Village Project Transparency Board</h2>
          <p className="section-desc">Details of all approved physical projects and contractor accountability.</p>
          
          <div className="google-table-container">
            <table className="google-schemes-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Fund Used</th>
                  <th>Contractor & Contact</th>
                  <th>Budget</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => (
                  <tr key={proj.id}>
                    <td className="fw-600 text-blue">{proj.project_name}</td>
                    <td className="text-small">{proj.fund_source_used}</td>
                    <td>
                      <div className="contractor-info">
                        <span className="fw-500">{proj.contractor_name}</span>
                        <span className="text-small text-gray">📞 {proj.contractor_contact}</span>
                      </div>
                    </td>
                    <td className="fw-600">{formatINR(proj.allocated_budget)}</td>
                    <td>
                      <span className={`status-badge status-${proj.status.toLowerCase().replace(' ', '-')}`}>
                        {proj.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          VIEW 3: CITIZEN SCHEMES (BENEFITS)
          ========================================== */}
      {activeView === 'schemes' && (
        <div className="schemes-section animation-fade-in">
          <h2 className="section-title">Apply for Government Benefits</h2>
          <div className="schemes-grid">
            {citizenSchemes.map((scheme) => (
              <div key={scheme.id} className="citizen-scheme-card google-card-hover">
                <div className="scheme-icon">{scheme.icon}</div>
                <h3 className="scheme-title">{scheme.title}</h3>
                <p className="scheme-desc">{scheme.description}</p>
                
                <div className="scheme-eligibility">
                  <strong>Eligibility:</strong>
                  <ul>
                    {scheme.eligibility.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                
                <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="google-btn apply-btn mt-auto">
                  Official Portal / Apply
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Schemes;