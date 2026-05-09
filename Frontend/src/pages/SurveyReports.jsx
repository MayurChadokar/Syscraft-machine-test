import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { ClipboardList, User, Calendar, Loader2 } from 'lucide-react';

const SurveyReports = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/reports/survey');
        setResponses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Survey Responses</h1>
          <p className="text-slate-500">Analyze feedback from your participants</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-100">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Participant</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Event</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Answers</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Registered On</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Submitted On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {responses.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-12 text-slate-400">No survey responses yet.</td></tr>
              ) : responses.map((res) => (
                <tr key={res._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-6 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                        {(res.guestName || res.userId?.name || 'P').charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{res.guestName || res.userId?.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{res.guestEmail || res.userId?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 align-top">
                    <span className="text-slate-600 font-medium">{res.eventId?.title}</span>
                  </td>
                  <td className="px-6 py-6 align-top">
                    <div className="space-y-3 min-w-[300px]">
                      {res.answers.map((ans, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100/80">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{ans.question}</p>
                          <p className="text-sm text-slate-700 font-semibold leading-tight">{ans.answer}</p>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-slate-500 text-xs align-top font-medium">
                    {res.registeredAt ? (
                        <>
                            <div>{new Date(res.registeredAt).toLocaleDateString()}</div>
                            <div className="text-[10px] opacity-60">{new Date(res.registeredAt).toLocaleTimeString()}</div>
                        </>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-6 text-slate-500 text-xs align-top">
                    <div className="font-medium">{new Date(res.submittedAt || res.createdAt).toLocaleDateString()}</div>
                    <div className="text-[10px] opacity-60">{new Date(res.submittedAt || res.createdAt).toLocaleTimeString()}</div>
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

export default SurveyReports;
