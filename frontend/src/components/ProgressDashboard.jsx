import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function ProgressDashboard() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/progress');
      const data = await res.json();
      setSessions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all history?')) return;
    try {
      await fetch('http://localhost:3001/api/progress', { method: 'DELETE' });
      setSessions([]);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[calc(100vh-200px)]">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">autorenew</span>
      </div>
    );
  }

  const chartData = [...sessions].reverse().slice(-10).map((s, idx) => ({
    name: `Q${idx + 1}`,
    score: s.percentage,
    topic: s.topic,
  }));

  const totalQuizzes = sessions.length;
  const averageScore = totalQuizzes > 0 ? Math.round(sessions.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes) : 0;
  const bestScore = totalQuizzes > 0 ? Math.max(...sessions.map(s => s.percentage)) : 0;
  const totalQuestions = sessions.reduce((acc, curr) => acc + curr.total, 0);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <main className="max-w-[1280px] mx-auto px-margin py-xl w-full">
      {/* Header */}
      <header className="mb-xl">
        <h1 className="font-h1 text-h1 text-on-surface mb-xs">My Progress</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant opacity-80">Track your learning journey and AI-generated quiz insights.</p>
      </header>

      {/* Summary Cards Bento Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
        <div className="glass-card glass-card-hover p-md rounded-xl flex flex-col gap-2">
          <span className="text-violet-400 material-symbols-outlined">analytics</span>
          <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total Quizzes</p>
          <p className="text-h2 font-h2 text-on-surface">{totalQuizzes}</p>
        </div>
        <div className="glass-card glass-card-hover p-md rounded-xl flex flex-col gap-2">
          <span className="text-violet-400 material-symbols-outlined">monitoring</span>
          <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Average Score</p>
          <p className="text-h2 font-h2 text-on-surface">{averageScore}%</p>
        </div>
        <div className="glass-card glass-card-hover p-md rounded-xl flex flex-col gap-2">
          <span className="text-violet-400 material-symbols-outlined">military_tech</span>
          <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Best Score</p>
          <p className="text-h2 font-h2 text-on-surface">{bestScore}%</p>
        </div>
        <div className="glass-card glass-card-hover p-md rounded-xl flex flex-col gap-2">
          <span className="text-violet-400 material-symbols-outlined">quiz</span>
          <p className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">Total Questions</p>
          <p className="text-h2 font-h2 text-on-surface">{totalQuestions}</p>
        </div>
      </section>

      {totalQuizzes === 0 ? (
        <div className="glass-card p-12 text-center rounded-xl mb-xl">
          <p className="text-h3 font-h3 text-slate-300">No quizzes taken yet.</p>
          <p className="mt-2 text-body-md text-slate-400">Generate your first quiz to start tracking your progress!</p>
        </div>
      ) : (
        <>
          {/* Analytics Chart */}
          <section className="glass-card rounded-xl p-xl mb-xl">
            <div className="flex justify-between items-center mb-lg">
              <div>
                <h3 className="font-h3 text-h3 text-on-surface">Performance Analytics</h3>
                <p className="font-label-md text-label-md text-on-surface-variant">Your last 10 quiz results</p>
              </div>
            </div>
            <div className="h-64 px-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#4c1d95" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                    itemStyle={{ color: '#d2bbff', fontWeight: 'bold' }}
                    formatter={(value) => [`${value}%`, 'Score']}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.score === 100 ? '#a78bfa' : 'url(#colorScore)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* History Table */}
          <section className="glass-card rounded-xl overflow-hidden mb-xl">
            <div className="p-lg flex justify-between items-center border-b border-white/5">
              <h3 className="font-h3 text-h3 text-on-surface">History</h3>
              <button onClick={clearHistory} className="px-4 py-2 border border-error text-error text-label-md font-label-md rounded-lg hover:bg-error/10 transition-colors">Clear History</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-lg py-4">Date</th>
                    <th className="px-lg py-4">Topic</th>
                    <th className="px-lg py-4">Score</th>
                    <th className="px-lg py-4">Percentage</th>
                    <th className="px-lg py-4">Time Taken</th>
                  </tr>
                </thead>
                <tbody className="text-body-md font-body-md divide-y divide-white/5">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-lg py-4 whitespace-nowrap text-slate-300">
                        {new Date(session.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-lg py-4 font-semibold text-primary max-w-xs truncate">
                        {session.topic || 'Quiz'}
                      </td>
                      <td className="px-lg py-4 text-slate-200">
                        {session.score}/{session.total}
                      </td>
                      <td className="px-lg py-4">
                        <span className={`px-2 py-1 rounded border text-sm font-semibold ${
                          session.percentage >= 70 ? 'bg-[#22c55e]/10 border-[#22c55e]/20 text-[#4ade80]' :
                          session.percentage >= 50 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' :
                          'bg-[#ef4444]/10 border-[#ef4444]/20 text-[#f87171]'
                        }`}>
                          {session.percentage}%
                        </span>
                      </td>
                      <td className="px-lg py-4 text-slate-400">
                        {formatTime(session.time_taken_seconds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* Footer Component */}
      <footer className="mt-xl w-full py-8 px-0 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5">
        <div className="text-sm font-semibold text-slate-300">QuizAI ⚡ Precision AI Generation.</div>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-slate-500 font-['Inter'] hover:text-violet-400 transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs text-slate-500 font-['Inter'] hover:text-violet-400 transition-colors">Terms of Service</a>
          <a href="#" className="text-xs text-slate-500 font-['Inter'] hover:text-violet-400 transition-colors">API Docs</a>
          <a href="#" className="text-xs text-slate-500 font-['Inter'] hover:text-violet-400 transition-colors">Support</a>
        </div>
        <p className="text-xs text-slate-500 font-['Inter']">© 2024 QuizAI.</p>
      </footer>
    </main>
  );
}
