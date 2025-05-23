import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-5 py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="mb-3">Eventsphere</h5>
            <p className="text-muted">
              Discover and attend the best events across India. Find tech conferences,
              cultural festivals, workshops, and more!
            </p>
            <div className="d-flex mt-3">
              <a href="#" className="text-white me-3" aria-label="Facebook">
                <i className="bi bi-facebook fs-5"></i>
              </a>
              <a href="#" className="text-white me-3" aria-label="Twitter">
                <i className="bi bi-twitter-x fs-5"></i>
              </a>
              <a href="#" className="text-white me-3" aria-label="Instagram">
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a href="#" className="text-white" aria-label="LinkedIn">
                <i className="bi bi-linkedin fs-5"></i>
              </a>
            </div>
          </div>
          
          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-muted">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/events" className="text-decoration-none text-muted">Events</Link>
              </li>
              <li className="mb-2">
                <Link to="/student-login" className="text-decoration-none text-muted">Student Login</Link>
              </li>
              <li className="mb-2">
                <Link to="/college-login" className="text-decoration-none text-muted">Organizer Login</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-md-2 mb-4 mb-md-0">
            <h5 className="mb-3">Categories</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">Technology</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">Business</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">Education</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">Arts & Music</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-muted">Sports</a>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled text-muted">
              <li className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                123 College Street, Bangalore, India
              </li>
              <li className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                info@eventsphere.com
              </li>
              <li className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                +91 9876543210
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="my-4 bg-secondary" />
        
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0 text-muted">
              &copy; {currentYear} Eventsphere. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-decoration-none text-muted">Privacy Policy</a>
              </li>
              <li className="list-inline-item mx-3">
                <a href="#" className="text-decoration-none text-muted">Terms of Use</a>
              </li>
              <li className="list-inline-item">
                <a href="#" className="text-decoration-none text-muted">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
