"use client";

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from './../firebase'; // Make sure your firebase config exports db

// Types
interface Appointment {
  id: string;
  name: string;
  eventType: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  contact: string;
  notes?: string;
}

interface EventType {
  id: string;
  name: string;
  color: string;
  duration: number; // in minutes
}

// Sample event types data
const eventTypes: EventType[] = [
  { id: 'baptism', name: 'Baptism', color: 'bg-blue-500', duration: 45 },
  { id: 'communion', name: 'First Communion', color: 'bg-green-500', duration: 60 },
  { id: 'confirmation', name: 'Confirmation', color: 'bg-purple-500', duration: 60 },
  { id: 'marriage', name: 'Marriage', color: 'bg-pink-500', duration: 90 },
  { id: 'confession', name: 'Confession', color: 'bg-yellow-500', duration: 20 }
];

// Helper functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const getStatusColor = (status: string) => {
  switch(status) {
    case 'confirmed': return 'bg-green-100 text-green-800 border border-green-300';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
    case 'cancelled': return 'bg-red-100 text-red-800 border border-red-300';
    default: return 'bg-gray-100 text-gray-800 border border-gray-300';
  }
};

const getEventsByDate = (appointments: Appointment[]) => {
  const eventsByDate: Record<string, Appointment[]> = {};
  
  appointments.forEach(appointment => {
    if (!eventsByDate[appointment.date]) {
      eventsByDate[appointment.date] = [];
    }
    eventsByDate[appointment.date].push(appointment);
  });
  
  return eventsByDate;
};

// Components
const Header = () => (
  <header className="bg-gradient-to-r from-blue-800 to-purple-700 text-white p-4 shadow-lg">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold flex items-center">
        <span className="mr-2">⛪</span>
        Sanctuary Scheduler
      </h1>
      <div className="flex items-center space-x-4">
        <span className="hidden md:block">Admin User</span>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
          <span className="font-semibold">AU</span>
        </div>
      </div>
    </div>
  </header>
);

const Sidebar = ({ activeView, setActiveView, appointments }: { 
  activeView: string, 
  setActiveView: (view: string) => void,
  appointments: Appointment[]
}) => {
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(app => app.date === today);
  const pendingRequests = appointments.filter(app => app.status === 'pending');
  
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-50 to-indigo-50 h-screen p-4 shadow-inner">
      <nav className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 pl-2">Navigation</h2>
        <ul className="space-y-2">
          {['schedule', 'calendar', 'appointments'].map((view) => (
            <li key={view}>
              <button
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                  activeView === view 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-700 hover:bg-blue-100 hover:text-blue-800'
                }`}
                onClick={() => setActiveView(view)}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-3 text-center">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
            <span className="text-sm text-gray-700">Today's Appointments:</span>
            <span className="font-bold text-blue-700 bg-white px-2 py-1 rounded-full text-xs">
              {todaysAppointments.length}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
            <span className="text-sm text-gray-700">Pending Requests:</span>
            <span className="font-bold text-yellow-700 bg-white px-2 py-1 rounded-full text-xs">
              {pendingRequests.length}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
            <span className="text-sm text-gray-700">Total Appointments:</span>
            <span className="font-bold text-green-700 bg-white px-2 py-1 rounded-full text-xs">
              {appointments.length}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const ScheduleView = ({ appointments, onUpdateStatus }: { 
  appointments: Appointment[], 
  onUpdateStatus: (id: string, status: 'confirmed' | 'cancelled') => void 
}) => {
  const eventsByDate = getEventsByDate(appointments);
  const sortedDates = Object.keys(eventsByDate).sort();
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Schedule Overview</h2>
        <p className="text-gray-600">Manage and view all upcoming appointments</p>
      </div>
      
      {sortedDates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No appointments scheduled</h3>
          <p className="text-gray-500">All appointments will appear here once scheduled</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map(date => (
            <div key={date} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <h3 className="text-xl font-semibold">{formatDate(date)}</h3>
                <p className="text-blue-100 text-sm">{eventsByDate[date].length} appointment(s)</p>
              </div>
              <div className="p-4">
                {eventsByDate[date]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(appointment => (
                    <div key={appointment.id} className="border-b border-gray-100 last:border-b-0 py-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {appointment.time}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-1">{appointment.name}</h4>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                            {appointment.eventType}
                          </span>
                          <p className="text-sm text-gray-600 mb-1">
                            📧 {appointment.contact}
                          </p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg mt-2">
                              📝 {appointment.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {appointment.status !== 'confirmed' && (
                            <button 
                              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors duration-200 shadow-sm flex items-center space-x-1"
                              onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
                            >
                              <span>✓</span>
                              <span>Confirm</span>
                            </button>
                          )}
                          {appointment.status !== 'cancelled' && (
                            <button 
                              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors duration-200 shadow-sm flex items-center space-x-1"
                              onClick={() => onUpdateStatus(appointment.id, 'cancelled')}
                            >
                              <span>✗</span>
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CalendarView = ({ appointments }: { appointments: Appointment[] }) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Calendar View</h2>
        <p className="text-gray-600">Visual overview of all scheduled appointments</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2 bg-blue-50 rounded-lg">
              {day}
            </div>
          ))}
        </div>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Calendar View</h3>
          <p className="text-gray-500">Calendar grid would appear here with {appointments.length} appointments displayed</p>
        </div>
      </div>
    </div>
  );
};

const AllAppointmentsView = ({ appointments, onDelete }: { 
  appointments: Appointment[], 
  onDelete: (id: string) => void 
}) => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">All Appointments</h2>
        <p className="text-gray-600">Complete list of all scheduled appointments ({appointments.length} total)</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name & Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Event Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500 font-mono">{appointment.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{appointment.name}</div>
                    <div className="text-sm text-gray-500">{appointment.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {appointment.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors duration-200"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this appointment?')) {
                          onDelete(appointment.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {appointments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-700">No appointments found</h3>
            <p className="text-gray-500">Appointments will appear here once they are created</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'schedule' | 'calendar' | 'appointments'>('schedule');

  // Fetch appointments from Firebase
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const querySnapshot = await getDocs(collection(db, 'appointments'));
        const appointmentsData: Appointment[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          appointmentsData.push({ 
            id: doc.id, 
            name: data.name || '',
            eventType: data.eventType || '',
            date: data.date || '',
            time: data.time || '',
            status: data.status || 'pending',
            contact: data.contact || '',
            notes: data.notes || ''
          } as Appointment);
        });
        
        setAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Real-time listener for appointments
    const unsubscribe = onSnapshot(
      collection(db, 'appointments'), 
      (snapshot) => {
        const appointmentsData: Appointment[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          appointmentsData.push({ 
            id: doc.id, 
            name: data.name || '',
            eventType: data.eventType || '',
            date: data.date || '',
            time: data.time || '',
            status: data.status || 'pending',
            contact: data.contact || '',
            notes: data.notes || ''
          } as Appointment);
        });
        setAppointments(appointmentsData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error in real-time listener:', error);
        setError('Real-time updates disconnected. Please refresh the page.');
      }
    );

    return () => unsubscribe();
  }, []);

  // Update appointment status
  const updateAppointmentStatus = async (id: string, status: 'confirmed' | 'cancelled') => {
    try {
      const appointmentRef = doc(db, 'appointments', id);
      await updateDoc(appointmentRef, { status });
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment. Please try again.');
    }
  };

  // Delete appointment
  const deleteAppointment = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      setError('Failed to delete appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeView={activeView} setActiveView={setActiveView} appointments={appointments} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar activeView={activeView} setActiveView={setActiveView} appointments={appointments} />
        <main className="flex-1 flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
            <div className="text-red-600 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeView={activeView} setActiveView={setActiveView} appointments={appointments} />
      
      <main className="flex-1 overflow-auto">
        {activeView === 'schedule' && (
          <ScheduleView appointments={appointments} onUpdateStatus={updateAppointmentStatus} />
        )}
        {activeView === 'calendar' && <CalendarView appointments={appointments} />}
        {activeView === 'appointments' && (
          <AllAppointmentsView appointments={appointments} onDelete={deleteAppointment} />
        )}
      </main>
    </div>
  );
};

const ChurchAppointmentSystem = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <Dashboard />
    </div>
  );
};

export default ChurchAppointmentSystem;