import { useContext } from 'react';
import AppContext from '../../Contexts/AppContext';

function Hero() {
  const { setShowLoginModal, isLoggedIn } = useContext(AppContext);
  
  const handleJoinNow = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      // Scroll to directory section for already logged in users
      document.querySelector('#directory').scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="hero text-center">
      <div className="hero-content">
        <h1>Stay Connected, Stay Inspired.</h1>
        <p className="lead">Join the Namal alumni community today</p>
        <button 
          id="joinNowBtn" 
          className="btn btn-success btn-lg mt-3"
          onClick={handleJoinNow}
        >
          Join Now
        </button>
      </div>
    </header>
  );
}

export default Hero;