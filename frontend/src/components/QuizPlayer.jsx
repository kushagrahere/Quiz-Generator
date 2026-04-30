import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

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
      return selectedAnswer === opt 
        ? "bg-primary/20 border-primary" 
        : "bg-card border-slate-600 hover:border-primary/50 hover:bg-slate-800";
    }
    
    if (opt === question.correct) {
      return "bg-emerald-500/20 border-emerald-500 text-emerald-100";
    }
    if (opt === selectedAnswer && selectedAnswer !== question.correct) {
      return "bg-rose-500/20 border-rose-500 text-rose-100";
    }
    return "bg-card/50 border-slate-700 opacity-50";
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="text-gray-400 font-medium">
          Question {currentIdx + 1} of {total}
        </div>
        <div className={`flex items-center gap-2 font-bold px-4 py-2 rounded-full border ${timeLeft <= 5 ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-800 border-slate-600 text-slate-300'}`}>
          <Timer className="w-4 h-4" />
          {timeLeft}s
        </div>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2 mb-8">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300" 
          style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
        ></div>
      </div>

      <motion.div 
        key={currentIdx}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-panel p-8 space-y-8"
      >
        <h2 className="text-2xl font-bold leading-relaxed">{question.question}</h2>

        <div className="space-y-4">
          {question.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i);
            return (
            <motion.button
              key={i}
              whileHover={!isAnswered ? { scale: 1.01 } : {}}
              whileTap={!isAnswered ? { scale: 0.99 } : {}}
              onClick={() => handleAnswer(letter, opt)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex justify-between items-center ${getOptionStyle(letter)}`}
            >
              <span>{letter}) {opt}</span>
              {isAnswered && letter === question.correct && <CheckCircle2 className="text-emerald-500 w-6 h-6" />}
              {isAnswered && letter === selectedAnswer && selectedAnswer !== question.correct && <XCircle className="text-rose-500 w-6 h-6" />}
            </motion.button>
          )})}
        </div>

        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl border ${selectedAnswer === question.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}
          >
            <h3 className="font-bold flex items-center gap-2 mb-2">
              {selectedAnswer === question.correct ? (
                <><CheckCircle2 className="text-emerald-400" /> Correct!</>
              ) : (
                <><XCircle className="text-rose-400" /> Incorrect</>
              )}
            </h3>
            <p className="text-gray-300">{question.explanation}</p>
          </motion.div>
        )}

        {isAnswered && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleNext}
              className="bg-primary hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2"
            >
              {currentIdx < total - 1 ? 'Next Question' : 'View Results'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
