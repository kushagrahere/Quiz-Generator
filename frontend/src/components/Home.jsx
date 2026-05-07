import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home({ setQuizData }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!text.trim() && !file) {
      setError('Please provide text or upload a PDF to generate a quiz.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else {
      formData.append('text', text);
    }

    try {
      const response = await fetch('http://localhost:3001/api/quiz/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      setQuizData(data);
      navigate('/quiz');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen hero-gradient flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-[1280px] mx-auto px-margin pt-xl pb-lg text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 mb-base"
          >
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <span className="text-label-sm font-label-sm uppercase tracking-widest">Next-Gen AI Engine</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-h1 text-h1 text-white mb-md max-w-4xl mx-auto"
          >
            Turn Any Text Into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-primary">Quiz Instantly</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto"
          >
            Paste notes, upload a PDF, and let AI generate 10 questions in seconds. Perfect for students, teachers, and corporate training.
          </motion.p>
        </section>

        {error && (
          <div className="max-w-[1280px] mx-auto px-margin mb-6">
            <div className="bg-error-container/20 border border-error/50 text-error p-4 rounded-lg flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              {error}
            </div>
          </div>
        )}

        {/* Input Section */}
        <section className="max-w-[1280px] mx-auto px-margin pb-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {/* Text Input Card */}
            <div className="glass-card rounded-xl p-md flex flex-col gap-sm">
              <div className="flex items-center gap-2 mb-xs">
                <span className="material-symbols-outlined text-primary">notes</span>
                <h3 className="font-h3 text-h3 text-white">Paste Text</h3>
              </div>
              <textarea 
                className="w-full h-64 bg-slate-950/40 border border-white/10 rounded-lg p-md text-body-md text-on-surface placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all resize-none" 
                placeholder="Paste your text, lecture notes, or article here..."
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (e.target.value) setFile(null);
                }}
              ></textarea>
            </div>

            {/* PDF Upload Card */}
            <div className="glass-card rounded-xl p-md flex flex-col gap-sm">
              <div className="flex items-center gap-2 mb-xs">
                <span className="material-symbols-outlined text-primary">picture_as_pdf</span>
                <h3 className="font-h3 text-h3 text-white">Upload PDF</h3>
              </div>
              <label className="w-full h-64 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center gap-4 hover:border-violet-500/50 hover:bg-white/5 transition-all cursor-pointer group relative">
                <input 
                  type="file" 
                  accept="application/pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                    setText('');
                  }}
                />
                <div className="w-16 h-16 rounded-full bg-violet-600/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-violet-400 text-3xl">upload_file</span>
                </div>
                <div className="text-center">
                  {file ? (
                    <p className="font-body-md text-emerald-400">{file.name}</p>
                  ) : (
                    <>
                      <p className="font-body-md text-white">Drag & drop your PDF here</p>
                      <p className="font-label-sm text-slate-500 mt-1">or click to browse from files</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-xl flex justify-center">
            <button 
              onClick={handleGenerate}
              disabled={loading || (!text && !file)}
              className="group relative inline-flex items-center gap-3 bg-primary-container text-white px-12 py-5 rounded-full font-h3 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Quiz ⚡
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-t border-white/5 bg-slate-950/30 backdrop-blur-md">
          <div className="max-w-[1280px] mx-auto px-margin py-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg text-center">
              <div className="flex flex-col gap-2">
                <span className="text-h2 font-h2 text-white">10,000+</span>
                <span className="text-label-md font-label-md text-slate-400 uppercase tracking-widest">Quizzes Generated</span>
              </div>
              <div className="flex flex-col gap-2 border-y md:border-y-0 md:border-x border-white/10 py-md md:py-0">
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-violet-400">check_circle</span>
                  <span className="text-h2 font-h2 text-white">Universal</span>
                </div>
                <span className="text-label-md font-label-md text-slate-400 uppercase tracking-widest">PDF & Text Support</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-h2 font-h2 text-white">Instant</span>
                <span className="text-label-md font-label-md text-slate-400 uppercase tracking-widest">AI Results</span>
              </div>
            </div>
          </div>
        </section>

        {/* Illustration Placeholder */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-[-1]"></div>
      </main>

      {/* Footer Component */}
      <footer className="w-full py-8 px-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950 border-t border-white/5 text-xs font-['Inter'] mt-auto">
        <div className="flex flex-col gap-1 items-center md:items-start">
          <span className="text-sm font-semibold text-slate-300">QuizAI ⚡</span>
          <p className="text-slate-500">© 2024 QuizAI. Precision AI Generation.</p>
        </div>
        <div className="flex gap-8">
          <a href="#" className="text-slate-500 hover:text-violet-400 transition-colors">Privacy Policy</a>
          <a href="#" className="text-slate-500 hover:text-violet-400 transition-colors">Terms of Service</a>
          <a href="#" className="text-slate-500 hover:text-violet-400 transition-colors">API Docs</a>
          <a href="#" className="text-slate-500 hover:text-violet-400 transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
