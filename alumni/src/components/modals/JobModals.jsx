import { useState, useContext } from 'react';
import AppContext from '../../Contexts/AppContext';

function JobModal({ show, onHide }) {
  const { addNotification } = useContext(AppContext);
  const [jobData, setJobData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobDescription: ''
  });
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setJobData(prev => ({
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

    setValidated(true);

    // In a real application, this would send the data to an API
    addNotification('Your job has been posted successfully!', 'success');
    resetForm();
    onHide();
  };

  const resetForm = () => {
    setJobData({
      jobTitle: '',
      company: '',
      location: '',
      jobDescription: ''
    });
    setValidated(false);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <div 
      className={`modal fade ${show ? 'show' : ''}`} 
      id="jobModal" 
      tabIndex="-1"
      style={{ display: show ? 'block' : 'none' }}
      aria-labelledby="jobModalLabel" 
      aria-hidden={!show}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="jobModalLabel">Post a Job Opportunity</h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <form 
              id="jobForm" 
              className={`needs-validation ${validated ? 'was-validated' : ''}`}
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <label htmlFor="jobTitle" className="form-label">Job Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="jobTitle" 
                  value={jobData.jobTitle}
                  onChange={handleChange}
                  required 
                />
                <div className="invalid-feedback">Please enter a job title.</div>
              </div>
              <div className="mb-3">
                <label htmlFor="company" className="form-label">Company</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="company" 
                  value={jobData.company}
                  onChange={handleChange}
                  required 
                />
                <div className="invalid-feedback">Please enter a company name.</div>
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="location" 
                  value={jobData.location}
                  onChange={handleChange}
                  required 
                />
                <div className="invalid-feedback">Please enter a location.</div>
              </div>
              <div className="mb-3">
                <label htmlFor="jobDescription" className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  id="jobDescription" 
                  rows="3" 
                  value={jobData.jobDescription}
                  onChange={handleChange}
                  required
                ></textarea>
                <div className="invalid-feedback">Please provide a job description.</div>
              </div>
              <button type="submit" className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default JobModal;