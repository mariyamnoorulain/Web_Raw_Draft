import { useContext } from 'react';
import AppContext from '../../Contexts/AppContext';

function Navbar() {
  const { isLoggedIn, logout, user, setShowLoginModal } = useContext(AppContext);
  
  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">
        <a className="navbar-brand text-white" href="#">Namal Nexus</a>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#directory">Alumni Directory</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#events">Events</a>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                More
              </a>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" href="#jobs">Jobs</a></li>
                <li><a className="dropdown-item" href="#contact">Contact</a></li>
              </ul>
            </li>
          </ul>
          <div className="ms-3">
            {isLoggedIn ? (
              <div className="d-flex align-items-center">
                <span className="text-white me-3">Welcome, {user?.name}</span>
                <button onClick={logout} className="btn btn-light btn-sm">Logout</button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="btn btn-light btn-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;