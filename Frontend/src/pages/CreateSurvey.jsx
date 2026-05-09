import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Trash2, Save, Loader2, Type, List } from 'lucide-react';

const CreateSurvey = () => {
  const { eventId } = useParams();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', type: 'text', required: true, options: [] }
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addQuestion = () => {
    setQuestions([...questions, { question: '', type: 'text', required: true, options: [] }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/survey/create', { title, eventId, questions });
      navigate('/admin');
    } catch (err) {
      alert('Failed to create survey');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Design Survey</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="label">Survey Title</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Post-Event Feedback" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              Questions
            </h3>
            
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="p-6 bg-slate-50 rounded-xl border border-slate-200 relative group">
                <button 
                  type="button" 
                  onClick={() => removeQuestion(qIdx)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="label text-xs uppercase tracking-wider text-slate-500">Question {qIdx + 1}</label>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Enter question text..."
                      value={q.question}
                      onChange={(e) => handleQuestionChange(qIdx, 'question', e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <label className="label text-xs uppercase tracking-wider text-slate-500">Type</label>
                    <div className="flex gap-2">
                      <button 
                        type="button"
                        onClick={() => handleQuestionChange(qIdx, 'type', 'text')}
                        className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 font-medium ${
                          q.type === 'text' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Type className="w-4 h-4" /> Text
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleQuestionChange(qIdx, 'type', 'mcq')}
                        className={`flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 font-medium ${
                          q.type === 'mcq' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <List className="w-4 h-4" /> MCQ
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-7">
                    <input 
                      type="checkbox" 
                      id={`req-${qIdx}`}
                      checked={q.required}
                      onChange={(e) => handleQuestionChange(qIdx, 'required', e.target.checked)}
                      className="w-4 h-4 text-primary-600 rounded"
                    />
                    <label htmlFor={`req-${qIdx}`} className="text-sm font-medium text-slate-700">Required</label>
                  </div>

                  {q.type === 'mcq' && (
                    <div className="md:col-span-2 space-y-3 pt-4 border-t border-slate-200 mt-2">
                      <label className="label text-xs uppercase tracking-wider text-slate-500">Options</label>
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-2">
                          <input 
                            type="text" 
                            className="input py-1.5" 
                            placeholder={`Option ${oIdx + 1}`}
                            value={opt}
                            onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                            required 
                          />
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => addOption(qIdx)}
                        className="text-primary-600 text-sm font-bold flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-4 h-4" /> Add Option
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={addQuestion} className="btn-secondary flex-1 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add Question
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Survey</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSurvey;
