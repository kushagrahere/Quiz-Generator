import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const minutes = Math.floor(resultsData.timeTaken / 60);
  const seconds = resultsData.timeTaken % 60;
  const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const correctCount = questions.filter(q => q.isCorrect).length;
  const wrongCount = total - correctCount;

  return (
    <main className="max-w-[1280px] mx-auto px-margin py-xl flex flex-col gap-xl w-full" id="quiz-report">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-md">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-48 h-48 flex items-center justify-center rounded-full p-2 score-ring shadow-[0_0_30px_rgba(124,58,237,0.3)]"
        >
          <div className="w-full h-full bg-background rounded-full flex flex-col items-center justify-center border border-white/10">
            <span className="text-h1 font-h1 text-white">{score}/{total}</span>
            <span className="text-label-md font-label-md text-violet-400 uppercase tracking-widest">{percentage}% Score</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-violet-600/20 border border-violet-500/30 px-6 py-2 rounded-full"
        >
          <span className="text-h3 font-h3 text-white">{message}</span>
        </motion.div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-md rounded-xl flex items-center gap-md">
          <div className="bg-violet-500/10 p-3 rounded-lg">
            <span className="material-symbols-outlined text-violet-500 text-3xl">timer</span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-slate-400">Time Taken</p>
            <p className="text-h3 font-h3 text-white">{timeStr}</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-md rounded-xl flex items-center gap-md">
          <div className="bg-emerald-500/10 p-3 rounded-lg">
            <span className="material-symbols-outlined text-emerald-500 text-3xl">check_circle</span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-slate-400">Correct</p>
            <p className="text-h3 font-h3 text-white">{correctCount}</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-md rounded-xl flex items-center gap-md">
          <div className="bg-rose-500/10 p-3 rounded-lg">
            <span className="material-symbols-outlined text-rose-500 text-3xl">cancel</span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-slate-400">Wrong</p>
            <p className="text-h3 font-h3 text-white">{wrongCount}</p>
          </div>
        </motion.div>
      </section>

      {/* Review Section */}
      <section className="flex flex-col gap-md">
        <h2 className="text-h2 font-h2 text-white">Question Review</h2>
        <div className="flex flex-col gap-sm">
          {questions.map((q, idx) => (
            <motion.div 
              initial={{ x: -20, opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              transition={{ delay: 0.6 + (idx * 0.1) }}
              key={idx} 
              className={`glass-card p-md rounded-xl flex flex-col gap-sm border-l-4 ${q.isCorrect ? 'border-[#22c55e]' : 'border-[#ef4444]'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-md items-start">
                  <span className="text-label-md font-label-md text-slate-500 w-8 pt-1">#{idx + 1}</span>
                  <p className="text-body-lg font-bold text-white">{q.question}</p>
                </div>
                <span className={`material-symbols-outlined ${q.isCorrect ? 'text-[#22c55e]' : 'text-[#ef4444]'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {q.isCorrect ? 'check_circle' : 'cancel'}
                </span>
              </div>
              
              <div className="pl-14 grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {q.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  return (
                    <div key={i} className={`p-3 rounded-lg border text-body-md ${
                      letter === q.correct ? 'bg-[#22c55e]/20 border-[#22c55e] text-[#22c55e]' : 
                      letter === q.selected && !q.isCorrect ? 'bg-[#ef4444]/20 border-[#ef4444] text-[#ef4444]' : 
                      'bg-white/5 border-white/10 text-slate-300'
                    }`}>
                      {letter}) {opt}
                    </div>
                  );
                })}
              </div>
              <div className="pl-14 mt-2">
                <div className="bg-violet-600/10 border border-violet-500/20 rounded-lg p-3 text-sm text-violet-100 flex gap-2">
                  <span className="material-symbols-outlined text-violet-400 text-lg">info</span>
                  <p>
                    <span className="font-bold text-violet-400">Explanation:</span> {q.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <section className="flex flex-col md:flex-row justify-center items-center gap-md pt-lg pb-xl" data-html2canvas-ignore="true">
        <button onClick={() => navigate('/quiz')} className="w-full md:w-auto px-xl py-4 rounded-xl border border-violet-500 text-violet-400 font-bold hover:bg-violet-500/10 transition-colors active:scale-95 transform">
          Retake Quiz
        </button>
        <button onClick={() => navigate('/')} className="w-full md:w-auto px-xl py-4 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-colors shadow-lg shadow-violet-600/30 active:scale-95 transform">
          Generate New Quiz
        </button>
        <button onClick={handleDownload} className="w-full md:w-auto px-xl py-4 rounded-xl border border-emerald-500 text-emerald-400 font-bold hover:bg-emerald-500/10 transition-colors active:scale-95 transform flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">download</span> Download PDF
        </button>
      </section>

      {/* Visual Polish: Decorative Elements */}
      <div className="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    </main>
  );
}
