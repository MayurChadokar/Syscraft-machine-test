import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, Menu, X } from 'lucide-react';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200 transition-all group-hover:scale-105">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-xl font-extrabold text-slate-900 tracking-tighter">EventHub</span>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              <Link to="/events" className="text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-all">Events</Link>
              {user ? (
                <div className="flex items-center gap-6">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-slate-500 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-all">Admin Panel</Link>
                  )}
                  <div className="h-8 w-px bg-slate-100"></div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-slate-900">{user.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user.role}</span>
                    </div>
                    <button onClick={handleLogout} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all hover:bg-red-50">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/admin/login" className="btn-secondary">Admin Login</Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-50 animate-in slide-in-from-top-4 duration-500">
            <div className="px-6 py-8 space-y-6">
              <Link to="/events" className="block text-2xl font-extrabold text-slate-900" onClick={() => setIsMenuOpen(false)}>Events</Link>
              {user ? (
                <div className="space-y-6 pt-6 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center font-bold text-xl">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{user.name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{user.role}</p>
                    </div>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="block text-lg font-bold text-slate-600" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</Link>
                  )}
                  <button 
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="flex items-center gap-3 text-red-500 font-bold"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/admin/login" className="block text-lg font-bold text-slate-600" onClick={() => setIsMenuOpen(false)}>Admin Login</Link>
              )}
            </div>
          </div>
        )}
      </nav>
      
      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 grayscale opacity-50">
            <Calendar className="w-5 h-5" />
            <span className="font-extrabold text-lg tracking-tighter">EventHub</span>
          </div>
          <div className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
            &copy; 2026 Professional Event Management
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
