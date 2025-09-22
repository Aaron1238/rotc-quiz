import React, { useState, useEffect } from 'react';

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [progress, setProgress] = useState(0);
  const [questions, setQuestions] = useState([]);

  // Personnel data
  const personnelData = [
    { name: "C/1Lt. Hailey Lee", position: "Operations Squadron Officer (OPSO)" },
    { name: "C/1Lt. Ivan Lee", position: "Drill and Ceremonies Officer (DCO)" },
    { name: "C/1Lt. Jacob Cho", position: "Deputy Commander (DPC)" },
    { name: "C/1Lt. Sally Kim", position: "Kitty Hawk President (KP)" },
    { name: "C/2Lt. AJ Ahn", position: "Logistics Officers (LOs)" },
    { name: "C/2Lt. Alexander Kalindjian", position: "Technology Officer (TO)" },
    { name: "C/2Lt. Brian Yoo", position: "Flight Commanders (FCs)" },
    { name: "C/2Lt. Cayden Kwon", position: "Flight Commanders (FCs)" },
    { name: "C/2Lt. Charlotte Hong", position: "Flight Commanders (FCs)" },
    { name: "C/2Lt. Erick Padua", position: "Color Guard Commander (CGC)" },
    { name: "C/2Lt. Hera Yoo", position: "Logistics Officers (LOs)" },
    { name: "C/2Lt. Isaiah An", position: "Physical Training Officer (PTO)" },
    { name: "C/2Lt. Joel Ju", position: "Services Officer (SO)" },
    { name: "C/2Lt. Joel Kim", position: "Flight Commanders (FCs)" },
    { name: "C/2Lt. Seraphina Ahn", position: "MWR/KHAS Vice Director (KVD)" },
    { name: "C/2Lt. Terron Brown", position: "Personnel Officer (PO)" },
    { name: "C/Capt David Lee", position: "Corps Commander (CC)" },
    { name: "C/MSgt Erin Oh", position: "StellarXplorers Captain (SXC)" },
    { name: "C/MSgt Hana Cho", position: "DC Secretary (DCS)" },
    { name: "C/MSgt Hudson Pluimer", position: "Raider Team Captains (RTCs)" },
    { name: "C/MSgt Jeongwoo Kye", position: "Recruitment Officer (RO)" },
    { name: "C/MSgt Mark Shin", position: "StellarXplorers Captain (SXC)" },
    { name: "C/MSgt Samantha Hendrix", position: "Raider Team Captains (RTCs)" },
    { name: "C/SrA Chloe Tan", position: "JLAB Captain (JC)" },
    { name: "C/TSgt Sarah Park", position: "JLAB Captain (JC)" },
    { name: "MSgt Maurice Mack", position: "Senior Aerospace Science Instructor (SASI)" },
    { name: "TSgt Mariano Morua", position: "Aerospace Science Instructor (ASI)" }
  ];

  // Group by position
  const groupedByPosition = {};
  personnelData.forEach(person => {
    if (!groupedByPosition[person.position]) {
      groupedByPosition[person.position] = [];
    }
    groupedByPosition[person.position].push(person.name);
  });

  // Generate questions
  useEffect(() => {
    const generatedQuestions = Object.entries(groupedByPosition).map(([position, names]) => {
      return {
        question: `Who holds the position of ${position}?`,
        correctAnswers: names,
        answerCount: names.length,
      };
    });

    setQuestions(generatedQuestions);
    setAnswers(Array(generatedQuestions[0]?.answerCount || 0).fill(''));
  }, []);

  // Shuffle questions
  const shuffleQuestions = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestion(0);
    setAnswers(Array(shuffled[0]?.answerCount || 0).fill(''));
    setShowFeedback(false);
    setProgress(0);
  };

  // Handle input change
  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  // Check answer
  const checkAnswer = () => {
    const currentQ = questions[currentQuestion];
    const userAnswers = answers.map(a => a.trim()).filter(a => a !== '');
    const correctAnswers = currentQ.correctAnswers;

    const isCorrectAnswer =
      userAnswers.length === correctAnswers.length &&
      userAnswers.every(a => correctAnswers.includes(a)) &&
      correctAnswers.every(a => userAnswers.includes(a));

    setIsCorrect(isCorrectAnswer);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswers(Array(questions[currentQuestion + 1]?.answerCount || 0).fill(''));
        setShowFeedback(false);
        setProgress(((currentQuestion + 1) / questions.length) * 100);
      }
    }, 1500);
  };

  // Handle Enter key
  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter') {
      if (index === answers.length - 1) {
        checkAnswer();
      } else {
        const nextInput = document.getElementById(`answer-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Reset quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(Array(questions[0]?.answerCount || 0).fill(''));
    setShowFeedback(false);
    setProgress(0);
  };

  if (questions.length === 0) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading JROTC Quiz...</div>;
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-black text-white font-sf-pro-display">
      {/* Progress */}
      <div className="w-full max-w-2xl mx-auto px-6 mb-8">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right text-sm text-gray-400 mt-2">
          {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      {/* Quiz */}
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
          <h2 className="text-2xl font-light mb-6">{currentQ.question}</h2>

          {answers.map((answer, idx) => (
            <input
              key={idx}
              id={`answer-${idx}`}
              type="text"
              value={answer}
              onChange={(e) => handleAnswerChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className="w-full bg-transparent border border-gray-600 rounded-full px-6 py-4 mb-4 text-lg"
            />
          ))}

          {showFeedback && (
            <div
              className={`mb-6 p-4 rounded-2xl text-center ${
                isCorrect
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
              }`}
            >
              {isCorrect ? 'Correct!' : 'Incorrect. Try again.'}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={checkAnswer}
              className="flex-1 bg-blue-500 hover:bg-blue-400 py-3 rounded-full"
            >
              Submit
            </button>
            <button
              onClick={shuffleQuestions}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-full"
            >
              Shuffle
            </button>
          </div>

          {currentQuestion === questions.length - 1 && showFeedback && isCorrect && (
            <div className="mt-6">
              <button
                onClick={resetQuiz}
                className="w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-full"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
