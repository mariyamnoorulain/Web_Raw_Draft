function Notification({ notifications }) {
    if (!notifications || notifications.length === 0) {
      return null;
    }
  
    return (
      <div id="notification" className="toast-container position-fixed bottom-0 end-0 p-3">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`toast show align-items-center text-white bg-${notification.type}`}
            role="alert" 
            aria-live="assertive" 
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">
                {notification.message}
              </div>
              <button 
                type="button" 
                className="btn-close btn-close-white me-2 m-auto" 
                data-bs-dismiss="toast" 
                aria-label="Close"
              ></button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export default Notification;