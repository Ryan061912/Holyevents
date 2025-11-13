"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, deleteDoc, doc, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../firebaseconfig";

// Types
interface Appointment {
  id: string;
  name: string;
  eventType: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled";
  contact: string;
  notes?: string;
}

interface EventType {
  id: string;
  name: string;
  color: string;
  duration: number;
}

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

// Helper functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 border border-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "cancelled":
      return "bg-red-100 text-red-800 border border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border border-gray-300";
  }
};

const getLiturgicalEventColor = (type: string) => {
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

const exportToCSV = (appointments: Appointment[], events: LiturgicalEvent[]) => {
  let csv = "CHURCH APPOINTMENT SYSTEM EXPORT\n\n";
  csv += "APPOINTMENTS\n";
  csv += "Date,Time,Name,Contact,Event Type,Status,Notes\n";
  appointments.forEach((app) => {
    const notes = app.notes ? `"${app.notes}"` : "";
    csv += `${app.date},${app.time},"${app.name}","${app.contact}","${app.eventType}","${app.status}",${notes}\n`;
  });
  csv += "\n\nLITURGICAL EVENTS\n";
  csv += "Date,Time,Name,Type,Location,Description,Capacity\n";
  events.forEach((event) => {
    csv += `${event.date},${event.time},"${event.name}","${event.type}","${event.location}","${event.description}",${event.capacity || "N/A"}\n`;
  });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `church-export-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const getEventsByDate = (appointments: Appointment[]) => {
  const eventsByDate: Record<string, Appointment[]> = {};
  appointments.forEach((appointment) => {
    if (!eventsByDate[appointment.date]) {
      eventsByDate[appointment.date] = [];
    }
    eventsByDate[appointment.date].push(appointment);
  });
  return eventsByDate;
};

// Components
const Header = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  
  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    setCurrentDate(formattedDate);
  }, []);

  return (
    <header className="bg-gradient-to-r from-blue-800 to-purple-700 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <span className="mr-2">⛪</span>
            Catholic Liturgical Events & Sacraments
          </h1>
          <p className="text-blue-200 text-sm mt-1">{currentDate}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="hidden md:block">Admin User</span>
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
            <span className="font-semibold">AU</span>
          </div>
        </div>
      </div>
    </header>
  );
};

interface SidebarProps {
  activeView: string;
  setActiveView: (view: "admin" | "schedule" | "liturgical" | "calendar" | "appointments") => void;
  appointments: Appointment[];
  liturgicalEvents: LiturgicalEvent[];
}

const Sidebar = ({
  activeView,
  setActiveView,
  appointments,
  liturgicalEvents,
}: SidebarProps) => {
  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = appointments.filter((app) => app.date === today);
  const pendingRequests = appointments.filter((app) => app.status === "pending");
  const upcomingEvents = liturgicalEvents.filter((e) => e.date >= today);

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-50 to-indigo-50 h-screen p-4 shadow-inner overflow-y-auto">
      <nav className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 pl-2">Navigation</h2>
        <ul className="space-y-2">
          {(["admin", "schedule", "liturgical", "calendar", "appointments"] as const).map((view) => (
            <li key={view}>
              <button
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 text-sm ${
                  activeView === view
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-100 hover:text-blue-800"
                }`}
                onClick={() => setActiveView(view)}
              >
                {view === "admin" && "📊 Dashboard"}
                {view === "schedule" && "📅 Schedule"}
                {view === "liturgical" && "⛪ Liturgical"}
                {view === "calendar" && "📆 Calendar"}
                {view === "appointments" && "📋 Appointments"}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-white rounded-xl p-4 shadow-md border border-blue-100">
        <h3 className="font-semibold text-gray-800 mb-3 text-center text-sm">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
            <span className="text-xs text-gray-700">Today's Appointments:</span>
            <span className="font-bold text-blue-700 bg-white px-2 py-1 rounded-full text-xs">
              {todaysAppointments.length}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
            <span className="text-xs text-gray-700">Pending Requests:</span>
            <span className="font-bold text-yellow-700 bg-white px-2 py-1 rounded-full text-xs">
              {pendingRequests.length}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
            <span className="text-xs text-gray-700">Upcoming Events:</span>
            <span className="font-bold text-green-700 bg-white px-2 py-1 rounded-full text-xs">
              {upcomingEvents.length}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const AdminDashboard = ({
  appointments,
  liturgicalEvents,
  onExport,
}: {
  appointments: Appointment[];
  liturgicalEvents: LiturgicalEvent[];
  onExport: () => void;
}) => {
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;
  const massCount = liturgicalEvents.filter((e) => e.type === "mass").length;
  const feastCount = liturgicalEvents.filter((e) => e.type === "feast").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Church Management System Overview</p>
      </div>

      <div className="mb-6">
        <button
          onClick={onExport}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center space-x-2"
        >
          <span>📥</span>
          <span>Export All Data (CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <div className="text-blue-600 text-3xl mb-2">📋</div>
          <h3 className="text-gray-700 text-sm font-semibold mb-3">Total Appointments</h3>
          <p className="text-3xl font-bold text-gray-800">{appointments.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
          <div className="text-green-600 text-3xl mb-2">✓</div>
          <h3 className="text-gray-700 text-sm font-semibold mb-3">Confirmed</h3>
          <p className="text-3xl font-bold text-green-600">{confirmedCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-600">
          <div className="text-yellow-600 text-3xl mb-2">⏳</div>
          <h3 className="text-gray-700 text-sm font-semibold mb-3">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
          <div className="text-red-600 text-3xl mb-2">✕</div>
          <h3 className="text-gray-700 text-sm font-semibold mb-3">Cancelled</h3>
          <p className="text-3xl font-bold text-red-600">{cancelledCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
          <div className="text-purple-600 text-3xl mb-2">⛪</div>
          <h3 className="text-gray-700 text-sm font-semibold mb-3">Liturgical Events</h3>
          <p className="text-3xl font-bold text-purple-600">{liturgicalEvents.length}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-600">
          <div className="text-indigo-600 text-3xl mb-2">🙏</div>
          <h3 className="text-gray-700 text-sm font-semibold mb-3">Mass Services</h3>
          <p className="text-3xl font-bold text-indigo-600">{massCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h3>
          <div className="space-y-3">
            {appointments.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-medium text-gray-800">{app.name}</p>
                  <p className="text-sm text-gray-500">{app.eventType}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(app.status)}`}>
                  {app.status.toUpperCase()}
                </span>
              </div>
            ))}
            {appointments.length === 0 && <p className="text-gray-500 text-sm">No appointments yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Liturgical Events</h3>
          <div className="space-y-3">
            {liturgicalEvents.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-medium text-gray-800">{event.name}</p>
                  <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getLiturgicalEventColor(event.type)}`}>
                  {event.type.replace("_", " ").toUpperCase()}
                </span>
              </div>
            ))}
            {liturgicalEvents.length === 0 && <p className="text-gray-500 text-sm">No events scheduled</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Event Modal Component
const AddEventModal = ({
  isOpen,
  onClose,
  onAddEvent,
  editingEvent,
  onUpdateEvent
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: Omit<LiturgicalEvent, 'id'>) => void;
  editingEvent?: LiturgicalEvent | null;
  onUpdateEvent?: (id: string, event: Omit<LiturgicalEvent, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    description: '',
    location: '',
    type: 'mass' as LiturgicalEvent['type'],
    capacity: ''
  });

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        name: editingEvent.name,
        date: editingEvent.date,
        time: editingEvent.time,
        description: editingEvent.description,
        location: editingEvent.location,
        type: editingEvent.type,
        capacity: editingEvent.capacity?.toString() || ''
      });
    } else {
      setFormData({
        name: '',
        date: '',
        time: '',
        description: '',
        location: '',
        type: 'mass',
        capacity: ''
      });
    }
  }, [editingEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      name: formData.name,
      date: formData.date,
      time: formData.time,
      description: formData.description,
      location: formData.location,
      type: formData.type,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined
    };

    if (editingEvent && onUpdateEvent) {
      onUpdateEvent(editingEvent.id, eventData);
    } else {
      onAddEvent(eventData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingEvent ? 'Edit Liturgical Event' : 'Add New Liturgical Event'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Sunday Mass, Easter Celebration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as LiturgicalEvent['type']})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="mass">Mass</option>
                  <option value="holy_day">Holy Day</option>
                  <option value="feast">Feast</option>
                  <option value="sacrament">Sacrament</option>
                  <option value="procession">Procession</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Main Sanctuary, Chapel, Church Grounds"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the event, its significance, and any special instructions..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (Optional)
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Maximum number of attendees"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingEvent ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// LiturgicalEventsView Component with CRUD operations
const LiturgicalEventsView = ({ 
  events, 
  onAddEvent, 
  onUpdateEvent, 
  onDeleteEvent 
}: { 
  events: LiturgicalEvent[];
  onAddEvent: (event: Omit<LiturgicalEvent, 'id'>) => void;
  onUpdateEvent: (id: string, event: Omit<LiturgicalEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<LiturgicalEvent | null>(null);

  const eventsByDate = events.reduce(
    (acc, event) => {
      if (!acc[event.date]) acc[event.date] = [];
      acc[event.date].push(event);
      return acc;
    },
    {} as Record<string, LiturgicalEvent[]>,
  );

  const sortedDates = Object.keys(eventsByDate).sort();

  const handleEdit = (event: LiturgicalEvent) => {
    setEditingEvent(event);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      onDeleteEvent(id);
    }
  };

  const handleAddEvent = (eventData: Omit<LiturgicalEvent, 'id'>) => {
    onAddEvent(eventData);
    setShowAddModal(false);
  };

  const handleUpdateEvent = (id: string, eventData: Omit<LiturgicalEvent, 'id'>) => {
    onUpdateEvent(id, eventData);
    setShowAddModal(false);
    setEditingEvent(null);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingEvent(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Liturgical Events</h2>
            <p className="text-gray-600">Manage church calendar and scheduled liturgical services</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Add New Event</span>
          </button>
        </div>
      </div>

      {sortedDates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="text-6xl mb-4">⛪</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No liturgical events scheduled</h3>
          <p className="text-gray-500">Add events to display them in the church calendar</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Event
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
                <h3 className="text-xl font-semibold">{formatDate(date)}</h3>
                <p className="text-purple-100 text-sm">{eventsByDate[date].length} event(s)</p>
              </div>
              <div className="p-4">
                {eventsByDate[date]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((event) => (
                    <div
                      key={event.id}
                      className="border-b border-gray-100 last:border-b-0 py-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {event.time}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getLiturgicalEventColor(event.type)}`}
                            >
                              {event.type.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-1">{event.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">📍 {event.location}</p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-lg mt-2">📝 {event.description}</p>
                          {event.capacity && (
                            <p className="text-sm text-gray-600 mt-2">👥 Capacity: {event.capacity}</p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(event)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors duration-200 shadow-sm flex items-center space-x-1"
                          >
                            <span>✏️</span>
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors duration-200 shadow-sm flex items-center space-x-1"
                          >
                            <span>🗑️</span>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddEventModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onAddEvent={handleAddEvent}
        editingEvent={editingEvent}
        onUpdateEvent={handleUpdateEvent}
      />
    </div>
  );
};

const ScheduleView = ({
  appointments,
  onUpdateStatus,
}: {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: "confirmed" | "cancelled") => void;
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
          {sortedDates.map((date) => (
            <div key={date} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
                <h3 className="text-xl font-semibold">{formatDate(date)}</h3>
                <p className="text-blue-100 text-sm">{eventsByDate[date].length} appointment(s)</p>
              </div>
              <div className="p-4">
                {eventsByDate[date]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border-b border-gray-100 last:border-b-0 py-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                              {appointment.time}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                            >
                              {appointment.status.toUpperCase()}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-800 mb-1">{appointment.name}</h4>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                            {appointment.eventType}
                          </span>
                          <p className="text-sm text-gray-600 mb-1">📧 {appointment.contact}</p>
                          {appointment.notes && (
                            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded-lg mt-2">
                              📝 {appointment.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {appointment.status !== "confirmed" && (
                            <button
                              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors duration-200 shadow-sm flex items-center space-x-1"
                              onClick={() => onUpdateStatus(appointment.id, "confirmed")}
                            >
                              <span>✓</span>
                              <span>Confirm</span>
                            </button>
                          )}
                          {appointment.status !== "cancelled" && (
                            <button
                              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors duration-200 shadow-sm flex items-center space-x-1"
                              onClick={() => onUpdateStatus(appointment.id, "cancelled")}
                            >
                              <span>✗</span>
                              <span>Cancel</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-700 py-2 bg-blue-50 rounded-lg">
              {day}
            </div>
          ))}
        </div>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Calendar View</h3>
          <p className="text-gray-500">
            Calendar grid would appear here with {appointments.length} appointments displayed
          </p>
        </div>
      </div>
    </div>
  );
};

const AllAppointmentsView = ({
  appointments,
  onDelete,
}: {
  appointments: Appointment[];
  onDelete: (id: string) => void;
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
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Name & Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Event Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
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
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-lg hover:bg-red-100 transition-colors duration-200"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this appointment?")) {
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
  const [liturgicalEvents, setLiturgicalEvents] = useState<LiturgicalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<"admin" | "schedule" | "liturgical" | "calendar" | "appointments">("admin");

  // Fetch appointments from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!db) {
          throw new Error("Firebase is not properly configured");
        }

        // Fetch appointments
        const appointmentsSnapshot = await getDocs(collection(db, "appointments"));
        const appointmentsData: Appointment[] = [];

        appointmentsSnapshot.forEach((doc) => {
          const data = doc.data();
          appointmentsData.push({
            id: doc.id,
            name: data.name || "",
            eventType: data.eventType || "",
            date: data.date || "",
            time: data.time || "",
            status: data.status || "pending",
            contact: data.contact || "",
            notes: data.notes || "",
          } as Appointment);
        });

        setAppointments(appointmentsData);

        // Fetch liturgical events
        const eventsSnapshot = await getDocs(collection(db, "liturgicalEvents"));
        const eventsData: LiturgicalEvent[] = [];

        eventsSnapshot.forEach((doc) => {
          const data = doc.data();
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

        setLiturgicalEvents(eventsData);
        setError(null);

      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Using demo data. Connect to Firebase for real-time updates.");
        setAppointments([]);
        setLiturgicalEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time listeners
    try {
      if (db) {
        // Appointments listener
        const appointmentsUnsubscribe = onSnapshot(
          collection(db, "appointments"),
          (snapshot) => {
            const appointmentsData: Appointment[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              appointmentsData.push({
                id: doc.id,
                name: data.name || "",
                eventType: data.eventType || "",
                date: data.date || "",
                time: data.time || "",
                status: data.status || "pending",
                contact: data.contact || "",
                notes: data.notes || "",
              } as Appointment);
            });
            setAppointments(appointmentsData);
          },
          (error) => {
            console.error("Error in appointments listener:", error);
          }
        );

        // Liturgical events listener
        const eventsUnsubscribe = onSnapshot(
          collection(db, "liturgicalEvents"),
          (snapshot) => {
            const eventsData: LiturgicalEvent[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
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
            setLiturgicalEvents(eventsData);
          },
          (error) => {
            console.error("Error in liturgical events listener:", error);
          }
        );

        return () => {
          appointmentsUnsubscribe();
          eventsUnsubscribe();
        };
      }
    } catch (error) {
      console.error("Error setting up real-time listeners:", error);
    }

    return () => {};
  }, []);

  // Add liturgical event to Firebase
  const handleAddLiturgicalEvent = async (eventData: Omit<LiturgicalEvent, 'id'>) => {
    try {
      if (!db) {
        throw new Error("Firebase not available");
      }
      
      console.log("Adding event to Firebase:", eventData);
      
      const docRef = await addDoc(collection(db, "liturgicalEvents"), {
        name: eventData.name,
        date: eventData.date,
        time: eventData.time,
        description: eventData.description,
        location: eventData.location,
        type: eventData.type,
        capacity: eventData.capacity || null,
        createdAt: new Date().toISOString()
      });
      
      console.log("Event added with ID:", docRef.id);
      
    } catch (error) {
      console.error("Error adding liturgical event to Firebase:", error);
      alert("Error adding event. Please check console for details.");
    }
  };

  // Update liturgical event in Firebase
  const handleUpdateLiturgicalEvent = async (id: string, eventData: Omit<LiturgicalEvent, 'id'>) => {
    try {
      if (!db) {
        throw new Error("Firebase not available");
      }
      
      console.log("Updating event in Firebase:", id, eventData);
      
      await updateDoc(doc(db, "liturgicalEvents", id), {
        name: eventData.name,
        date: eventData.date,
        time: eventData.time,
        description: eventData.description,
        location: eventData.location,
        type: eventData.type,
        capacity: eventData.capacity || null,
        updatedAt: new Date().toISOString()
      });
      
      console.log("Event updated successfully");
      
    } catch (error) {
      console.error("Error updating liturgical event in Firebase:", error);
      alert("Error updating event. Please check console for details.");
    }
  };

  // Delete liturgical event from Firebase
  const handleDeleteLiturgicalEvent = async (id: string) => {
    try {
      if (!db) {
        throw new Error("Firebase not available");
      }
      
      console.log("Deleting event from Firebase:", id);
      
      await deleteDoc(doc(db, "liturgicalEvents", id));
      
      console.log("Event deleted successfully");
      
    } catch (error) {
      console.error("Error deleting liturgical event from Firebase:", error);
      alert("Error deleting event. Please check console for details.");
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (id: string, status: "confirmed" | "cancelled") => {
    try {
      if (!db) {
        throw new Error("Firebase not available");
      }
      const appointmentRef = doc(db, "appointments", id);
      await updateDoc(appointmentRef, { status });
    } catch (error) {
      console.error("Error updating appointment:", error);
      setAppointments(prev => prev.map(app => 
        app.id === id ? { ...app, status } : app
      ));
    }
  };

  // Delete appointment
  const deleteAppointment = async (id: string) => {
    try {
      if (!db) {
        throw new Error("Firebase not available");
      }
      await deleteDoc(doc(db, "appointments", id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      setAppointments(prev => prev.filter(app => app.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          appointments={appointments}
          liturgicalEvents={liturgicalEvents}
        />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading data...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        appointments={appointments}
        liturgicalEvents={liturgicalEvents}
      />

      <main className="flex-1 overflow-auto">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
            <div className="flex items-center">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {activeView === "admin" && (
          <AdminDashboard
            appointments={appointments}
            liturgicalEvents={liturgicalEvents}
            onExport={() => exportToCSV(appointments, liturgicalEvents)}
          />
        )}
        {activeView === "schedule" && (
          <ScheduleView appointments={appointments} onUpdateStatus={updateAppointmentStatus} />
        )}
        {activeView === "liturgical" && (
          <LiturgicalEventsView 
            events={liturgicalEvents} 
            onAddEvent={handleAddLiturgicalEvent}
            onUpdateEvent={handleUpdateLiturgicalEvent}
            onDeleteEvent={handleDeleteLiturgicalEvent}
          />
        )}
        {activeView === "calendar" && <CalendarView appointments={appointments} />}
        {activeView === "appointments" && (
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