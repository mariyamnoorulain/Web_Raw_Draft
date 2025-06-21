import { useEffect, useState } from 'react';

function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-dark text-white text-center py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Namal Nexus</h5>
            <p>Connecting alumni worldwide</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="#about" className="text-white">About</a></li>
              <li><a href="#events" className="text-white">Events</a></li>
              <li><a href="#directory" className="text-white">Alumni Directory</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Connect With Us</h5>
            <div className="d-flex justify-content-center gap-3">
              <a href="#" className="text-white"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-white"><i className="bi bi-twitter"></i></a>
              <a href="#" className="text-white"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
        </div>
        <hr className="my-3" />
        <p>&copy; {currentYear} NamalNexus | Contact Us | Privacy Policy</p>
      </div>
    </footer>
  );
}

export default Footer;