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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Generate Smart Quizzes in Seconds
        </h1>
        <p className="text-lg text-gray-400">
          Upload your notes, articles, or lectures and let AI create a personalized quiz to test your knowledge.
        </p>
      </div>

      <div className="glass-panel p-8 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">
            Option 1: Upload a PDF Document
          </label>
          <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-8 hover:bg-slate-800/50 transition-colors flex flex-col items-center justify-center text-center cursor-pointer">
            <input 
              type="file" 
              accept="application/pdf"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setText('');
              }}
            />
            <UploadCloud className="w-12 h-12 text-primary mb-3" />
            {file ? (
              <span className="text-emerald-400 font-medium">{file.name}</span>
            ) : (
              <>
                <span className="text-gray-300 font-medium mb-1">Click to upload or drag and drop</span>
                <span className="text-sm text-gray-500">PDF up to 10MB</span>
              </>
            )}
          </div>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-600"></div>
          <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">OR</span>
          <div className="flex-grow border-t border-slate-600"></div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Option 2: Paste Raw Text
          </label>
          <textarea
            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={6}
            placeholder="Paste your study material here..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value) setFile(null);
            }}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || (!text && !file)}
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold py-4 px-8 rounded-xl transition-all transform active:scale-[0.98] flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Generating Quiz...
            </>
          ) : (
            'Generate Magic Quiz ✨'
          )}
        </button>
      </div>
    </motion.div>
  );
}
