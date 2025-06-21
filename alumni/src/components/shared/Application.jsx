import { useState, useContext } from 'react';
import AppContext from '../../Contexts/AppContext';

function ApplicationForm({ job, onClose }) {
  const { addNotification } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null
  });
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    
    if (id === 'resume' && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [id]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    // Simulate form submission
    setTimeout(() => {
      addNotification(`Application submitted successfully for ${job.title}!`, 'success');
      onClose();
    }, 1000);
  };

  return (
    <div id="application-form" className="card mt-4 mb-4 p-4">
      <h3 className="mb-3">Job Application Form: {job.title}</h3>
      <h5 className="text-muted mb-4">{job.company} - {job.location}</h5>
      
      <form 
        className={`needs-validation ${validated ? 'was-validated' : ''}`}
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input 
            type="text" 
            className="form-control" 
            id="name" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
          <div className="invalid-feedback">Please enter your full name.</div>
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
          <div className="invalid-feedback">Please enter a valid email address.</div>
        </div>
        
        <div className="mb-3">
          <label htmlFor="resume" className="form-label">Upload Resume</label>
          <input 
            type="file" 
            className="form-control" 
            id="resume" 
            accept=".pdf,.doc,.docx"
            onChange={handleChange}
            required 
          />
          <div className="invalid-feedback">Please upload your resume.</div>
          <small className="form-text text-muted">Accepted formats: PDF, DOC, DOCX</small>
        </div>
        
        <div className="d-flex gap-2 mt-4">
          <button type="submit" className="btn btn-primary">Submit Application</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default ApplicationForm;