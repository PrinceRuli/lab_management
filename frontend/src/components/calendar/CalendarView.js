import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [laboratories, setLaboratories] = useState([]);
  const [filters, setFilters] = useState({
    laboratory: 'all',
    view: 'month'
  });

  useEffect(() => {
    fetchLaboratories();
    fetchCalendarEvents();
  }, [filters]);

  const fetchLaboratories = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/laboratories');
      setLaboratories(response.data.data);
    } catch (error) {
      console.error('Error fetching laboratories:', error);
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.laboratory !== 'all') {
        params.append('laboratory', filters.laboratory);
      }

      const response = await axios.get(`http://localhost:5001/api/bookings/calendar?${params}`);
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.color || '#3B82F6';
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      fontSize: '12px'
    };
    return { style };
  };

  const handleSelectEvent = (event) => {
    alert(`
      Laboratory: ${event.laboratory} (${event.labCode})
      Purpose: ${event.purpose}
      User: ${event.user}
      Time: ${moment(event.start).format('HH:mm')} - ${moment(event.end).format('HH:mm')}
      Attendees: ${event.attendees}
      Status: ${event.status}
    `);
  };

  const handleSelectSlot = (slotInfo) => {
    if (user?.permissions?.canCreateBookings) {
      const date = moment(slotInfo.start).format('YYYY-MM-DD');
      const startTime = moment(slotInfo.start).format('HH:mm');
      const endTime = moment(slotInfo.end).format('HH:mm');
      
      alert(`Create booking for:\nDate: ${date}\nTime: ${startTime} - ${endTime}`);
      // You can redirect to booking form here
      // window.location.href = `/book?date=${date}&start=${startTime}&end=${endTime}`;
    } else {
      alert('You need permission to create bookings');
    }
  };

  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };

    const changeView = (view) => {
      toolbar.onView(view);
      setFilters(prev => ({ ...prev, view }));
    };

    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 bg-white rounded-lg shadow border">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <button
            className="btn btn-sm bg-gray-200 hover:bg-gray-300"
            onClick={goToBack}
          >
            ‹
          </button>
          <button
            className="btn btn-sm bg-gray-200 hover:bg-gray-300"
            onClick={goToCurrent}
          >
            Today
          </button>
          <button
            className="btn btn-sm bg-gray-200 hover:bg-gray-300"
            onClick={goToNext}
          >
            ›
          </button>
          <span className="text-lg font-bold ml-2">
            {moment(toolbar.date).format('MMMM YYYY')}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filters.laboratory}
            onChange={(e) => setFilters({ ...filters, laboratory: e.target.value })}
            className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Laboratories</option>
            {laboratories.map(lab => (
              <option key={lab._id} value={lab._id}>
                {lab.name}
              </option>
            ))}
          </select>

          <div className="flex bg-gray-100 rounded-lg p-1">
            {['month', 'week', 'day', 'agenda'].map(view => (
              <button
                key={view}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  toolbar.view === view
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => changeView(view)}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={fetchCalendarEvents}
            className="bg-cyan-600 text-white px-3 py-1 rounded text-sm hover:bg-cyan-700"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Laboratory Calendar</h1>
        <p className="text-gray-600">
          View all laboratory bookings and schedules in one place
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow border">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm text-gray-700">Approved</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-amber-500 rounded mr-2"></div>
          <span className="text-sm text-gray-700">Pending</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span className="text-sm text-gray-700">Rejected</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span className="text-sm text-gray-700">New Booking</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow border">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable={user?.permissions?.canCreateBookings}
          components={{
            toolbar: CustomToolbar
          }}
          views={['month', 'week', 'day', 'agenda']}
          defaultView="month"
          messages={{
            next: "Next",
            previous: "Previous",
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
            agenda: "Agenda",
            date: "Date",
            time: "Time",
            event: "Event",
            noEventsInRange: "No bookings in this range"
          }}
        />
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-gray-900">{events.length}</div>
          <div className="text-gray-600">Total Bookings</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-green-600">
            {events.filter(e => e.status === 'approved').length}
          </div>
          <div className="text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-amber-600">
            {events.filter(e => e.status === 'pending').length}
          </div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border text-center">
          <div className="text-2xl font-bold text-blue-600">
            {laboratories.length}
          </div>
          <div className="text-gray-600">Laboratories</div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;