"use client"
import React, { useState } from 'react';

const Dashboard = () => {
  const [activeButton, setActiveButton] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [startTour, setStartTour] = useState(false);
  const [currentTourLocation, setCurrentTourLocation] = useState('sanctuary');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    purpose: '',
    minister: '',
    event: ''
  });
  const [appointments, setAppointments] = useState<any[]>([]);
  
  // Catholic Church event data - Sacraments and liturgical events
  const events = [
    { id: 1, title: 'Sunday Mass', date: 'Sept 15, 2024', time: '10:00 AM', location: 'Main Sanctuary', description: 'Join us for our weekly Eucharistic celebration. All are welcome to receive Holy Communion.' },
    { id: 2, title: 'Baptism', date: 'Sept 17, 2024', time: '2:00 PM', location: 'Baptismal Font', description: 'Baptism ceremony for new members of our Catholic community.' },
    { id: 3, title: 'Confession', date: 'Sept 20, 2024', time: '4:00 PM', location: 'Confessionals', description: 'Sacrament of Reconciliation available with our priests.' },
    { id: 4, title: 'First Communion Preparation', date: 'Sept 22, 2024', time: '3:00 PM', location: 'Chapel', description: 'Preparation classes for children receiving First Holy Communion.' },
    { id: 5, title: 'Confirmation', date: 'Sept 25, 2024', time: '6:00 PM', location: 'Main Sanctuary', description: 'Sacrament of Confirmation ceremony for youth.' },
    { id: 6, title: 'Wedding', date: 'Sept 28, 2024', time: '2:00 PM', location: 'Main Sanctuary', description: 'Holy Matrimony ceremony.' },
    { id: 7, title: 'Anointing of the Sick', date: 'Oct 1, 2024', time: '11:00 AM', location: 'Chapel', description: 'Sacrament for those who are ill or suffering.' },
    { id: 8, title: 'Holy Hour', date: 'Oct 3, 2024', time: '7:00 PM', location: 'Main Sanctuary', description: 'Eucharistic Adoration and prayer before the Blessed Sacrament.' },
  ];
  
  // Filter events to only show those in church locations
  const churchLocations = ['Main Sanctuary', 'Chapel', 'Baptismal Font', 'Confessionals'];
  const churchEvents = events.filter(event => churchLocations.includes(event.location));
  
  // Church ministries
  const ministries = [
    { id: 1, title: 'Liturgy Ministry', leader: 'Bro. Michael Santos', time: 'Sundays 8:30 AM', description: 'Serve during Mass as lectors, Eucharistic ministers, and altar servers' },
    { id: 2, title: 'Youth Ministry', leader: 'Sis. Sarah Lim', time: 'Fridays 7:00 PM', description: 'For young people ages 13-18 to grow in faith' },
    { id: 3, title: 'Children\'s Catechism', leader: 'Bro. James Reyes', time: 'Sundays 9:30 AM', description: 'Religious education for children' },
    { id: 4, title: 'Social Outreach', leader: 'Bro. Carlo Cruz', time: 'Saturdays 9:00 AM', description: 'Community service and helping those in need' },
  ];

  // Catholic clergy available for appointments
  const ministers = [
    { id: 1, name: 'Fr. Benjamin Cruz', role: 'Parish Priest' },
    { id: 2, name: 'Fr. Michael Lim', role: 'Associate Pastor' },
    { id: 3, name: 'Deacon John Santos', role: 'Permanent Deacon' },
    { id: 4, name: 'Sr. Maria Theresa', role: 'Pastoral Associate' }
  ];

  // Tour locations with descriptions
  const tourLocations = {
    'sanctuary': {
      name: 'Main Sanctuary',
      description: 'The heart of our church where Mass is celebrated. Features the altar, tabernacle, and beautiful stained glass windows depicting scenes from the Bible and lives of saints.'
    },
    'chapel': {
      name: 'Blessed Sacrament Chapel',
      description: 'A smaller, intimate space for Eucharistic Adoration and private prayer. The Blessed Sacrament is exposed for worship throughout the day.'
    },
    'baptismal': {
      name: 'Baptismal Font',
      description: 'Where the Sacrament of Baptism is administered. The font is carved from marble and features flowing water symbolizing new life in Christ.'
    },
    'confessionals': {
      name: 'Confessionals',
      description: 'Where the Sacrament of Reconciliation is celebrated. Private rooms for confessing sins and receiving God\'s forgiveness through the priest.'
    },
    'garden': {
      name: 'Mary\'s Garden',
      description: 'A peaceful outdoor space dedicated to the Blessed Virgin Mary, featuring a statue of Our Lady and stations of the cross for meditation and prayer.'
    }
  };

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event);
  };

  const handleCloseDetails = () => {
    setSelectedEvent(null);
  };

  const handleStartTour = () => {
    setStartTour(true);
    setCurrentTourLocation('sanctuary');
  };

  const handleEndTour = () => {
    setStartTour(false);
  };

  const handleNavigateTour = (location: string) => {
    setCurrentTourLocation(location);
  };

  const handleOpenAppointmentModal = (event: any = null) => {
    setShowAppointmentModal(true);
    if (event) {
      setAppointmentForm(prev => ({
        ...prev,
        purpose: `Appointment regarding ${event.title}`,
        event: event.title
      }));
    }
  };

  const handleCloseAppointmentModal = () => {
    setShowAppointmentModal(false);
    // Reset form
    setAppointmentForm({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      purpose: '',
      minister: '',
      event: ''
    });
  };

  const handleAppointmentFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAppointmentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now(),
      ...appointmentForm,
      status: 'Pending',
      createdAt: new Date().toLocaleDateString()
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    handleCloseAppointmentModal();
    alert('Appointment request submitted successfully! We will contact you to confirm.');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="church-title">
            <h1>Immaculate Conception Catholic Church</h1>
            <p>Serving the faithful since 1925</p>
          </div>
          <div className="user-profile">
            <span>Welcome, Parishioner</span>
            <div className="avatar">✝</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Navigation Panel */}
        <nav className="nav-panel">
          <div className="nav-header">
            <div className="church-logo">⛪</div>
            <h3>Parish Portal</h3>
          </div>
          <div className="nav-buttons">
            <button 
              className={`nav-btn ${activeButton === 'home' ? 'active' : ''}`}
              onClick={() => setActiveButton('home')}
            >
              <span className="icon">🏠</span>
              <span>Home</span>
            </button>
            
            <button 
              className={`nav-btn ${activeButton === 'events' ? 'active' : ''}`}
              onClick={() => setActiveButton('events')}
            >
              <span className="icon">📅</span>
              <span>Liturgical Events</span>
            </button>
            
            <button 
              className={`nav-btn ${activeButton === 'ministries' ? 'active' : ''}`}
              onClick={() => setActiveButton('ministries')}
            >
              <span className="icon">👥</span>
              <span>Ministries</span>
            </button>
            
            <button 
              className={`nav-btn ${activeButton === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveButton('appointments')}
            >
              <span className="icon">📋</span>
              <span>Sacrament Appointments</span>
            </button>
            
            <button 
              className={`nav-btn ${activeButton === 'about' ? 'active' : ''}`}
              onClick={() => setActiveButton('about')}
            >
              <span className="icon">ℹ️</span>
              <span>About Our Parish</span>
            </button>
            
            <button 
              className={`nav-btn ${activeButton === 'tour' ? 'active' : ''}`}
              onClick={() => setActiveButton('tour')}
            >
              <span className="icon">⛪</span>
              <span>Church Tour</span>
            </button>
          </div>
          <div className="nav-footer">
            <div className="bible-verse">
              "For where two or three gather in my name, there am I with them." - Matthew 18:20
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <main className="main-content">
          {activeButton === 'home' && (
            <div className="content-section">
              <div className="welcome-banner">
                <h2>Welcome to Immaculate Conception Catholic Church</h2>
                <p>"A community of faith, worship, and service in the Catholic tradition"</p>
              </div>
              
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <h3>Upcoming Masses & Sacraments</h3>
                    <span className="stat-number">{churchEvents.length}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Active Ministries</h3>
                    <span className="stat-number">{ministries.length}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-info">
                    <h3>Parish Families</h3>
                    <span className="stat-number">427</span>
                  </div>
                </div>
              </div>
              
              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn" onClick={() => setActiveButton('events')}>
                    <span className="btn-icon">📅</span>
                    View Mass Times
                  </button>
                  <button className="action-btn" onClick={() => setActiveButton('ministries')}>
                    <span className="btn-icon">👥</span>
                    Join a Ministry
                  </button>
                  <button className="action-btn" onClick={() => setActiveButton('appointments')}>
                    <span className="btn-icon">📋</span>
                    Request Sacrament
                  </button>
                  <button className="action-btn" onClick={() => setActiveButton('tour')}>
                    <span className="btn-icon">⛪</span>
                    Church Tour
                  </button>
                </div>
              </div>

              <div className="featured-events">
                <h3>Featured Events This Week</h3>
                <div className="events-preview">
                  {churchEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="event-preview-card">
                      <div className="event-date-badge">
                        <span className="event-day">{event.date.split(' ')[1].replace(',', '')}</span>
                        <span className="event-month">{event.date.split(' ')[0]}</span>
                      </div>
                      <div className="event-preview-info">
                        <h4>{event.title}</h4>
                        <p>{event.time} • {event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="verse-of-day">
                <div className="verse-header">
                  <h3>Verse of the Day</h3>
                  <span className="verse-date">September 5, 2024</span>
                </div>
                <blockquote>
                  "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God."
                  <footer>- Ephesians 2:8</footer>
                </blockquote>
              </div>
            </div>
          )}

          {activeButton === 'events' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Catholic Liturgical Events & Sacraments</h2>
                <p>Holy Mass and Sacraments celebrated in our church</p>
              </div>
              <div className="events-list">
                {churchEvents.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-date-side">
                      <div className="event-date-badge">
                        <span className="event-day">{event.date.split(' ')[1].replace(',', '')}</span>
                        <span className="event-month">{event.date.split(' ')[0]}</span>
                      </div>
                    </div>
                    <div className="event-content">
                      <div className="event-header">
                        <h3>{event.title}</h3>
                        <span className="event-time">{event.time}</span>
                      </div>
                      <p className="event-location">📍 {event.location}</p>
                      <p className="event-description">{event.description}</p>
                      <div className="event-actions">
                        <button 
                          className="action-btn outline" 
                          onClick={() => handleViewDetails(event)}
                        >
                          More Details
                        </button>
                        {(event.title.includes('Baptism') || event.title.includes('Confession') || 
                          event.title.includes('Communion') || event.title.includes('Confirmation') ||
                          event.title.includes('Wedding') || event.title.includes('Anointing')) && (
                          <button 
                            className="action-btn primary" 
                            onClick={() => handleOpenAppointmentModal(event)}
                          >
                            Schedule Sacrament
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedEvent && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h3>{selectedEvent.title}</h3>
                      <button className="close-btn" onClick={handleCloseDetails}>✕</button>
                    </div>
                    <div className="modal-body">
                      <div className="event-detail-item">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{selectedEvent.date}</span>
                      </div>
                      <div className="event-detail-item">
                        <span className="detail-label">Time:</span>
                        <span className="detail-value">{selectedEvent.time}</span>
                      </div>
                      <div className="event-detail-item">
                        <span className="detail-label">Location:</span>
                        <span className="detail-value">{selectedEvent.location}</span>
                      </div>
                      <div className="event-detail-item">
                        <span className="detail-label">Description:</span>
                        <p className="detail-value">{selectedEvent.description}</p>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="action-btn outline">Add to Calendar</button>
                      {(selectedEvent.title.includes('Baptism') || selectedEvent.title.includes('Confession') || 
                        selectedEvent.title.includes('Communion') || selectedEvent.title.includes('Confirmation') ||
                        selectedEvent.title.includes('Wedding') || selectedEvent.title.includes('Anointing')) && (
                        <button className="action-btn primary" onClick={() => handleOpenAppointmentModal(selectedEvent)}>
                          Schedule This Sacrament
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeButton === 'ministries' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Church Ministries</h2>
                <p>Get involved in our parish community by joining one of our ministries.</p>
              </div>
              
              <div className="ministries-grid">
                {ministries.map(ministry => (
                  <div key={ministry.id} className="ministry-card">
                    <div className="ministry-icon">⛪</div>
                    <h3>{ministry.title}</h3>
                    <div className="ministry-leader">
                      <span className="label">Leader:</span>
                      <span>{ministry.leader}</span>
                    </div>
                    <div className="ministry-time">
                      <span className="label">Meeting Time:</span>
                      <span>{ministry.time}</span>
                    </div>
                    <p className="ministry-desc">{ministry.description}</p>
                    <button className="action-btn primary">Join Ministry</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeButton === 'appointments' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Sacrament Appointments</h2>
                <p>Request appointments for sacraments or meetings with our clergy.</p>
              </div>
              
              <div className="appointment-actions">
                <button className="action-btn large primary" onClick={handleOpenAppointmentModal}>
                  <span className="btn-icon">➕</span>
                  Request New Appointment
                </button>
              </div>
              
              {appointments.length > 0 ? (
                <div className="appointments-container">
                  <h3 className="appointments-title">Your Appointment Requests</h3>
                  <div className="appointments-grid">
                    {appointments.map(appointment => (
                      <div key={appointment.id} className="appointment-card">
                        <div className="appointment-card-header">
                          <div className="appointment-minister">
                            <span className="minister-icon">🙏</span>
                            <div>
                              <h4>{appointment.minister}</h4>
                              <span className="minister-role">
                                {ministers.find(m => m.name === appointment.minister)?.role}
                              </span>
                            </div>
                          </div>
                          <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                            {appointment.status}
                          </span>
                        </div>
                        
                        <div className="appointment-card-body">
                          <div className="appointment-detail">
                            <span className="detail-label">Sacrament:</span>
                            <span className="detail-value">{appointment.event}</span>
                          </div>
                          
                          <div className="appointment-detail">
                            <span className="detail-label">Date & Time:</span>
                            <span className="detail-value">{appointment.date} at {appointment.time}</span>
                          </div>
                          
                          <div className="appointment-detail">
                            <span className="detail-label">Purpose:</span>
                            <span className="detail-value">{appointment.purpose}</span>
                          </div>
                          
                          <div className="appointment-detail">
                            <span className="detail-label">Requested:</span>
                            <span className="detail-value">{appointment.createdAt}</span>
                          </div>
                        </div>
                        
                        <div className="appointment-card-footer">
                          <button className="action-btn small outline">View Details</button>
                          <button className="action-btn small primary">Reschedule</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No Appointments Yet</h3>
                  <p>You haven't scheduled any sacrament appointments yet. Click the button above to request one.</p>
                </div>
              )}
            </div>
          )}

          {activeButton === 'about' && (
            <div className="content-section">
              <div className="section-header">
                <h2>About Our Parish</h2>
                <p>Immaculate Conception Catholic Church has been serving the faithful since 1925.</p>
              </div>
              
              <div className="about-content">
                <div className="about-section">
                  <h3>Our History</h3>
                  <p>Founded by the Dominican order, our parish has been a cornerstone of Catholic faith in this community for nearly a century. We continue the rich tradition of Catholic worship and education.</p>
                </div>
                
                <div className="about-section">
                  <h3>Pastoral Team</h3>
                  <div className="team-grid">
                    <div className="team-member-card">
                      <div className="member-photo">🙏</div>
                      <h4>Fr. Benjamin Cruz</h4>
                      <p>Parish Priest</p>
                    </div>
                    <div className="team-member-card">
                      <div className="member-photo">🙏</div>
                      <h4>Fr. Michael Lim</h4>
                      <p>Associate Pastor</p>
                    </div>
                    <div className="team-member-card">
                      <div className="member-photo">🙏</div>
                      <h4>Deacon John Santos</h4>
                      <p>Permanent Deacon</p>
                    </div>
                    <div className="team-member-card">
                      <div className="member-photo">🙏</div>
                      <h4>Sr. Maria Theresa</h4>
                      <p>Pastoral Associate</p>
                    </div>
                  </div>
                </div>
                
                <div className="about-section">
                  <h3>Service Times</h3>
                  <div className="service-times-grid">
                    <div className="service-time-card">
                      <h4>Sunday Mass</h4>
                      <p>7:30 AM, 9:00 AM, 11:00 AM, 5:00 PM</p>
                    </div>
                    <div className="service-time-card">
                      <h4>Weekday Mass</h4>
                      <p>6:30 AM, 8:00 AM</p>
                    </div>
                    <div className="service-time-card">
                      <h4>Saturday Vigil</h4>
                      <p>4:00 PM</p>
                    </div>
                    <div className="service-time-card">
                      <h4>Confession</h4>
                      <p>Saturday 3:00-3:45 PM or by appointment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeButton === 'tour' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Church Virtual Tour</h2>
                <p>Explore our sacred spaces from anywhere</p>
              </div>
              
              {!startTour ? (
                <div className="tour-intro">
                  <div className="tour-placeholder-image">
                    <div className="church-image">⛪</div>
                  </div>
                  <p>Take a virtual tour of our sacred spaces. Learn about the different areas of our church used for worship and sacraments.</p>
                  <button className="action-btn large primary" onClick={handleStartTour}>
                    Start Virtual Tour
                  </button>
                </div>
              ) : (
                <div className="virtual-tour">
                  <div className="tour-view">
                    <h3>{tourLocations[currentTourLocation as keyof typeof tourLocations]?.name}</h3>
                    <div className="tour-placeholder">
                      <div className="location-image">
                        {currentTourLocation === 'sanctuary' && '⛪'}
                        {currentTourLocation === 'chapel' && '🙏'}
                        {currentTourLocation === 'baptismal' && '💧'}
                        {currentTourLocation === 'confessionals' && '✝️'}
                        {currentTourLocation === 'garden' && '🌿'}
                      </div>
                      <p>{tourLocations[currentTourLocation as keyof typeof tourLocations]?.description}</p>
                    </div>
                    <button className="action-btn outline" onClick={handleEndTour}>
                      End Tour
                    </button>
                  </div>
                  <div className="tour-controls">
                    <button 
                      className={`control-btn ${currentTourLocation === 'sanctuary' ? 'active' : ''}`}
                      onClick={() => handleNavigateTour('sanctuary')}
                    >
                      Sanctuary
                    </button>
                    <button 
                      className={`control-btn ${currentTourLocation === 'chapel' ? 'active' : ''}`}
                      onClick={() => handleNavigateTour('chapel')}
                    >
                      Chapel
                    </button>
                    <button 
                      className={`control-btn ${currentTourLocation === 'baptismal' ? 'active' : ''}`}
                      onClick={() => handleNavigateTour('baptismal')}
                    >
                      Baptismal Font
                    </button>
                    <button 
                      className={`control-btn ${currentTourLocation === 'confessionals' ? 'active' : ''}`}
                      onClick={() => handleNavigateTour('confessionals')}
                    >
                      Confessionals
                    </button>
                    <button 
                      className={`control-btn ${currentTourLocation === 'garden' ? 'active' : ''}`}
                      onClick={() => handleNavigateTour('garden')}
                    >
                      Mary's Garden
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Schedule Sacrament Appointment</h3>
              <button className="close-btn" onClick={handleCloseAppointmentModal}>✕</button>
            </div>
            <form onSubmit={handleSubmitAppointment} className="appointment-form">
              <div className="form-section">
                <h4>Personal Information</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={appointmentForm.name}
                      onChange={handleAppointmentFormChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={appointmentForm.email}
                      onChange={handleAppointmentFormChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={appointmentForm.phone}
                      onChange={handleAppointmentFormChange}
                      required
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h4>Appointment Details</h4>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="event">Sacrament or Event *</label>
                    <select
                      id="event"
                      name="event"
                      value={appointmentForm.event}
                      onChange={handleAppointmentFormChange}
                      required
                    >
                      <option value="">Select a sacrament</option>
                      <option value="Baptism">Baptism</option>
                      <option value="Confession">Confession</option>
                      <option value="First Communion">First Communion</option>
                      <option value="Confirmation">Confirmation</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Anointing of the Sick">Anointing of the Sick</option>
                      <option value="General Appointment">General Appointment</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="minister">Preferred Clergy *</label>
                    <select
                      id="minister"
                      name="minister"
                      value={appointmentForm.minister}
                      onChange={handleAppointmentFormChange}
                      required
                    >
                      <option value="">Select a clergy member</option>
                      {ministers.map(minister => (
                        <option key={minister.id} value={minister.name}>
                          {minister.name} ({minister.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Preferred Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={appointmentForm.date}
                      onChange={handleAppointmentFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="time">Preferred Time *</label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={appointmentForm.time}
                      onChange={handleAppointmentFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="purpose">Purpose of Appointment *</label>
                  <textarea
                    id="purpose"
                    name="purpose"
                    value={appointmentForm.purpose}
                    onChange={handleAppointmentFormChange}
                    rows={4}
                    required
                    placeholder="Please provide details about the sacrament you're requesting or the reason for your appointment"
                  ></textarea>
                </div>
              </div>
              
              <div className="form-footer">
                <p className="form-note">* Required fields. We will contact you within 24-48 hours to confirm your appointment.</p>
                <div className="modal-footer">
                  <button type="button" className="action-btn outline" onClick={handleCloseAppointmentModal}>
                    Cancel
                  </button>
                  <button type="submit" className="action-btn primary">
                    Submit Request
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8f6f0 0%, #f1ece0 100%);
          font-family: 'Georgia', serif;
          color: #333;
        }
        
        .dashboard-header {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6b8a 100%);
          color: white;
          padding: 1.5rem 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-bottom: 4px solid #8b5a2b;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .church-title h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .church-title p {
          margin: 0.25rem 0 0 0;
          font-style: italic;
          opacity: 0.9;
        }
        
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5a2b 0%, #c19a6b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.2rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }
        
        .dashboard-content {
          display: flex;
          min-height: calc(100vh - 80px);
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .nav-panel {
          width: 280px;
          background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
          color: white;
          padding: 1.5rem 0;
          box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
        }
        
        .nav-header {
          padding: 0 1.5rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
        }
        
        .church-logo {
          font-size: 3rem;
          margin-bottom: 0.5rem;
        }
        
        .nav-header h3 {
          margin: 0;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        
        .nav-buttons {
          flex: 1;
          padding: 1.5rem 0;
        }
        
        .nav-btn {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 1rem 1.5rem;
          border: none;
          background: none;
          cursor: pointer;
          transition: all 0.3s ease;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          border-left: 4px solid transparent;
        }
        
        .nav-btn:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: white;
        }
        
        .nav-btn.active {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          border-left-color: #c19a6b;
        }
        
        .icon {
          margin-right: 12px;
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
        }
        
        .nav-footer {
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .bible-verse {
          font-style: italic;
          font-size: 0.9rem;
          text-align: center;
          opacity: 0.8;
          line-height: 1.4;
        }
        
        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
          background-color: #faf9f7;
        }
        
        .content-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          border: 1px solid #e8e5dd;
        }
        
        
        
        .-banner {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f8f6f0 0%, #e8e5dd 100%);
          border-radius: 10px;
          margin-bottom: 2rem;
          border: 1px solid #e0dccf;
        }
        
        .welcome-banner h2 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }
        
        .welcome-banner p {
          color: #5d6d7e;
          font-style: italic;
          font-size: 1.1rem;
        }
        
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: linear-gradient(135deg, #4a6b8a 0%, #2c3e50 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
        }
        
        .stat-icon {
          font-size: 2.5rem;
          background: rgba(255, 255, 255, 0.1);
          width: 70px;
          height: 70px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .stat-info h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 500;
          opacity: 0.9;
        }
        
        .stat-number {
          font-size: 2.2rem;
          font-weight: 700;
          display: block;
        }
        
        .quick-actions {
          margin: 2.5rem 0;
          padding: 1.5rem;
          background: #f8f6f0;
          border-radius: 10px;
          border: 1px solid #e8e5dd;
        }
        
        .quick-actions h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          text-align: center;
        }
        
        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #8b5a2b 0%, #c19a6b 100%);
          color: white;
          border: none;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(139, 90, 43, 0.3);
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 90, 43, 0.4);
        }
        
        .action-btn.primary {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6b8a 100%);
          box-shadow: 0 2px 8px rgba(44, 62, 80, 0.3);
        }
        
        .action-btn.primary:hover {
          box-shadow: 0 4px 12px rgba(44, 62, 80, 0.4);
        }
        
        .action-btn.outline {
          background: transparent;
          color: #4a6b8a;
          border: 2px solid #4a6b8a;
          box-shadow: none;
        }
        
        .action-btn.outline:hover {
          background: #4a6b8a;
          color: white;
        }
        
        .action-btn.large {
          padding: 1.2rem 2rem;
          font-size: 1.1rem;
        }
        
        .action-btn.small {
          padding: 0.5rem 1rem;
          font-size: 0.9rem;
        }
        
        .featured-events {
          margin: 2.5rem 0;
        }
        
        .featured-events h3 {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e8e5dd;
        }
        
        .events-preview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        
        .event-preview-card {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          border: 1px solid #e8e5dd;
          transition: transform 0.3s ease;
        }
        
        .event-preview-card:hover {
          transform: translateY(-3px);
        }
        
        .event-date-badge {
          background: linear-gradient(135deg, #8b5a2b 0%, #c19a6b 100%);
          color: white;
          padding: 0.8rem;
          border-radius: 8px;
          text-align: center;
          min-width: 60px;
        }
        
        .event-day {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          line-height: 1;
        }
        
        .event-month {
          display: block;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .event-preview-info h4 {
          margin: 0 0 0.25rem 0;
          color: #2c3e50;
          font-size: 1rem;
        }
        
        .event-preview-info p {
          margin: 0;
          color: #5d6d7e;
          font-size: 0.9rem;
        }
        
        .verse-of-day {
          background: linear-gradient(135deg, #f8f6f0 0%, #e8e5dd 100%);
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid #e0dccf;
          margin-top: 2rem;
        }
        
        .verse-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #d6d0c2;
        }
        
        .verse-header h3 {
          margin: 0;
          color: #2c3e50;
        }
        
        .verse-date {
          color: #8b5a2b;
          font-style: italic;
          font-size: 0.9rem;
        }
        
        .verse-of-day blockquote {
          margin: 0;
          font-style: italic;
          color: #2c3e50;
          font-size: 1.1rem;
          line-height: 1.6;
          quotes: "\\201C" "\\201D" "\\2018" "\\2019";
        }
        
        .verse-of-day blockquote:before {
          content: open-quote;
          font-size: 2rem;
          color: #8b5a2b;
          line-height: 0;
          margin-right: 0.25rem;
          vertical-align: -0.4em;
        }
        
        .verse-of-day footer {
          margin-top: 0.5rem;
          font-weight: bold;
          text-align: right;
          color: #5d6d7e;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e8e5dd;
        }
        
        .section-header h2 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .section-header p {
          color: #5d6d7e;
          font-size: 1.1rem;
        }
        
        .events-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .event-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e8e5dd;
          transition: transform 0.3s ease;
        }
        
        .event-card:hover {
          transform: translateY(-3px);
        }
        
        .event-date-side {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6b8a 100%);
          color: white;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 100px;
        }
        
        .event-content {
          padding: 1.5rem;
          flex: 1;
        }
        
        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }
        
        .event-header h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.3rem;
        }
        
        .event-time {
          color: #8b5a2b;
          font-weight: 600;
          background: #f8f6f0;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .event-location {
          color: #5d6d7e;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }
        
        .event-description {
          color: #333;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        
        .event-actions {
          display: flex;
          gap: 0.75rem;
        }
        
        .ministries-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .ministry-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e8e5dd;
          transition: transform 0.3s ease;
        }
        
        .ministry-card:hover {
          transform: translateY(-5px);
        }
        
        .ministry-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #8b5a2b;
        }
        
        .ministry-card h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .ministry-leader, .ministry-time {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }
        
        .label {
          font-weight: 600;
          color: #5d6d7e;
        }
        
        .ministry-desc {
          color: #333;
          margin: 1rem 0;
          line-height: 1.5;
        }
        
        /* Appointment Section Styles */
        .appointment-actions {
          margin: 2.5rem 0;
          text-align: center;
        }
        
        .appointments-container {
          margin-top: 2rem;
        }
        
        .appointments-title {
          color: #2c3e50;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e8e5dd;
        }
        
        .appointments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }
        
        .appointment-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e8e5dd;
          transition: transform 0.3s ease;
        }
        
        .appointment-card:hover {
          transform: translateY(-5px);
        }
        
        .appointment-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e8e5dd;
        }
        
        .appointment-minister {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        
        .minister-icon {
          font-size: 1.5rem;
          color: #8b5a2b;
        }
        
        .appointment-minister h4 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.1rem;
        }
        
        .minister-role {
          color: #5d6d7e;
          font-size: 0.85rem;
          display: block;
          margin-top: 0.25rem;
        }
        
        .status-badge {
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-badge.pending {
          background-color: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }
        
        .status-badge.confirmed {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .status-badge.cancelled {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .appointment-card-body {
          margin-bottom: 1.5rem;
        }
        
        .appointment-detail {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          padding: 0.5rem 0;
        }
        
        .appointment-detail:not(:last-child) {
          border-bottom: 1px solid #f1f3f4;
        }
        
        .detail-label {
          font-weight: 600;
          color: #5d6d7e;
          font-size: 0.9rem;
        }
        
        .detail-value {
          color: #2c3e50;
          text-align: right;
          max-width: 60%;
          word-break: break-word;
        }
        
        .appointment-card-footer {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }
        
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 12px;
          border: 2px dashed #cbd5e0;
          margin: 2rem 0;
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.7;
          color: #8b5a2b;
        }
        
        .empty-state h3 {
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .empty-state p {
          color: #5d6d7e;
          max-width: 400px;
          margin: 0 auto;
        }
        
        /* About Section Styles */
        .about-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .about-section {
          background: #f8f6f0;
          padding: 1.5rem;
          border-radius: 10px;
          border: 1px solid #e8e5dd;
        }
        
        .about-section h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e0dccf;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }
        
        .team-member-card {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          border: 1px solid #e8e5dd;
          transition: transform 0.3s ease;
        }
        
        .team-member-card:hover {
          transform: translateY(-3px);
        }
        
        .member-photo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5a2b 0%, #c19a6b 100%);
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: white;
        }
        
        .team-member-card h4 {
          color: #2c3e50;
          margin: 0 0 0.25rem 0;
        }
        
        .team-member-card p {
          color: #5d6d7e;
          margin: 0;
          font-size: 0.9rem;
        }
        
        .service-times-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .service-time-card {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
          border: 1px solid #e8e5dd;
        }
        
        .service-time-card h4 {
          color: #2c3e50;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
        }
        
        .service-time-card p {
          color: #5d6d7e;
          margin: 0;
          font-weight: 500;
        }
        
        /* Tour Section Styles */
        .tour-intro {
          text-align: center;
          padding: 2rem;
        }
        
        .tour-placeholder-image {
          margin-bottom: 1.5rem;
        }
        
        .church-image {
          font-size: 6rem;
          color: #8b5a2b;
          opacity: 0.7;
        }
        
        .tour-intro p {
          color: #5d6d7e;
          max-width: 500px;
          margin: 0 auto 1.5rem;
          font-size: 1.1rem;
          line-height: 1.5;
        }
        
        .virtual-tour {
          margin-top: 1.5rem;
        }
        
        .tour-view {
          margin-bottom: 1.5rem;
          text-align: center;
          background: #f8f6f0;
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #e8e5dd;
        }
        
        .tour-view h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .location-image {
          font-size: 5rem;
          margin: 1rem 0;
          color: #8b5a2b;
        }
        
        .tour-placeholder {
          height: 300px;
          background-color: #f8f9fa;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          padding: 2rem;
          background-color: #f8f6f0;
          border: 1px solid #e8e5dd;
        }
        
        .tour-controls {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .control-btn {
          background-color: #f8f6f0;
          color: #2c3e50;
          border: 1px solid #e8e5dd;
          padding: 0.7rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          flex: 1;
          min-width: 120px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }
        
        .control-btn:hover, .control-btn.active {
          background: linear-gradient(135deg, #2c3e50 0%, #4a6b8a 100%);
          color: white;
        }
        
        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .modal-content.large {
          max-width: 700px;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e8e5dd;
        }
        
        .modal-header h3 {
          color: #2c3e50;
          margin: 0;
          font-size: 1.5rem;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #5d6d7e;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }
        
        .close-btn:hover {
          background-color: #f7fafc;
          color: #2c3e50;
        }
        
        .modal-body {
          margin-bottom: 1.5rem;
        }
        
        .event-detail-item {
          margin-bottom: 1rem;
        }
        
        .event-detail-item:last-child {
          margin-bottom: 0;
        }
        
        .detail-label {
          font-weight: 600;
          color: #2c3e50;
          display: block;
          margin-bottom: 0.25rem;
        }
        
        .detail-value {
          color: #5d6d7e;
        }
        
        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
        
        /* Form Styles */
        .appointment-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .form-section {
          background: #f8f6f0;
          padding: 1.5rem;
          border-radius: 10px;
          border: 1px solid #e8e5dd;
        }
        
        .form-section h4 {
          color: #2c3e50;
          margin: 0 0 1.2rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.2rem;
          margin-bottom: 1.2rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.9rem 1rem;
          border: 2px solid #e8e5dd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          background: white;
          font-family: inherit;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #8b5a2b;
          box-shadow: 0 0 0 3px rgba(139, 90, 43, 0.1);
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .form-footer {
          margin-top: 1rem;
        }
        
        .form-note {
          color: #5d6d7e;
          font-size: 0.85rem;
          text-align: center;
          margin-bottom: 1.5rem;
          font-style: italic;
        }
        
        /* Responsive Design */
        @media (max-width: 968px) {
          .dashboard-content {
            flex-direction: column;
          }
          
          .nav-panel {
            width: 100%;
            order: 2;
          }
          
          .main-content {
            order: 1;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .appointments-grid {
            grid-template-columns: 1fr;
          }
          
          .appointment-detail {
            flex-direction: column;
            gap: 0.25rem;
          }
          
          .detail-value {
            text-align: left;
            max-width: 100%;
          }
          
          .modal-content.large {
            padding: 1.5rem;
          }
          
          .modal-footer {
            flex-direction: column;
          }
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .stats-cards {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            grid-template-columns: 1fr;
          }
          
          .events-preview {
            grid-template-columns: 1fr;
          }
          
          .event-card {
            flex-direction: column;
          }
          
          .event-date-side {
            min-width: 100%;
            padding: 1rem;
          }
          
          .event-actions {
            flex-direction: column;
          }
          
          .team-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }
          
          .service-times-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;