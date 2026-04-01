import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import HeroSlider from './components/HeroSlider';
import DashboardHero from './components/DashboardHero'; 
import AuthModal from './components/AuthModal'; 
import UserProfile from './components/UserProfile'; 
import Detail from './components/Detail'; 
import Administration from './components/Administration'; 
import Grievances from './components/Grievances'; 
import Service from './components/Service'; 
import HealthCare from './components/HealthCare'; // 1. NEW: Imported HealthCare
import Education from './components/Education';
import Sports from './components/Sports';
import { supabase } from './supabaseClient'; 
import './App.css'; 

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Home'); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="app-layout">
      
      <TopBar 
        onProfileClick={() => user ? setActiveTab('Profile') : setShowAuthModal(true)} 
        user={user} 
      />
      
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <div className="content-container">
          
          {/* --- HOME TAB --- */}
          {activeTab === 'Home' && (
            <div className="home-card">
              {user ? <DashboardHero /> : <HeroSlider />}
              <div className="home-text">
                <h2>Welcome to KarmhaGaon</h2>
                <p>{user ? `Hello, ${user.email}!` : "Please sign in to access services."}</p>
              </div>
            </div>
          )}

          {/* --- PROFILE TAB --- */}
          {activeTab === 'Profile' && (
            <UserProfile user={user} setActiveTab={setActiveTab} />
          )}

          {/* --- GRIEVANCES TAB --- */}
          {activeTab === 'Grievances' && (
            <Grievances user={user} setShowAuthModal={setShowAuthModal} />
          )}

          {/* --- SERVICE TAB --- */}
          {activeTab === 'Service' && (
            <Service />
          )}

          {/* --- HEALTHCARE TAB (NEW) --- */}
          {activeTab === 'HealthCare' && (
            <HealthCare />
          )}

          {/* --- OTHER TABS --- */}
          {activeTab === 'Detail' && <Detail />}
          {activeTab === 'Administration' && <Administration />} 

          {activeTab === 'Education' && (
          <Education />
          
          )}

          {activeTab === 'Sports' && <Sports />}
          
        </div>
      </main>

      {/* --- LOGIN MODAL --- */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      
    </div>
  );
}

export default App;