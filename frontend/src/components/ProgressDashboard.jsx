import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Trash2, Loader2, Calendar } from 'lucide-react';

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
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  }

  const chartData = [...sessions].reverse().slice(-10).map((s, idx) => ({
    name: `Quiz ${idx + 1}`,
    score: s.percentage,
    topic: s.topic,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Calendar className="text-primary" /> My Progress
        </h1>
        {sessions.length > 0 && (
          <button onClick={clearHistory} className="text-rose-400 hover:text-rose-300 flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 transition-colors">
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="glass-panel p-12 text-center text-gray-400">
          <p className="text-xl">No quizzes taken yet.</p>
          <p className="mt-2 text-sm">Go generate a quiz to start tracking your progress!</p>
        </div>
      ) : (
        <>
          <div className="glass-panel p-6 h-80">
            <h2 className="text-lg font-bold mb-4 text-gray-300">Last 10 Quizzes Score Trend (%)</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-800/50 text-gray-300 text-sm border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Topic</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {sessions.map((session) => (
                    <tr key={session.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                        {new Date(session.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                        {session.topic}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                          session.percentage >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                          session.percentage >= 50 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-rose-500/20 text-rose-400'
                        }`}>
                          {session.score}/{session.total} ({session.percentage}%)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
