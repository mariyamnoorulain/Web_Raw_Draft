import { useState, useContext } from 'react';
import AppContext from '../../Contexts/AppContext';

function Contact() {
  const { addNotification } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Reset states
    setFormSuccess(false);
    setFormError(false);
    setValidated(true);

    // Simulate form submission
    setTimeout(() => {
      try {
        // Success case
        setFormSuccess(true);
        addNotification('Your message has been sent successfully!', 'success');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setValidated(false);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setFormSuccess(false);
        }, 5000);
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        // Error case
        setFormError(true);
        addNotification('An error occurred. Please try again.', 'danger');
      }
    }, 1000);
  };

  return (
    <section id="contact" className="container py-5">
      <h2 className="text-center mb-4">Get in Touch</h2>
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <form 
            id="contactForm" 
            className={`needs-validation ${validated ? 'was-validated' : ''}`}
            noValidate
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input 
                type="text" 
                className="form-control" 
                id="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <div className="invalid-feedback">Please enter your name.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
              <div className="invalid-feedback">Please enter a valid email.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="subject" className="form-label">Subject</label>
              <select 
                className="form-select" 
                id="subject" 
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="">Choose a subject...</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Alumni Registration">Alumni Registration</option>
                <option value="Event Information">Event Information</option>
                <option value="Job Opportunities">Job Opportunities</option>
                <option value="Other">Other</option>
              </select>
              <div className="invalid-feedback">Please select a subject.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea 
                className="form-control" 
                id="message" 
                rows="4" 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
              <div className="invalid-feedback">Message cannot be empty.</div>
            </div>
            
            {formSuccess && (
              <div id="formSuccess" className="alert alert-success">
                Thank you! Your message has been sent successfully.
              </div>
            )}
            
            {formError && (
              <div id="formError" className="alert alert-danger">
                An error occurred. Please try again.
              </div>
            )}
            
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;