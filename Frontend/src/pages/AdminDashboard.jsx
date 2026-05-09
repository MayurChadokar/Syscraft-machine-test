import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Calendar, Users, ClipboardCheck, TrendingUp, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0, totalResponses: 0 });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, eventsRes] = await Promise.all([
          api.get('/reports/stats'),
          api.get('/reports/events')
        ]);
        setStats(statsRes.data);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cards = [
    { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'bg-blue-500' },
    { label: 'Registrations', value: stats.totalRegistrations, icon: Users, color: 'bg-purple-500' },
    { label: 'Survey Responses', value: stats.totalResponses, icon: ClipboardCheck, color: 'bg-green-500' },
    { label: 'Avg. Rating', value: '4.8/5', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="card relative overflow-hidden group">
            <div className={`absolute right-0 top-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${card.color}`}></div>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${card.color} shadow-lg shadow-current/20`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{card.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : card.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Events Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Recent Events</h2>
          <Link to="/admin/events/create" className="btn-primary flex items-center gap-2">
            Create New Event
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-100">
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Event Name</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Date</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Mode</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Registrations</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Surveys</th>
                <th className="px-4 py-3 text-sm font-semibold text-slate-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8">Loading data...</td></tr>
              ) : events.map((event) => (
                <tr key={event._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-medium text-slate-900">{event.title}</td>
                  <td className="px-4 py-4 text-slate-500">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      event.mode === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {event.mode}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 font-semibold">{event.totalRegistrations}</td>
                  <td className="px-4 py-4 text-slate-600 font-semibold">{event.totalSurveySubmissions}</td>
                  <td className="px-4 py-4 space-x-3">
                    {!event.surveyId ? (
                      <Link to={`/admin/survey/create/${event._id}`} className="text-orange-600 hover:text-orange-700 font-medium">
                        Add Survey
                      </Link>
                    ) : (
                      <span className="text-green-600 font-medium">Survey Added</span>
                    )}
                    <Link to={`/admin/registrations/${event._id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                      Participants
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
