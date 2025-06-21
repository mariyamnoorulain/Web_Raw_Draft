import { useState } from 'react'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Events from './components/sections/Event'
import Directory from './components/sections/Directory'
import Jobs from './components/sections/Jobs'
import Contact from './components/sections/Contact'
import Notification from './components/shared/Notification'
import LoginModal from './components/modals/LoginModals'
import JobModal from './components/modals/JobModals'
import AppContext from './Contexts/AppContext'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  
  // Add a notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 5000);
  };

  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    addNotification(`Welcome back, ${userData.name}!`, 'success');
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    addNotification('You have been logged out', 'info');
  };

  return (
    <AppContext.Provider value={{ 
      isLoggedIn, 
      user, 
      login, 
      logout, 
      addNotification,
      setShowLoginModal,
      setShowJobModal
    }}>
      <div className="app">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Events />
          <Directory />
          <Jobs />
          <Contact />
        </main>
        <Footer />
        
        <LoginModal show={showLoginModal} onHide={() => setShowLoginModal(false)} />
        <JobModal show={showJobModal} onHide={() => setShowJobModal(false)} />
        
        <Notification notifications={notifications} />
      </div>
    </AppContext.Provider>
  )
}

export default App