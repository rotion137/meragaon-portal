import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';
import HeroSlider from './components/HeroSlider';
import AuthModal from './components/AuthModal'; 
import Detail from './components/Detail'; 
import { supabase } from './supabaseClient'; 
import './App.css'; // Ensure this is imported

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
      <TopBar onProfileClick={() => setShowAuthModal(true)} user={user} />
      
      {/* Sidebar gets the same props to control navigation */}
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <div className="content-container">
          
          {activeTab === 'Home' && (
            <div className="home-card">
              <HeroSlider />
              <div className="home-text">
                <h2>Welcome to KarmhaGaon</h2>
                <p>{user ? `Hello, ${user.email}!` : "Please sign in to access services."}</p>
              </div>
            </div>
          )}

          {activeTab === 'Detail' && <Detail />}
          
        </div>
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

export default App;