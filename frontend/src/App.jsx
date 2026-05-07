import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import QuizPlayer from './components/QuizPlayer';
import Results from './components/Results';
import ProgressDashboard from './components/ProgressDashboard';
import { useState } from 'react';

function App() {
  const [quizData, setQuizData] = useState(null); 
  const [resultsData, setResultsData] = useState(null); 

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Home setQuizData={setQuizData} />} />
            <Route path="/quiz" element={<QuizPlayer quizData={quizData} setResultsData={setResultsData} />} />
            <Route path="/results" element={<Results resultsData={resultsData} />} />
            <Route path="/progress" element={<ProgressDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
