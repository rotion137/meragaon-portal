import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './UserProfile.css';

const UserProfile = ({ user, setActiveTab }) => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- ADMIN STATES ---
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showAdminServicesModal, setShowAdminServicesModal] = useState(false);
  const [pendingServices, setPendingServices] = useState([]);

  const [showGovtServiceModal, setShowGovtServiceModal] = useState(false);
  const [newGovtService, setNewGovtService] = useState({ title: '', description: '', contact: '' });

  // NEW: Admin Transparency & Schemes States
  const [showFundModal, setShowFundModal] = useState(false);
  const [newFund, setNewFund] = useState({ source: '', year: '2025-2026', amount: '', date: '' });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', sourceUsed: '', budget: '', contractorName: '', contact: '', status: 'Not Started' });

  // --- VILLAGER STATES ---
  const [showGrievancesModal, setShowGrievancesModal] = useState(false);
  const [myGrievances, setMyGrievances] = useState([]);
  const [loadingGrievances, setLoadingGrievances] = useState(false);
  
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [myServices, setMyServices] = useState([]);
  const [newService, setNewService] = useState({ title: '', description: '', contact: '' });
  const [isSubmittingService, setIsSubmittingService] = useState(false);

  // 1. Fetch Role
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (data) setRole(data.role);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  // 2. Handle Logout
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setActiveTab('Home');
  };

  // --- ADMIN LOGIC: Standard Functions ---
  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('notices').insert([{ text: newNotice }]);
      if (error) throw error;
      setNewNotice('');
      setShowNoticeModal(false);
      alert('Notice added successfully!'); 
    } catch (error) { alert('Failed to add notice.'); } finally { setIsSubmitting(false); }
  };

  const handleOpenAdminServices = async () => {
    setShowAdminServicesModal(true);
    const { data } = await supabase.from('village_services').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    if (data) setPendingServices(data);
  };

  const handleUpdateServiceStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from('village_services').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setPendingServices(pendingServices.filter(s => s.id !== id));
      alert(`Service ${newStatus} successfully!`);
    } catch (error) { alert('Failed to update service status.'); }
  };

  const handleAddGovtService = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('village_services').insert([{
        user_id: user.id, title: newGovtService.title, description: newGovtService.description, contact_info: newGovtService.contact, status: 'approved', service_type: 'government'
      }]);
      if (error) throw error;
      alert('Government Service added to public portal!');
      setNewGovtService({ title: '', description: '', contact: '' });
      setShowGovtServiceModal(false);
    } catch (error) { alert('Failed to add government service.'); } finally { setIsSubmitting(false); }
  };

  // --- NEW ADMIN LOGIC: Transparency Dashboard (Funds & Projects) ---
  const handleAddFund = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('karmha_funds_received').insert([{
        fund_source: newFund.source,
        financial_year: newFund.year,
        amount_received: Number(newFund.amount),
        date_received: newFund.date
      }]);
      if (error) throw error;
      alert('Panchayat Fund Record Added!');
      setNewFund({ source: '', year: '2025-2026', amount: '', date: '' });
      setShowFundModal(false);
    } catch (error) { alert('Failed to add fund record.'); } finally { setIsSubmitting(false); }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('karmha_projects_expenditure').insert([{
        project_name: newProject.name,
        fund_source_used: newProject.sourceUsed,
        allocated_budget: Number(newProject.budget),
        contractor_name: newProject.contractorName,
        contractor_contact: newProject.contact,
        status: newProject.status
      }]);
      if (error) throw error;
      alert('Village Project Added to Transparency Board!');
      setNewProject({ name: '', sourceUsed: '', budget: '', contractorName: '', contact: '', status: 'Not Started' });
      setShowProjectModal(false);
    } catch (error) { alert('Failed to add project.'); } finally { setIsSubmitting(false); }
  };


  // --- VILLAGER LOGIC ---
  const handleOpenGrievances = async () => {
    setShowGrievancesModal(true);
    setLoadingGrievances(true);
    const { data } = await supabase.from('grievances').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setMyGrievances(data);
    setLoadingGrievances(false);
  };

  const handleOpenServices = async () => {
    setShowServicesModal(true);
    const { data } = await supabase.from('village_services').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setMyServices(data);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setIsSubmittingService(true);
    try {
      const { error } = await supabase.from('village_services').insert([{
        user_id: user.id, title: newService.title, description: newService.description, contact_info: newService.contact
      }]);
      if (error) throw error;
      alert('Service submitted for Admin approval!');
      setNewService({ title: '', description: '', contact: '' });
      handleOpenServices(); 
    } catch (error) { alert('Failed to submit service.'); } finally { setIsSubmittingService(false); }
  };

  if (loading) return <div className="profile-loading">Loading your profile...</div>;

  return (
    <div className="profile-page-wrapper">
      <div className="profile-page-header">
        <h1>Account Dashboard</h1>
        <p>Manage your village profile and services.</p>
      </div>

      <div className="profile-grid">
        <div className="profile-identity-card">
          <div className="avatar-large">{user?.email?.charAt(0).toUpperCase()}</div>
          <h2>{user?.email}</h2>
          <span className={`role-badge-large ${role === 'admin' ? 'admin-badge' : 'villager-badge'}`}>
            {role ? role.toUpperCase() : 'VILLAGER'}
          </span>
          <button className="logout-btn-large" onClick={handleSignOut}>Sign Out</button>
        </div>

        <div className="profile-actions-area">
          
          {/* --- ADMIN VIEW --- */}
          {role === 'admin' && (
            <div className="action-section admin-theme">
              <h2>Admin Control Center</h2>
              <p>Manage village data, services, and transparency records.</p>
              <div className="action-cards-grid">
                
                <div className="action-card">
                  <h3>📢 Add Notice</h3>
                  <button className="action-btn" onClick={() => setShowNoticeModal(true)}>Create Notice</button>
                </div>
                
                <div className="action-card">
                  <h3>✅ Approve Services</h3>
                  <button className="action-btn" onClick={handleOpenAdminServices}>Review Pending</button>
                </div>

                <div className="action-card">
                  <h3>🏛️ Add Govt Service</h3>
                  <button className="action-btn" onClick={() => setShowGovtServiceModal(true)}>Create Service</button>
                </div>

                {/* NEW: Transparency Dashboard Controls */}
                <div className="action-card">
                  <h3>💰 Record Funds</h3>
                  <button className="action-btn" onClick={() => setShowFundModal(true)}>Add Received Funds</button>
                </div>

                <div className="action-card">
                  <h3>🏗️ Add Village Project</h3>
                  <button className="action-btn" onClick={() => setShowProjectModal(true)}>Record Expenditure</button>
                </div>

                <div className="action-card">
                  <h3>📝 Review Grievances</h3>
                  <button className="action-btn">View Inbox</button>
                </div>
              </div>
            </div>
          )}

          {/* --- VILLAGER VIEW --- */}
          {role !== 'admin' && (
            <div className="action-section villager-theme">
              <h2>My Village Services</h2>
              <p>Access your personal records and applications.</p>
              <div className="action-cards-grid">
                <div className="action-card">
                  <h3>🛠️ Offer a Service</h3>
                  <button className="action-btn" onClick={handleOpenServices}>Manage Services</button>
                </div>
                <div className="action-card">
                  <h3>🗣️ Track Grievances</h3>
                  <button className="action-btn" onClick={handleOpenGrievances}>Track Issues</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================= MODALS ========================================= */}

      {/* 1. Admin Notice Modal (Existing) */}
      {showNoticeModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3>Create a New Notice</h3>
            <form onSubmit={handleAddNotice}>
              <textarea className="notice-textarea" placeholder="Type the announcement here..." value={newNotice} onChange={(e) => setNewNotice(e.target.value)} required rows="4" />
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowNoticeModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Admin Review Pending Services Modal (Existing) */}
      {showAdminServicesModal && (
         <div className="admin-modal-overlay">
         <div className="admin-modal-content wide-modal">
           <h3>Review Pending Services</h3>
           <div className="data-list-container">
             {pendingServices.length === 0 ? <p>No pending services to review.</p> : (
               <ul className="data-list">
                 {pendingServices.map(s => (
                   <li key={s.id} className="data-list-item">
                     <div className="data-list-info">
                       <strong>{s.title}</strong>
                       <span>{s.description}</span>
                       <span>Contact: {s.contact_info}</span>
                     </div>
                     <div className="admin-action-buttons">
                       <button className="approve-btn" onClick={() => handleUpdateServiceStatus(s.id, 'approved')}>Approve</button>
                       <button className="reject-btn" onClick={() => handleUpdateServiceStatus(s.id, 'rejected')}>Reject</button>
                     </div>
                   </li>
                 ))}
               </ul>
             )}
           </div>
           <div className="admin-modal-actions">
             <button className="cancel-btn" onClick={() => setShowAdminServicesModal(false)}>Close</button>
           </div>
         </div>
       </div>
      )}

      {/* 3. Admin Add Govt Service Modal (Existing) */}
      {showGovtServiceModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3>Add Official Government Service</h3>
            <form onSubmit={handleAddGovtService} className="add-service-form">
              <input type="text" placeholder="Service Title" value={newGovtService.title} onChange={e => setNewGovtService({...newGovtService, title: e.target.value})} required />
              <textarea placeholder="Description" value={newGovtService.description} onChange={e => setNewGovtService({...newGovtService, description: e.target.value})} required rows="3" />
              <input type="text" placeholder="Contact Info" value={newGovtService.contact} onChange={e => setNewGovtService({...newGovtService, contact: e.target.value})} required />
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowGovtServiceModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>Add Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          NEW TRANSPARENCY DASHBOARD MODALS
          ========================================= */}

      {/* 4. NEW: Admin Record Received Funds Modal */}
      {showFundModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3>Record Received Panchayat Funds</h3>
            <form onSubmit={handleAddFund} className="add-service-form">
              <input type="text" placeholder="Fund Source (e.g., 15th Finance Commission)" value={newFund.source} onChange={e => setNewFund({...newFund, source: e.target.value})} required />
              <select value={newFund.year} onChange={e => setNewFund({...newFund, year: e.target.value})} className="admin-select-input" required>
                <option value="2024-2025">2024-2025</option>
                <option value="2025-2026">2025-2026</option>
                <option value="2026-2027">2026-2027</option>
              </select>
              <input type="number" placeholder="Amount Received (₹)" value={newFund.amount} onChange={e => setNewFund({...newFund, amount: e.target.value})} required min="1" />
              <input type="date" value={newFund.date} onChange={e => setNewFund({...newFund, date: e.target.value})} required className="admin-select-input" />
              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowFundModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>Record Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. NEW: Admin Add Village Project Modal */}
      {showProjectModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            <h3>Record New Village Project</h3>
            <form onSubmit={handleAddProject} className="add-service-form">
              <input type="text" placeholder="Project Name (e.g., CC Road Ward 4)" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} required />
              <input type="text" placeholder="Fund Used (e.g., State Grant)" value={newProject.sourceUsed} onChange={e => setNewProject({...newProject, sourceUsed: e.target.value})} required />
              <input type="number" placeholder="Allocated Budget (₹)" value={newProject.budget} onChange={e => setNewProject({...newProject, budget: e.target.value})} required min="1" />
              
              <div className="form-row-split">
                <input type="text" placeholder="Contractor / Agency Name" value={newProject.contractorName} onChange={e => setNewProject({...newProject, contractorName: e.target.value})} required />
                <input type="text" placeholder="Contractor Phone" value={newProject.contact} onChange={e => setNewProject({...newProject, contact: e.target.value})} required />
              </div>

              <select value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value})} className="admin-select-input" required>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>

              <div className="admin-modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowProjectModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>Publish Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================= VILLAGER MODALS ========================================= */}
      
      {/* Villager Grievances & Services Modals (Unchanged) */}
      {showGrievancesModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content wide-modal">
            <h3>My Submitted Grievances</h3>
            <div className="data-list-container">
              {loadingGrievances ? <p>Loading...</p> : myGrievances.length === 0 ? <p>You have not submitted any grievances yet.</p> : (
                <ul className="data-list">
                  {myGrievances.map(g => (
                    <li key={g.id} className="data-list-item">
                      <div className="data-list-info">
                        <strong>{g.title}</strong>
                        <span>Sent to: {g.send_to.toUpperCase()} | Date: {new Date(g.created_at).toLocaleDateString()}</span>
                      </div>
                      <span className={`status-badge status-${g.status.toLowerCase().replace(' ', '-')}`}>{g.status}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="admin-modal-actions">
              <button className="cancel-btn" onClick={() => setShowGrievancesModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showServicesModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content wide-modal">
            <h3>Offer a Service</h3>
            <form onSubmit={handleAddService} className="add-service-form">
              <input type="text" placeholder="Service Title" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} required />
              <textarea placeholder="Description" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} required rows="2" />
              <input type="text" placeholder="Contact Number" value={newService.contact} onChange={e => setNewService({...newService, contact: e.target.value})} required />
              <button type="submit" className="submit-btn" disabled={isSubmittingService}>Submit</button>
            </form>
            <div className="admin-modal-actions" style={{marginTop: '20px'}}>
              <button className="cancel-btn" onClick={() => setShowServicesModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default UserProfile;