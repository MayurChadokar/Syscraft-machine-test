import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const SurveyForm = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const guestEmail = searchParams.get('email');

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await api.get(`/survey/${eventId}`);
        setSurvey(res.data);
        setAnswers(res.data.questions.map(q => ({ 
          question: q.question, 
          answer: '' 
        })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSurvey();
  }, [eventId]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].answer = value;
    setAnswers(newAnswers);
  };

  const nextStep = () => {
    if (currentStep < survey.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/survey/submit', { 
        eventId, 
        answers, 
        email: user?.email || guestEmail 
      });
      setSubmitted(true);
      toast.success('Survey completed successfully! Check your email for your certificate.', {
        style: { background: '#10b981', color: '#fff' }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-primary-600" /></div>;
  
  if (submitted) return (
    <div className="max-w-md mx-auto text-center space-y-8 py-20 animate-in fade-in zoom-in duration-500">
      <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/5 border border-emerald-100">
        <CheckCircle className="w-16 h-16" />
      </div>
      <div className="space-y-3">
        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Feedback Saved</h2>
        <p className="text-slate-500 font-medium text-lg">Thank you for sharing your thoughts with us.</p>
      </div>
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgb(0,0,0,0.03)]">
        <p className="text-primary-600 font-bold text-xl leading-relaxed">Your certificate has been sent to your registered email address.</p>
      </div>
      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold uppercase tracking-widest text-[10px] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
    </div>
  );

  if (!survey) return <div className="text-center py-20 text-slate-500">No survey available for this event yet.</div>;

  const currentQuestion = survey.questions[currentStep];

  return (
    <div className="max-w-xl mx-auto px-6 py-12 min-h-[85vh] flex flex-col justify-center">
      {/* Progress Section */}
      <div className="mb-14 space-y-5">
        <div className="flex justify-between items-end px-2">
          <div>
            <span className="text-[10px] font-bold text-primary-600 uppercase tracking-[0.25em] mb-2 block">Step {currentStep + 1} of {survey.questions.length}</span>
            <h2 className="text-2xl font-extrabold text-slate-900">Survey Progress</h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-slate-200">{Math.round(((currentStep + 1) / survey.questions.length) * 100)}%</span>
          </div>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-primary-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(99,125,242,0.3)]" 
            style={{ width: `${((currentStep + 1) / survey.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-[0_30px_100px_rgb(0,0,0,0.04)] p-10 md:p-14 border border-slate-100 relative">
        <div className="absolute top-0 left-12 right-12 h-1.5 bg-primary-500 rounded-b-full opacity-10"></div>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-8 animate-in slide-in-from-right-8 fade-in duration-500">
            <label className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-[1.2] tracking-tight block">
              {currentQuestion.question}
              {currentQuestion.required && <span className="text-primary-500 ml-2">*</span>}
            </label>
            
            <div className="mt-4">
              {currentQuestion.type === 'text' ? (
                <textarea 
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 text-lg font-medium focus:bg-white focus:border-primary-400 focus:ring-8 focus:ring-primary-500/5 transition-all min-h-[220px] outline-none shadow-inner" 
                  placeholder="Share your detailed feedback here..."
                  required={currentQuestion.required}
                  value={answers[currentStep]?.answer || ''}
                  onChange={(e) => handleAnswerChange(currentStep, e.target.value)}
                ></textarea>
              ) : (
                <div className="space-y-3.5">
                  {currentQuestion.options.map((opt, oIdx) => (
                    <label key={oIdx} className={`flex items-center gap-5 p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer group ${
                      answers[currentStep]?.answer === opt 
                        ? 'border-primary-500 bg-primary-50/30 text-primary-900 shadow-xl shadow-primary-500/5' 
                        : 'border-slate-50 bg-slate-50/50 hover:border-slate-200 hover:bg-white'
                    }`}>
                      <input 
                        type="radio" 
                        name={`question-${currentStep}`} 
                        value={opt}
                        required={currentQuestion.required}
                        className="hidden"
                        onChange={(e) => handleAnswerChange(currentStep, e.target.value)}
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                        answers[currentStep]?.answer === opt ? 'border-primary-500 bg-primary-500' : 'border-slate-200 bg-white'
                      }`}>
                        {answers[currentStep]?.answer === opt && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <span className="font-bold text-lg opacity-90">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {currentStep > 0 && (
              <button 
                type="button" 
                onClick={prevStep}
                className="flex-1 py-5 px-8 rounded-3xl bg-slate-50 text-slate-500 font-bold hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
              >
                Previous
              </button>
            )}
            
            {currentStep < survey.questions.length - 1 ? (
              <button 
                type="button" 
                onClick={nextStep}
                disabled={currentQuestion.required && !answers[currentStep]?.answer}
                className="flex-[2] py-5 px-8 rounded-3xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-xl shadow-slate-900/10"
              >
                Next Question
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={submitting || (currentQuestion.required && !answers[currentStep]?.answer)} 
                className="flex-[2] py-5 px-8 rounded-3xl bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 transition-all active:scale-95 shadow-2xl shadow-primary-500/20 disabled:opacity-30"
              >
                {submitting ? <Loader2 className="w-7 h-7 animate-spin mx-auto" /> : 'Complete Survey'}
              </button>
            )}
          </div>
        </form>
      </div>
      <p className="text-center text-[10px] text-slate-400 mt-12 font-bold uppercase tracking-[0.3em] opacity-40">EventHub • Feedback System</p>
    </div>
  );
};

export default SurveyForm;
