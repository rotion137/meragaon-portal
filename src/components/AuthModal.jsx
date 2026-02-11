import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { X, Mail, Lock } from 'lucide-react'; // Icons
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login/Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(error.message);
    else {
      setMessage('Logged in successfully!');
      setTimeout(onClose, 1000); // Close modal after 1s
    }
    setLoading(false);
  };

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(error.message);
    else setMessage('Check your email for the confirmation link!');
    setLoading(false);
  };

  // Handle Google Login (Requires Google Cloud Setup)
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setMessage(error.message);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        
        {/* Header */}
        <div className="modal-header">
          <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
          <p>to continue to KarmhaGaon</p>
        </div>

        {/* Form */}
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <p className="error-msg">{message}</p>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div className="divider"><span>or</span></div>

        {/* Google Button */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="G" className="google-icon" />
          <span>Continue with Google</span>
        </button>

        {/* Toggle Link */}
        <div className="toggle-text">
          {isLogin ? "No account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? ' Create one' : ' Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;