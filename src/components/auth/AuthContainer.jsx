import { useState } from 'react';
import { motion } from 'framer-motion';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';

const AuthContainer = ({ onAuthenticated }) => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'forgot'

  const handleLogin = (credentials) => {
    // Mock authentication - in real app, call your API
    console.log('Login attempt:', credentials);
    
    // Simulate successful login
    const user = {
      id: '1',
      identifier: credentials.identifier,
      houseNumber: credentials.identifier.includes('@') ? 'H001' : credentials.identifier,
      username: credentials.identifier.includes('@') ? 'user1' : credentials.identifier,
      email: credentials.identifier.includes('@') ? credentials.identifier : 'user@example.com'
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('flux_user', JSON.stringify(user));
    localStorage.setItem('flux_authenticated', 'true');
    
    onAuthenticated(user);
  };

  const handleSignup = (userData) => {
    // Mock signup - in real app, call your API
    console.log('Signup attempt:', userData);
    
    // Simulate successful signup
    const user = {
      id: Date.now().toString(),
      houseNumber: userData.houseNumber,
      username: userData.username,
      email: userData.email
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('flux_user', JSON.stringify(user));
    localStorage.setItem('flux_authenticated', 'true');
    
    onAuthenticated(user);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'signup':
        return (
          <Signup
            onSwitchToLogin={() => setCurrentView('login')}
            onSignup={handleSignup}
          />
        );
      case 'forgot':
        return (
          <ForgotPassword
            onSwitchToLogin={() => setCurrentView('login')}
          />
        );
      default:
        return (
          <Login
            onSwitchToSignup={() => setCurrentView('signup')}
            onSwitchToForgot={() => setCurrentView('forgot')}
            onLogin={handleLogin}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* PowerHive Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
            Flux SOS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Intelligent Energy Management
          </p>
        </motion.div>

        {/* Auth Forms */}
        <motion.div
          key={currentView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderCurrentView()}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthContainer;