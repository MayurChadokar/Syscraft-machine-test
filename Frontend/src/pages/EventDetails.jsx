import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Globe, Loader2, CheckCircle, ArrowLeft, X } from 'lucide-react';
import toast from 'react-hot-toast';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const [showRegForm, setShowRegForm] = useState(false);
  const [regData, setRegData] = useState({ 
    name: user?.name || '', 
    email: user?.email || '', 
    phone: '', 
    experience: 'beginner' 
  });

  const checkEmailRegistration = async (email) => {
    if (!email || !email.includes('@')) return;
    setIsChecking(true);
    try {
      const res = await api.get(`/register/check/${id}?email=${encodeURIComponent(email)}`);
      if (res.data.isRegistered) {
        setRegistered(true);
      }
    } catch (err) {
      console.error('Check failed', err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      await api.post(`/register/${id}`, regData);
      setRegistered(true);
      setShowRegForm(false);
      toast.success('Registration successful! Check your email for the survey link.', {
        style: { background: '#10b981', color: '#fff' }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-primary-600" /></div>;
  if (!event) return <div className="text-center py-20 text-slate-500 font-bold">Event not found</div>;

  return (
    <div className="max-w-xl mx-auto px-6 py-6 space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/events')}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold group"
      >
        <div className="w-8 h-8 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-slate-50 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em]">Back</span>
      </button>

      {/* Hero Section - More Compact */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 overflow-hidden border border-slate-100/50">
        <div className="h-56 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-8 text-white w-full">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[8px] font-bold uppercase tracking-widest border border-white/10 mb-3">
              {event.mode}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight">{event.title}</h1>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Quick Info Grid - Smaller */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100/80 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary-600 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">Date</p>
                <p className="font-bold text-slate-800 text-xs truncate">{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-100/80 flex items-center gap-4">
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary-600 shrink-0">
                {event.mode === 'online' ? <Globe className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">Venue</p>
                <p className="font-bold text-slate-800 text-xs truncate">{event.location}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
              About Event
            </h3>
            <p className="text-slate-500 leading-relaxed font-medium text-sm opacity-80">
              {event.description}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            {registered ? (
              <div className="bg-emerald-50/50 p-6 rounded-[2rem] border border-emerald-100/80 text-center animate-in zoom-in-95 duration-500">
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <h4 className="text-emerald-900 font-extrabold text-lg">Registration Confirmed</h4>
                <p className="text-emerald-600 font-bold mt-1 text-[11px]">Please check your email for the survey link.</p>
              </div>
            ) : (
              <button 
                onClick={() => setShowRegForm(true)}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-lg shadow-slate-900/10 active:scale-95 transition-all flex items-center justify-center gap-3 hover:bg-slate-800"
              >
                {registering ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register for Event'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-8 sm:p-10 space-y-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Registration</h2>
                  <p className="text-slate-400 font-bold text-[10px] mt-1 uppercase tracking-widest">Join the event</p>
                </div>
                <button onClick={() => setShowRegForm(false)} className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleRegisterSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                       <input 
                        type="email" required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-sm focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                        placeholder="email@example.com"
                        value={regData.email} 
                        onChange={(e) => setRegData({...regData, email: e.target.value})}
                        onBlur={(e) => checkEmailRegistration(e.target.value)}
                      />
                      {isChecking && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary-400" />}
                    </div>
                  </div>
                  
                  {registered ? (
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-xs font-bold animate-in slide-in-from-top-2">
                       This email is already registered. Check your inbox for the survey link.
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text" required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-sm focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                          placeholder="Your Name"
                          value={regData.name} onChange={(e) => setRegData({...regData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input 
                          type="tel" required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 font-bold text-sm focus:bg-white focus:border-primary-400 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all"
                          placeholder="+91"
                          value={regData.phone} onChange={(e) => setRegData({...regData, phone: e.target.value})}
                        />
                      </div>
                    </>
                  )}
                </div>

                {!registered && (
                  <button 
                    type="submit" 
                    disabled={registering || isChecking}
                    className="w-full py-5 rounded-2xl bg-primary-600 text-white font-bold text-base shadow-xl shadow-primary-500/20 active:scale-95 transition-all mt-2"
                  >
                    {registering ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm Registration'}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
