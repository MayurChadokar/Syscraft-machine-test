import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { Users, Mail, Phone, CheckCircle, XCircle, ArrowLeft, Download, Loader2 } from 'lucide-react';

const EventRegistrations = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, eventRes] = await Promise.all([
          api.get(`/register/${eventId}`),
          api.get(`/events/${eventId}`)
        ]);
        setRegistrations(regRes.data);
        setEvent(eventRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Event Registrations</h1>
            <p className="text-slate-500">Participants for: <span className="font-semibold text-primary-600">{event?.title}</span></p>
          </div>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-100">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Participant Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Phone Number</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Event Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Survey Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrations.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-slate-400">No registrations found for this event.</td></tr>
              ) : registrations.map((reg) => (
                <tr key={reg._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                        {(reg.name || reg.userId?.name || 'G').charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900">{reg.name || reg.userId?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {reg.email || reg.userId?.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {reg.phone || reg.userId?.phone}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {event?.title}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {reg.surveySubmitted ? (
                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-100">
                          <CheckCircle className="w-3.5 h-3.5" /> Yes
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-3 py-1 rounded-full text-xs font-bold uppercase border border-slate-100">
                          <XCircle className="w-3.5 h-3.5" /> No
                        </div>
                      )}
                    </div>
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

export default EventRegistrations;
