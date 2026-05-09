import React from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Award, Download, Share2 } from 'lucide-react';

const CertificateDownload = () => {
  const { eventId } = useParams();
  const { user } = useAuth();

  const handleDownload = async () => {
    try {
      const response = await api.get(`/certificate/${user.id}/${eventId}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate_${eventId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Failed to download certificate');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="card text-center space-y-8 p-12">
        <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-12 h-12" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">Your Certificate is Ready!</h1>
          <p className="text-slate-500 text-lg">Congratulations on completing the survey. You can now download your official certificate of participation.</p>
        </div>
        
        {/* Preview Placeholder */}
        <div className="aspect-[1.414/1] w-full max-w-md mx-auto border-4 border-slate-50 rounded-xl bg-slate-100 flex flex-col items-center justify-center p-8 text-slate-400 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-200/50 to-transparent"></div>
            <Award className="w-20 h-20 mb-4 opacity-20" />
            <div className="h-4 w-3/4 bg-slate-200 rounded-full mb-4"></div>
            <div className="h-4 w-1/2 bg-slate-200 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center bg-primary-600/0 group-hover:bg-primary-600/5 transition-all"></div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            onClick={handleDownload}
            className="btn-primary px-8 py-4 flex items-center justify-center gap-3 text-lg"
          >
            <Download className="w-5 h-5" /> Download PDF
          </button>
          <button className="btn-secondary px-8 py-4 flex items-center justify-center gap-3 text-lg">
            <Share2 className="w-5 h-5" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateDownload;
