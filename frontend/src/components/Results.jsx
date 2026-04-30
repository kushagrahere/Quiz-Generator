import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, RefreshCw, Plus, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Results({ resultsData }) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    if (!resultsData) {
      navigate('/');
      return;
    }

    const saveResult = async () => {
      try {
        await fetch('http://localhost:3001/api/progress/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: resultsData.topic,
            score: resultsData.score,
            total: resultsData.total,
            percentage: (resultsData.score / resultsData.total) * 100,
            time_taken_seconds: resultsData.timeTaken,
            questions_json: JSON.stringify(resultsData.questions)
          })
        });
      } catch (err) {
        console.error('Failed to save result', err);
      } finally {
        setSaving(false);
      }
    };

    saveResult();
  }, [resultsData, navigate]);

  if (!resultsData) return null;

  const { score, total, questions } = resultsData;
  const percentage = Math.round((score / total) * 100);

  let message = "Review the material and try again 💪";
  if (percentage >= 90) message = "Excellent! 🎉";
  else if (percentage >= 70) message = "Good job! 👍";
  else if (percentage >= 50) message = "Keep practicing 📚";

  const handleDownload = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('quiz-report');
      const opt = {
        margin: 1,
        filename: 'quiz-report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation failed', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-10 text-center space-y-6"
      >
        <Trophy className={`w-24 h-24 mx-auto ${percentage >= 70 ? 'text-yellow-400' : 'text-gray-400'}`} />
        <h1 className="text-5xl font-black">{percentage}%</h1>
        <p className="text-xl text-gray-300">You scored {score} out of {total}</p>
        <p className="text-2xl font-medium text-primary">{message}</p>

        <div className="flex justify-center gap-4 pt-6">
          <button onClick={() => navigate('/quiz')} className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors">
            <RefreshCw className="w-5 h-5" /> Retake Quiz
          </button>
          <button onClick={() => navigate('/')} className="bg-primary hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors">
            <Plus className="w-5 h-5" /> New Quiz
          </button>
          <button onClick={handleDownload} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors">
            <Download className="w-5 h-5" /> Download PDF
          </button>
        </div>
      </motion.div>

      <div id="quiz-report" className="space-y-6">
        <h2 className="text-2xl font-bold mt-12 mb-6">Detailed Review</h2>
        {questions.map((q, idx) => (
          <div key={idx} className="glass-panel p-6 border-l-4" style={{ borderLeftColor: q.isCorrect ? '#10b981' : '#f43f5e' }}>
            <p className="font-bold mb-4">{idx + 1}. {q.question}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {q.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                return (
                <div key={i} className={`p-3 rounded-lg border ${
                  letter === q.correct ? 'bg-emerald-500/20 border-emerald-500 text-emerald-100' : 
                  letter === q.selected && !q.isCorrect ? 'bg-rose-500/20 border-rose-500 text-rose-100' : 
                  'bg-slate-800 border-slate-700 text-gray-400'
                }`}>
                  {letter}) {opt}
                </div>
              )})}
            </div>
            <p className="text-sm text-gray-400 mt-2"><span className="font-semibold text-gray-300">Explanation:</span> {q.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
