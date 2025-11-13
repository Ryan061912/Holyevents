"use client";
import React, { useState, useEffect } from 'react';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseconfig";

// Types for Liturgical Events from Firebase
interface LiturgicalEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
  location: string;
  type: "mass" | "holy_day" | "feast" | "sacrament" | "procession";
  capacity?: number;
}

interface DisplayEvent {
  id: string | number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type?: "mass" | "holy_day" | "feast" | "sacrament" | "procession";
}

interface AppointmentFormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  purpose: string;
  minister: string;
  event: string;
}

interface Appointment extends AppointmentFormData {
  id: number;
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const [activeButton, setActiveButton] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState<DisplayEvent | null>(null);
  const [startTour, setStartTour] = useState(false);
  const [currentTourLocation, setCurrentTourLocation] = useState('sanctuary');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState<AppointmentFormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    purpose: '',
    minister: '',
    event: ''
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [liturgicalEvents, setLiturgicalEvents] = useState<LiturgicalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Sample events (fallback if no Firebase events)
  const sampleLiturgicalEvents: LiturgicalEvent[] = [
    { 
      id: "1", 
      name: "Sunday Mass", 
      date: "2024-09-15", 
      time: "10:00", 
      description: "Join us for our weekly Eucharistic celebration", 
      location: "Main Sanctuary", 
      type: "mass" 
    },
    { 
      id: "2", 
      name: "Baptism Ceremony", 
      date: "2024-09-17", 
      time: "14:00", 
      description: "Baptism ceremony for new members", 
      location: "Baptismal Font", 
      type: "sacrament" 
    },
    { 
      id: "3", 
      name: "Confession", 
      date: "2024-09-20", 
      time: "16:00", 
      description: "Sacrament of Reconciliation available with our priests", 
      location: "Confessionals", 
      type: "sacrament" 
    }
  ];

  // Fetch liturgical events from Firebase
  useEffect(() => {
    const fetchLiturgicalEvents = async () => {
      try {
        setLoading(true);
        console.log("🔄 Starting to fetch liturgical events...");
        
        if (!db) {
          console.log("❌ Firebase not configured, using sample data");
          setLiturgicalEvents(sampleLiturgicalEvents);
          return;
        }

        // Fetch from Firebase
        console.log("📡 Fetching from Firebase...");
        const eventsSnapshot = await getDocs(collection(db, "liturgicalEvents"));
        console.log("📊 Firebase response:", eventsSnapshot.size, "documents found");
        
        const eventsData: LiturgicalEvent[] = [];

        eventsSnapshot.forEach((doc) => {
          const data = doc.data();
          console.log("📄 Document data:", data);
          eventsData.push({
            id: doc.id,
            name: data.name || "",
            date: data.date || "",
            time: data.time || "",
            description: data.description || "",
            location: data.location || "",
            type: data.type || "mass",
            capacity: data.capacity || undefined,
          } as LiturgicalEvent);
        });

        console.log("✅ Events data set:", eventsData);
        
        if (eventsData.length > 0) {
          setLiturgicalEvents(eventsData);
        } else {
          console.log("📝 No Firebase events, using sample data");
          setLiturgicalEvents(sampleLiturgicalEvents);
        }
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(
          collection(db, "liturgicalEvents"),
          (snapshot) => {
            console.log("🔄 Real-time update received:", snapshot.size, "documents");
            const updatedEvents: LiturgicalEvent[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              updatedEvents.push({
                id: doc.id,
                name: data.name || "",
                date: data.date || "",
                time: data.time || "",
                description: data.description || "",
                location: data.location || "",
                type: data.type || "mass",
                capacity: data.capacity || undefined,
              } as LiturgicalEvent);
            });
            console.log("🔄 Updated events:", updatedEvents);
            setLiturgicalEvents(updatedEvents.length > 0 ? updatedEvents : sampleLiturgicalEvents);
          },
          (error) => {
            console.error("❌ Error in liturgical events listener:", error);
          }
        );

        return () => {
          console.log("🧹 Cleaning up Firebase listener");
          unsubscribe();
        };
      } catch (error) {
        console.error("❌ Error fetching liturgical events:", error);
        setLiturgicalEvents(sampleLiturgicalEvents);
      } finally {
        console.log("🏁 Finished loading, setting loading to false");
        setLoading(false);
      }
    };

    fetchLiturgicalEvents();
  }, []);

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric",
        year: "numeric"
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString: string): string => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      return timeString;
    }
  };

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "mass":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "holy_day":
        return "bg-purple-100 text-purple-800 border border-purple-300";
      case "feast":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "sacrament":
        return "bg-pink-100 text-pink-800 border border-pink-300";
      case "procession":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  // Convert liturgical events to display format
  const displayEvents: DisplayEvent[] = React.useMemo(() => {
    console.log("🔄 Processing displayEvents, liturgicalEvents:", liturgicalEvents.length);
    
    const eventsToUse = liturgicalEvents.length > 0 ? liturgicalEvents : sampleLiturgicalEvents;
    
    const converted = eventsToUse.map(event => ({
      id: event.id,
      title: event.name,
      date: formatDate(event.date),
      time: formatTime(event.time),
      location: event.location,
      description: event.description,
      type: event.type
    }));
    
    console.log("✅ Converted events:", converted.length);
    return converted;
  }, [liturgicalEvents]);

  const churchLocations = ['Main Sanctuary', 'Chapel', 'Baptismal Font', 'Confessionals'];
  const churchEvents = displayEvents.filter(event => churchLocations.includes(event.location));
  
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

  const handleViewDetails = (event: DisplayEvent) => {
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

  const handleOpenAppointmentModal = (event: DisplayEvent | null = null) => {
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
    const newAppointment: Appointment = {
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
              {liturgicalEvents.length > 0 && (
                <span className="event-badge">{liturgicalEvents.length}</span>
              )}
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
            {liturgicalEvents.length > 0 && (
              <div className="events-count">
                <small>{liturgicalEvents.length} events from admin</small>
              </div>
            )}
          </div>
        </nav>

        {/* Content Area */}
        <main className="main-content">
          {activeButton === 'home' && (
            <div className="content-section">
              <div className="welcome-banner">
                <h2>Welcome to Immaculate Conception Catholic Church</h2>
                <p>"A community of faith, worship, and service in the Catholic tradition"</p>
                {liturgicalEvents.length > 0 ? (
                  <div className="admin-events-notice">
                    📢 <strong>Real-time updates:</strong> {liturgicalEvents.length} liturgical events loaded from admin
                  </div>
                ) : (
                  <div className="sample-events-notice">
                    📝 <strong>Sample data:</strong> Using sample events for demonstration
                  </div>
                )}
              </div>
              
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <h3>Upcoming Events</h3>
                    <span className="stat-number">{churchEvents.length}</span>
                    {liturgicalEvents.length > 0 ? (
                      <small className="real-time-badge">Live from Admin</small>
                    ) : (
                      <small className="sample-badge">Sample Data</small>
                    )}
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
                        <span className="event-day">{event.date.split(' ')[2]?.replace(',', '') || '15'}</span>
                        <span className="event-month">{event.date.split(' ')[1] || 'Sept'}</span>
                      </div>
                      <div className="event-preview-info">
                        <h4>{event.title}</h4>
                        <p>{event.time} • {event.location}</p>
                        {event.type && (
                          <span className={`event-type-badge ${getEventTypeColor(event.type)}`}>
                            {event.type.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {churchEvents.length === 0 && !loading && (
                  <div className="no-events-message">
                    <p>No events scheduled yet. Check back later for updates!</p>
                  </div>
                )}
              </div>

              <div className="verse-of-day">
                <div className="verse-header">
                  <h3>Verse of the Day</h3>
                  <span className="verse-date">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <blockquote>
                  "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God."
                  <footer>- Ephesians 2:8</footer>
                </blockquote>
              </div>

              {/* Debug Info - Remove in production */}
              <div className="debug-info">
                <h4>Debug Info:</h4>
                <p>Loading: {loading.toString()}</p>
                <p>Liturgical Events Count: {liturgicalEvents.length}</p>
                <p>Display Events Count: {displayEvents.length}</p>
                <p>Church Events Count: {churchEvents.length}</p>
                <details>
                  <summary>Liturgical Events Data</summary>
                  <pre>{JSON.stringify(liturgicalEvents, null, 2)}</pre>
                </details>
              </div>
            </div>
          )}

          {activeButton === 'events' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Catholic Liturgical Events & Sacraments</h2>
                <p>Holy Mass and Sacraments celebrated in our church</p>
                {liturgicalEvents.length > 0 ? (
                  <div className="admin-events-indicator">
                    ✅ Showing {liturgicalEvents.length} events from admin dashboard
                  </div>
                ) : (
                  <div className="sample-events-indicator">
                    📝 Showing sample events for demonstration
                  </div>
                )}
              </div>
              
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading events from admin...</p>
                  <div className="loading-details">
                    <small>Checking Firebase for liturgical events...</small>
                  </div>
                </div>
              ) : (
                <div className="events-list">
                  {churchEvents.map(event => (
                    <div key={event.id} className="event-card">
                      <div className="event-date-side">
                        <div className="event-date-badge">
                          <span className="event-day">{event.date.split(' ')[2]?.replace(',', '') || '15'}</span>
                          <span className="event-month">{event.date.split(' ')[1] || 'Sept'}</span>
                        </div>
                      </div>
                      <div className="event-content">
                        <div className="event-header">
                          <h3>{event.title}</h3>
                          <div className="event-time-type">
                            <span className="event-time">{event.time}</span>
                            {event.type && (
                              <span className={`event-type-tag ${getEventTypeColor(event.type)}`}>
                                {event.type.replace('_', ' ').toUpperCase()}
                              </span>
                            )}
                          </div>
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
              )}
              
              {churchEvents.length === 0 && !loading && (
                <div className="empty-events-state">
                  <div className="empty-icon">⛪</div>
                  <h3>No Liturgical Events Scheduled</h3>
                  <p>Check back later for upcoming masses and sacraments.</p>
                </div>
              )}
              
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
                      {selectedEvent.type && (
                        <div className="event-detail-item">
                          <span className="detail-label">Event Type:</span>
                          <span className="detail-value">
                            <span className={`event-type-badge ${getEventTypeColor(selectedEvent.type)}`}>
                              {selectedEvent.type.replace('_', ' ').toUpperCase()}
                            </span>
                          </span>
                        </div>
                      )}
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
                <p>Join our community in serving and growing in faith</p>
              </div>
              <div className="ministries-grid">
                {ministries.map(ministry => (
                  <div key={ministry.id} className="ministry-card">
                    <h3>{ministry.title}</h3>
                    <p className="ministry-leader">Leader: {ministry.leader}</p>
                    <p className="ministry-time">⏰ {ministry.time}</p>
                    <p className="ministry-description">{ministry.description}</p>
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
                <p>Schedule appointments for sacraments and spiritual guidance</p>
              </div>
              
              <div className="appointment-actions">
                <button 
                  className="action-btn large primary" 
                  onClick={() => handleOpenAppointmentModal()}
                >
                  📋 Request New Appointment
                </button>
              </div>

              {appointments.length > 0 && (
                <div className="appointments-list">
                  <h3>Your Appointments</h3>
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="appointment-card">
                      <div className="appointment-header">
                        <h4>{appointment.purpose}</h4>
                        <span className={`status-badge ${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <p><strong>Minister:</strong> {appointment.minister}</p>
                      <p><strong>Date:</strong> {appointment.date} at {appointment.time}</p>
                      <p><strong>Event:</strong> {appointment.event}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeButton === 'about' && (
            <div className="content-section">
              <div className="section-header">
                <h2>About Our Parish</h2>
                <p>Immaculate Conception Catholic Church - A community of faith since 1925</p>
              </div>
              <div className="about-content">
                <div className="about-section">
                  <h3>Our Mission</h3>
                  <p>To proclaim the Gospel of Jesus Christ, celebrate the Sacraments, and serve our community in love and charity.</p>
                </div>
                <div className="about-section">
                  <h3>Mass Schedule</h3>
                  <ul>
                    <li>Sunday: 7:00 AM, 9:00 AM, 11:00 AM, 5:00 PM</li>
                    <li>Weekdays: 6:30 AM, 8:00 AM</li>
                    <li>Saturday: 8:00 AM, 4:00 PM (Vigil)</li>
                  </ul>
                </div>
                <div className="about-section">
                  <h3>Contact Information</h3>
                  <p>📍 123 Church Street, City, State 12345</p>
                  <p>📞 (555) 123-4567</p>
                  <p>📧 info@immaculateconception.org</p>
                </div>
              </div>
            </div>
          )}

          {activeButton === 'tour' && (
            <div className="content-section">
              <div className="section-header">
                <h2>Virtual Church Tour</h2>
                <p>Explore our beautiful church and its sacred spaces</p>
              </div>
              
              {!startTour ? (
                <div className="tour-start">
                  <div className="tour-welcome">
                    <h3>Welcome to Our Church</h3>
                    <p>Take a virtual tour of our sacred spaces and learn about their significance in our Catholic faith.</p>
                    <button className="action-btn large primary" onClick={handleStartTour}>
                      🚶 Start Virtual Tour
                    </button>
                  </div>
                </div>
              ) : (
                <div className="tour-active">
                  <div className="tour-location">
                    <h3>{tourLocations[currentTourLocation as keyof typeof tourLocations].name}</h3>
                    <p>{tourLocations[currentTourLocation as keyof typeof tourLocations].description}</p>
                  </div>
                  <div className="tour-navigation">
                    {Object.keys(tourLocations).map(location => (
                      <button
                        key={location}
                        className={`tour-nav-btn ${currentTourLocation === location ? 'active' : ''}`}
                        onClick={() => handleNavigateTour(location)}
                      >
                        {tourLocations[location as keyof typeof tourLocations].name}
                      </button>
                    ))}
                  </div>
                  <button className="action-btn outline" onClick={handleEndTour}>
                    End Tour
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Schedule Sacrament Appointment</h3>
              <button className="close-btn" onClick={handleCloseAppointmentModal}>✕</button>
            </div>
            <form onSubmit={handleSubmitAppointment}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={appointmentForm.name}
                    onChange={handleAppointmentFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={appointmentForm.email}
                    onChange={handleAppointmentFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={appointmentForm.phone}
                    onChange={handleAppointmentFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={appointmentForm.date}
                    onChange={handleAppointmentFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <input
                    type="time"
                    name="time"
                    value={appointmentForm.time}
                    onChange={handleAppointmentFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Purpose *</label>
                  <textarea
                    name="purpose"
                    value={appointmentForm.purpose}
                    onChange={handleAppointmentFormChange}
                    required
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Minister</label>
                  <select
                    name="minister"
                    value={appointmentForm.minister}
                    onChange={handleAppointmentFormChange}
                  >
                    <option value="">Select a minister</option>
                    {ministers.map(minister => (
                      <option key={minister.id} value={minister.name}>
                        {minister.name} - {minister.role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Related Event</label>
                  <input
                    type="text"
                    name="event"
                    value={appointmentForm.event}
                    onChange={handleAppointmentFormChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="action-btn outline" onClick={handleCloseAppointmentModal}>
                  Cancel
                </button>
                <button type="submit" className="action-btn primary">
                  Submit Request
                </button>
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
  
        .event-badge {
          background: #e74c3c;
          color: white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
        }
        
        .admin-events-notice {
          background: rgba(52, 152, 219, 0.1);
          border: 1px solid #3498db;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #2c3e50;
        }
        
        .sample-events-notice {
          background: rgba(243, 156, 18, 0.1);
          border: 1px solid #f39c12;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          margin-top: 1rem;
          font-size: 0.9rem;
          color: #2c3e50;
        }
        
        .real-time-badge {
          background: #27ae60;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          margin-top: 0.5rem;
          display: inline-block;
        }
        
        .sample-badge {
          background: #f39c12;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          margin-top: 0.5rem;
          display: inline-block;
        }
        
        .admin-events-indicator {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        
        .sample-events-indicator {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
          border-radius: 6px;
          padding: 0.5rem 1rem;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }
        
        .loading-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e8e5dd;
        }
        
        .loading-spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        .loading-details {
          margin-top: 1rem;
          color: #666;
          font-size: 0.9rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .empty-events-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 12px;
          border: 1px solid #e8e5dd;
        }
        
        .empty-events-state .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        
        .event-type-badge, .event-type-tag {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: inline-block;
          margin-left: 0.5rem;
        }
        
        .event-time-type {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .events-count {
          text-align: center;
          margin-top: 0.5rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
        .no-events-message {
          text-align: center;
          padding: 1rem;
          color: #666;
          font-style: italic;
        }

        .debug-info {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 1rem;
          margin: 1rem 0;
          font-family: monospace;
          font-size: 0.8rem;
        }

        /* Rest of the existing CSS styles remain exactly the same */
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
          position: relative;
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
        
        .welcome-banner {
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

        /* Ministries Styles */
        .ministries-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .ministry-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #e8e5dd;
        }
        
        .ministry-card h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .ministry-leader {
          color: #8b5a2b;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .ministry-time {
          color: #5d6d7e;
          margin-bottom: 1rem;
        }
        
        .ministry-description {
          color: #333;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        /* Appointments Styles */
        .appointment-actions {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .appointments-list {
          margin-top: 2rem;
        }
        
        .appointment-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e8e5dd;
        }
        
        .appointment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .status-badge {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }
        
        .status-badge.confirmed {
          background: #d1ecf1;
          color: #0c5460;
        }

        /* About Styles */
        .about-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .about-section h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .about-section p, .about-section ul {
          color: #333;
          line-height: 1.6;
        }
        
        .about-section ul {
          padding-left: 1.5rem;
        }
        
        .about-section li {
          margin-bottom: 0.5rem;
        }

        /* Tour Styles */
        .tour-start {
          text-align: center;
          padding: 3rem;
        }
        
        .tour-welcome h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .tour-welcome p {
          color: #5d6d7e;
          margin-bottom: 2rem;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        
        .tour-active {
          text-align: center;
        }
        
        .tour-location {
          background: #f8f6f0;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          border: 1px solid #e8e5dd;
        }
        
        .tour-location h3 {
          color: #2c3e50;
          margin-bottom: 1rem;
        }
        
        .tour-location p {
          color: #333;
          line-height: 1.6;
          font-size: 1.1rem;
        }
        
        .tour-navigation {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        
        .tour-nav-btn {
          background: transparent;
          color: #4a6b8a;
          border: 2px solid #4a6b8a;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .tour-nav-btn:hover {
          background: #4a6b8a;
          color: white;
        }
        
        .tour-nav-btn.active {
          background: #4a6b8a;
          color: white;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e8e5dd;
        }
        
        .modal-header h3 {
          margin: 0;
          color: #2c3e50;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #5d6d7e;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-body {
          padding: 1.5rem;
        }
        
        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding: 1.5rem;
          border-top: 1px solid #e8e5dd;
        }
        
        .event-detail-item {
          display: flex;
          margin-bottom: 1rem;
          align-items: flex-start;
        }
        
        .detail-label {
          font-weight: 600;
          color: #2c3e50;
          min-width: 100px;
          margin-right: 1rem;
        }
        
        .detail-value {
          color: #333;
          flex: 1;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e8e5dd;
          border-radius: 6px;
          font-size: 1rem;
          font-family: inherit;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
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
          
          .modal-footer {
            flex-direction: column;
          }
          
          .tour-navigation {
            flex-direction: column;
            align-items: center;
          }
          
          .tour-nav-btn {
            width: 200px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;