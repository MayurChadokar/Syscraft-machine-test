import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, ClipboardCheck, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-20 py-10">
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Manage Events, Surveys & <span className="text-primary-600">Certificates</span> with Ease
        </h1>
        <p className="text-xl text-slate-500 leading-relaxed">
          The all-in-one platform for organizers and participants. Create events, gather feedback, and automate certificate delivery.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link to="/events" className="btn-primary px-8 py-4 text-lg flex items-center gap-2">
            Explore Events <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/events" className="btn-secondary px-8 py-4 text-lg">
            Browse Events
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8">
        <div className="card text-center space-y-4">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Event Management</h3>
          <p className="text-slate-500">Easily create and manage online/offline events with custom locations and dates.</p>
        </div>
        <div className="card text-center space-y-4">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Dynamic Surveys</h3>
          <p className="text-slate-500">Create custom feedback forms for each event to gather valuable participant insights.</p>
        </div>
        <div className="card text-center space-y-4">
          <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">Auto Certificates</h3>
          <p className="text-slate-500">Automatically generate and deliver professional PDF certificates after survey completion.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
