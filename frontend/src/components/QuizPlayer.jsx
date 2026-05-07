import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function QuizPlayer({ quizData, setResultsData }) {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);

  useEffect(() => {
    if (!quizData || !quizData.questions) {
      navigate('/');
    }
  }, [quizData, navigate]);

  useEffect(() => {
    if (!isAnswered && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleAnswer(null);
    }
  }, [timeLeft, isAnswered]);

  if (!quizData || !quizData.questions) return null;

  const question = quizData.questions[currentIdx];
  const total = quizData.questions.length;

  const handleAnswer = (letter, optionText) => {
    if (isAnswered) return;
    
    setSelectedAnswer(letter);
    setIsAnswered(true);
    
    setAnswers(prev => [
      ...prev,
      {
        question: question.question,
        selected: letter,
        selectedText: optionText,
        correct: question.correct,
        explanation: question.explanation,
        options: question.options,
        isCorrect: letter === question.correct
      }
    ]);
  };

  const handleNext = () => {
    if (currentIdx < total - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      const score = answers.filter(a => a.isCorrect).length + (selectedAnswer === question.correct ? 1 : 0);
      const finalAnswers = answers.length === total ? answers : [...answers, {
        question: question.question,
        selected: selectedAnswer,
        selectedText: null,
        correct: question.correct,
        explanation: question.explanation,
        options: question.options,
        isCorrect: selectedAnswer === question.correct
      }];
      
      setResultsData({
        topic: quizData.topic,
        score,
        total,
        questions: finalAnswers,
        timeTaken: 30 * total
      });
      navigate('/results');
    }
  };

  const getOptionStyle = (opt) => {
    if (!isAnswered) {
      return {
        button: "border border-white/10 hover:border-white/20 hover:bg-white/10 active-scale",
        circle: "bg-white/10 text-slate-300",
        text: "text-slate-300",
        icon: null
      };
    }
    
    if (opt === question.correct) {
      return {
        button: "border-2 border-[#22c55e] bg-[#22c55e]/10",
        circle: "bg-[#22c55e] text-white",
        text: "text-white",
        icon: { name: "check_circle", color: "text-[#22c55e]" }
      };
    }
    
    if (opt === selectedAnswer && selectedAnswer !== question.correct) {
      return {
        button: "border-2 border-[#ef4444] bg-[#ef4444]/10",
        circle: "bg-[#ef4444] text-white",
        text: "text-white",
        icon: { name: "cancel", color: "text-[#ef4444]" }
      };
    }
    
    return {
      button: "border border-white/10 opacity-50",
      circle: "bg-white/10 text-slate-300",
      text: "text-slate-300",
      icon: null
    };
  };

  const timerDashOffset = 283 - (283 * timeLeft) / 30;

  return (
    <main className="max-w-[1280px] mx-auto px-margin py-lg min-h-[calc(100vh-140px)]">
      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Side Navigation Shell Placeholder */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 gap-base h-fit sticky top-24">
          <div className="p-md glass-card rounded-xl mb-md">
            <div className="flex items-center gap-sm mb-base">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white">
                <span className="material-symbols-outlined">bolt</span>
              </div>
              <div>
                <p className="font-bold text-violet-500">QuizAI Pro</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">AI Generator Active</p>
              </div>
            </div>
            <button className="w-full py-sm bg-violet-600/20 text-violet-400 rounded-lg text-sm font-semibold hover:bg-violet-600/30 transition-all">
              Upgrade to Pro
            </button>
          </div>
        </aside>

        {/* Main Quiz Area */}
        <section className="flex-1">
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-lg">
            <div className="flex-1 mr-xl">
              <div className="flex justify-between items-end mb-base">
                <span className="text-h3 font-h3 text-on-surface">Question {currentIdx + 1} <span className="text-slate-500 font-normal text-body-md">of {total}</span></span>
                <span className="text-label-md text-violet-400 font-bold uppercase tracking-wider">{quizData.topic || 'Quiz'}</span>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div 
                  className="bg-primary-container h-full shadow-[0px_0px_10px_rgba(124,58,237,0.5)] transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
                ></div>
              </div>
            </div>
            {/* Timer Circle */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle className="text-white/5" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-violet-500 transition-all duration-1000 ease-linear" cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeDasharray="283" strokeDashoffset={timerDashOffset} strokeWidth="8"></circle>
              </svg>
              <span className="text-h3 font-h3 text-white">{timeLeft}</span>
            </div>
          </div>

          {/* Question Card */}
          <motion.div 
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-xl rounded-xl mb-gutter"
          >
            <h1 className="text-h2 font-h2 text-white mb-lg leading-tight">{question.question}</h1>
            <div className="grid grid-cols-1 gap-base">
              {question.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const style = getOptionStyle(letter);
                
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(letter, opt)}
                    disabled={isAnswered}
                    className={`w-full p-md glass-card rounded-xl text-left flex items-center justify-between transition-all ${style.button}`}
                  >
                    <div className="flex items-center gap-md">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${style.circle}`}>
                        {letter}
                      </span>
                      <span className={`text-body-lg font-medium ${style.text}`}>
                        {opt}
                      </span>
                    </div>
                    {style.icon && (
                      <span className={`material-symbols-outlined ${style.icon.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        {style.icon.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Feedback Box */}
          {isAnswered && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-violet-600/10 border border-violet-500/20 rounded-xl p-md flex items-start gap-md mb-xl"
            >
              <div className="mt-1">
                <span className="material-symbols-outlined text-violet-400">info</span>
              </div>
              <div>
                <p className="text-violet-100 text-body-md">
                  <span className="font-bold text-violet-400">
                    {selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect.'}
                  </span>{' '}
                  {question.explanation}
                </p>
              </div>
            </motion.div>
          )}

          {/* Next Action */}
          {isAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-base bg-primary-container text-white px-lg py-md rounded-xl font-h3 hover:shadow-[0px_0px_20px_rgba(124,58,237,0.4)] transition-all active-scale"
              >
                {currentIdx < total - 1 ? 'Next Question' : 'View Results'}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
