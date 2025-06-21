import { useState, useEffect } from 'react';

// Sample events data - in a real application, this would come from an API
const eventsData = [
  {
    id: 1,
    title: 'Annual Alumni Reunion',
    date: '2025-06-15',
    location: 'Namal Campus, Mianwali',
    description: 'Join us for the annual alumni reunion event with networking, talks, and entertainment.',
    category: 'social'
  },
  {
    id: 2,
    title: 'Career Workshop',
    date: '2025-07-22',
    location: 'Virtual Event',
    description: 'Learn essential skills for career advancement from industry experts.',
    category: 'career'
  },
  {
    id: 3,
    title: 'Networking Mixer',
    date: '2025-08-10',
    location: 'Lahore',
    description: 'Connect with fellow alumni in a casual setting to build professional connections.',
    category: 'networking'
  },
  {
    id: 4,
    title: 'Tech Talk Series',
    date: '2025-09-05',
    location: 'Virtual Event',
    description: 'Join us for insightful discussions on emerging technologies and innovation.',
    category: 'career'
  }
];

function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEvents(eventsData);
      setLoading(false);
    }, 800);
  }, []);

  const handleFilterClick = (category) => {
    setFilter(category);
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.category === filter);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section id="events" className="container py-5">
      <h2 className="text-center mb-4">Upcoming Events</h2>
      
      <div className="text-center mb-4">
        <div className="btn-group" role="group">
          <button 
            type="button" 
            className={`btn btn-outline-primary ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterClick('all')}
          >
            All
          </button>
          <button 
            type="button" 
            className={`btn btn-outline-primary ${filter === 'networking' ? 'active' : ''}`}
            onClick={() => handleFilterClick('networking')}
          >
            Networking
          </button>
          <button 
            type="button" 
            className={`btn btn-outline-primary ${filter === 'career' ? 'active' : ''}`}
            onClick={() => handleFilterClick('career')}
          >
            Career
          </button>
          <button 
            type="button" 
            className={`btn btn-outline-primary ${filter === 'social' ? 'active' : ''}`}
            onClick={() => handleFilterClick('social')}
          >
            Social
          </button>
        </div>
      </div>

      {loading ? (
        <div id="eventsLoading" className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading events...</p>
        </div>
      ) : (
        <div id="eventsContainer" className="row">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div key={event.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {formatDate(event.date)}
                    </h6>
                    <p className="card-text">{event.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-primary">{event.category}</span>
                      <small className="text-muted">{event.location}</small>
                    </div>
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <button className="btn btn-sm btn-outline-primary w-100">RSVP</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No events found for this category.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Events;