import { useContext } from 'react';
import AppContext from '../../Contexts/AppContext';

function Directory() {
  const alumniList = [
    { id: 1, name: 'Ali Khan', batch: '2015', role: 'Software Engineer at Google' },
    { id: 2, name: 'Fatima Zahra', batch: '2017', role: 'Data Scientist at IBM' },
    { id: 3, name: 'Ahmed Raza', batch: '2016', role: 'Product Manager at Microsoft' },
    { id: 4, name: 'Sara Malik', batch: '2018', role: 'UI/UX Designer at Amazon' },
  ];

  const { isLoggedIn, setShowLoginModal } = useContext(AppContext);

  const handleViewProfile = (alumni) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      alert(`Viewing profile of ${alumni.name}`);
    }
  };

  return (
    <section id="directory" className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">Alumni Directory</h2>
        <div className="row">
          {alumniList.map(alumni => (
            <div key={alumni.id} className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{alumni.name}</h5>
                  <p className="card-text">
                    <strong>Batch:</strong> {alumni.batch}<br />
                    <strong>Role:</strong> {alumni.role}
                  </p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleViewProfile(alumni)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Directory;
