import { Link } from 'react-router-dom';
import { BrainCircuit, LineChart } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass-panel rounded-none border-t-0 border-x-0 border-b border-white/10 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-indigo-400 transition-colors">
        <BrainCircuit className="w-8 h-8" />
        <span>QuizAI</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">Home</Link>
        <Link to="/progress" className="flex items-center gap-2 bg-card hover:bg-slate-700 px-4 py-2 rounded-lg border border-white/10 transition-colors text-gray-300 hover:text-white">
          <LineChart className="w-4 h-4" />
          <span>My Progress</span>
        </Link>
      </div>
    </nav>
  );
}
