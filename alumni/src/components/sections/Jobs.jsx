import { useState, useEffect } from 'react';
import { useContext } from 'react';
import AppContext from '../../Contexts/AppContext';
import ApplicationForm from '../shared/Application';

// Sample jobs data - in a real application, this would come from an API
const jobsData = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Solutions Inc.",
    location: "Lahore, Pakistan",
    description: "We are looking for an experienced software engineer with expertise in React, Node.js, and cloud technologies.",
    postedDate: "2025-05-10"
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Islamabad, Pakistan",
    description: "Join our team to work on cutting-edge machine learning projects and big data analytics.",
    postedDate: "2025-05-12"
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "Creative Solutions",
    location: "Karachi, Pakistan",
    description: "Looking for a talented designer to create user-centered designs for web and mobile applications.",
    postedDate: "2025-05-14"
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Innovate Pakistan",
    location: "Remote",
    description: "Lead product development for our SaaS platform serving educational institutions.",
    postedDate: "2025-05-15"
  }
];

function Jobs() {
  const { setShowJobModal, isLoggedIn, addNotification } = useContext(AppContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(jobsData);
      setLoading(false);
    }, 700);
  }, []);

  const handlePostJob = () => {
    if (!isLoggedIn) {
      addNotification('Please log in to post a job', 'warning');
      return;
    }
    setShowJobModal(true);
  };

  const handleApplyJob = (job) => {
    if (!isLoggedIn) {
      addNotification('Please log in to apply for jobs', 'warning');
      return;
    }
    setSelectedJob(job);
    setShowApplicationForm(true);
    // Scroll to form
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const daysSincePosted = (dateString) => {
    const postedDate = new Date(dateString);
    const today = new Date();
    const diffTime = today - postedDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <section id="jobs" className="container py-5">
      <h2 className="text-center mb-4">Job Opportunities</h2>

      <div className="mb-4">
        <button 
          className="btn btn-success" 
          id="postJobBtn"
          onClick={handlePostJob}
        >
          Post a Job
        </button>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading job opportunities...</p>
        </div>
      ) : (
        <div id="jobListings" className="row">
          {jobs.map(job => (
            <div key={job.id} className="col-md-6 mb-4">
              <div className="card job-card h-100">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">{job.company}</h6>
                  <div className="mb-3">
                    <span className="badge bg-secondary me-2">
                      <i className="bi bi-geo-alt me-1"></i>{job.location}
                    </span>
                    <span className="badge bg-info">
                      <i className="bi bi-clock me-1"></i>
                      {daysSincePosted(job.postedDate)} days ago
                    </span>
                  </div>
                  <p className="card-text">{job.description}</p>
                </div>
                <div className="card-footer bg-transparent d-flex justify-content-between align-items-center">
                  <small className="text-muted">Posted on {formatDate(job.postedDate)}</small>
                  <button 
                    className="btn btn-sm btn-primary" 
                    onClick={() => handleApplyJob(job)}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showApplicationForm && selectedJob && (
        <ApplicationForm 
          job={selectedJob} 
          onClose={() => setShowApplicationForm(false)} 
        />
      )}
    </section>
  );
}

export default Jobs;

