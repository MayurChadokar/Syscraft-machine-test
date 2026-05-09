import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, MapPin, Globe, ArrowRight, Search, Filter } from 'lucide-react';

const EventListing = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 space-y-10">
      {/* Search & Header */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Events</h1>
            <p className="text-slate-400 font-medium text-sm mt-1">Find and register for premium events</p>
          </div>
          <button className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm hover:text-primary-600 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search events..." 
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 font-medium text-base focus:ring-4 focus:ring-primary-500/5 focus:border-primary-400 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {['All Events', 'Online', 'Offline'].map((cat, i) => (
          <button 
            key={i} 
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
              i === 0 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-5">
        {loading ? (
          <div className="space-y-5">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[2rem]"></div>)}
          </div>
        ) : (
          <div className="space-y-5">
            {events.map((event) => (
              <Link 
                key={event._id} 
                to={`/events/${event._id}`}
                className="group relative block bg-white rounded-[2rem] p-5 border border-slate-100/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex gap-6 items-center">
                  {/* Left Icon/Date Block - Smaller */}
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100/50 group-hover:bg-primary-50 transition-colors">
                    <span className="text-primary-600 font-bold text-xl leading-none">{new Date(event.date).getDate()}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                  </div>

                  {/* Info Block */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest border ${
                        event.mode === 'online' 
                          ? 'bg-indigo-50 text-indigo-600 border-indigo-100' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {event.mode}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                        <MapPin className="w-3 h-3" /> <span className="truncate max-w-[80px]">{event.location || 'Remote'}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                      {event.title}
                    </h3>
                    
                    <p className="text-slate-500 text-xs font-medium line-clamp-1 opacity-70">
                      {event.description}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListing;
