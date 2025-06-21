function About() {
    return (
      <section id="about" className="container py-5">
        <h2 className="text-center mb-4">About Us</h2>
        <p className="text-center">
          Connecting Namal graduates worldwide to build a strong and supportive alumni community.
        </p>
  
        <div className="row mt-4">
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Our Mission</h5>
                <p className="card-text">
                  To foster a vibrant community that connects alumni and supports their
                  professional growth and development.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Our Vision</h5>
                <p className="card-text">
                  To create a global network of Namal alumni who collaborate, innovate, and
                  give back to their alma mater.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Our Values</h5>
                <p className="card-text">
                  Excellence, integrity, collaboration, innovation, and service to community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default About;