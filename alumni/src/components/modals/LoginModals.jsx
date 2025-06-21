import { useState, useContext } from 'react';
import AppContext from '../../Contexts/AppContext';

function LoginModal({ show, onHide }) {
  const { login, addNotification } = useContext(AppContext);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [id.replace('login', '').toLowerCase()]: value
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

    setLoginError('');
    setValidated(true);

    // Sample login logic - in a real app, this would call an API
    if (loginData.email === 'demo@example.com' && loginData.password === 'password') {
      login({
        name: 'Demo User',
        email: loginData.email
      });
      resetForm();
    } else {
      setLoginError('Invalid email or password. Try demo@example.com / password');
      addNotification('Login failed. Please check your credentials.', 'danger');
    }
  };

  const resetForm = () => {
    setLoginData({
      email: '',
      password: ''
    });
    setLoginError('');
    setValidated(false);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  return (
    <div 
      className={`modal fade ${show ? 'show' : ''}`} 
      id="loginModal" 
      tabIndex="-1" 
      style={{ display: show ? 'block' : 'none' }}
      aria-labelledby="loginModalLabel" 
      aria-hidden={!show}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="loginModalLabel">Login</h5>
            <button 
              type="button" 
              className="btn-close" 
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <form 
              id="loginForm" 
              className={`needs-validation ${validated ? 'was-validated' : ''}`} 
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label">Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  id="loginEmail" 
                  value={loginData.email}
                  onChange={handleChange}
                  required 
                />
                <div className="invalid-feedback">Please enter a valid email.</div>
              </div>
              <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  id="loginPassword" 
                  value={loginData.password}
                  onChange={handleChange}
                  required 
                />
                <div className="invalid-feedback">Password is required.</div>
              </div>
              
              {loginError && (
                <div id="loginError" className="alert alert-danger">
                  {loginError}
                </div>
              )}
              
              <button type="submit" className="btn btn-primary">Login</button>
            </form>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default LoginModal;
