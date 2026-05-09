import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Calendar, MapPin, AlignLeft, Type, Loader2, Save } from 'lucide-react';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', date: '', mode: 'online', location: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/events/create', formData);
      navigate('/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Event</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label">Event Title</label>
              <div className="relative">
                <Type className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input name="title" type="text" className="input pl-11" placeholder="e.g. Annual Tech Summit 2026" onChange={handleChange} required />
              </div>
            </div>
            
            <div>
              <label className="label">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input name="date" type="date" className="input pl-11" onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="label">Mode</label>
              <select name="mode" className="input" onChange={handleChange} value={formData.mode}>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">Location / Meeting Link</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input name="location" type="text" className="input pl-11" placeholder="e.g. Mumbai, India or Zoom Link" onChange={handleChange} required />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="label">Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <textarea name="description" rows="4" className="input pl-11" placeholder="Tell us more about the event..." onChange={handleChange} required></textarea>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Create Event</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
