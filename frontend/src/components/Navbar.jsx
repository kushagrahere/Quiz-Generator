import { Link } from 'react-router-dom';
import { BrainCircuit, LineChart } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-8 py-4 w-full sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-violet-500/10 font-['Inter'] antialiased tracking-tight">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-2xl font-black text-white italic hover:text-primary transition-colors">QuizAI ⚡</Link>
      </div>
      <div className="hidden md:flex items-center gap-8">
        <nav className="flex gap-6">
          <Link to="/" className="text-violet-400 border-b-2 border-violet-500 pb-1 text-label-md font-label-md">Home</Link>
          <Link to="/" className="text-slate-400 hover:text-slate-200 text-label-md font-label-md transition-colors duration-300">Create Quiz</Link>
          <Link to="/progress" className="text-slate-400 hover:text-slate-200 text-label-md font-label-md transition-colors duration-300">History</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/progress" className="bg-primary-container text-white px-6 py-2 rounded-full font-label-md hover:brightness-110 active:scale-95 transform transition-transform shadow-[0_0_15px_rgba(124,58,237,0.3)]">
            My Progress
        </Link>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
