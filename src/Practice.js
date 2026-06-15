import React, { useState, useEffect } from 'react';

const defaultQuestions = [
  {
    id: 1, section: "Legal Reasoning", difficulty: "medium", timeLimit: 90,
    topic: "Tort Law", source: "CLAT Sample",
    passage: "A owns a dog that has never shown any aggressive behavior. One day, the dog bites B without any provocation. B suffers injuries and wants to claim compensation from A.",
    principle: "Principle: The owner of an animal is liable for damage done by that animal if the owner knew or ought to have known of the animal's dangerous propensity.",
    question: "Will B succeed in claiming compensation from A?",
    options: [
      "Yes, because A is the owner of the dog",
      "No, because the dog had never shown aggressive behavior before",
      "Yes, because strict liability applies to all animal owners",
      "No, because B did not provoke the dog"
    ],
    correct: 1,
    explanation: "The principle states that liability depends on the owner knowing about the dangerous propensity. Since the dog had never shown aggressive behavior, A had no reason to know it was dangerous. Therefore B cannot succeed."
  },
  {
    id: 2, section: "Legal Reasoning", difficulty: "medium", timeLimit: 90,
    topic: "Contract Law", source: "CLAT Sample",
    passage: "Ram enters into a contract with Shyam to sell his car for ₹5,00,000. Before the sale is completed, the car is destroyed in a flood without any fault of either party.",
    principle: "Principle: When the subject matter of a contract is destroyed without fault of either party, the contract becomes void.",
    question: "What happens to the contract between Ram and Shyam?",
    options: [
      "Shyam must still pay Ram ₹5,00,000",
      "Ram must replace the car with another one",
      "The contract becomes void and neither party has any obligation",
      "Ram is liable to pay damages to Shyam"
    ],
    correct: 2,
    explanation: "According to the principle, when the subject matter is destroyed without fault of either party, the contract becomes void. Neither Ram nor Shyam has any further obligation."
  },
  {
    id: 3, section: "Logical Reasoning", difficulty: "medium", timeLimit: 90,
    topic: "Syllogism", source: "CLAT Sample",
    passage: "In a certain office, all managers are graduates. Some graduates are experienced. All experienced people get promotions.",
    question: "Which of the following conclusions is definitely true?",
    options: [
      "All managers get promotions",
      "Some managers may be experienced",
      "All graduates get promotions",
      "No manager gets a promotion"
    ],
    correct: 1,
    explanation: "We know all managers are graduates, and some graduates are experienced. Therefore some managers may be experienced. Since all experienced people get promotions, some managers may get promotions. But we cannot say ALL managers get promotions."
  },
  {
    id: 4, section: "English Language", difficulty: "easy", timeLimit: 60,
    topic: "Central Theme", source: "CLAT Sample",
    passage: "The rapid advancement of artificial intelligence has sparked both excitement and concern among experts. While AI promises to revolutionize industries and improve human lives, critics warn of potential job displacement and ethical dilemmas. The technology's ability to process vast amounts of data far exceeds human capability, yet questions about accountability and bias remain unresolved.",
    question: "What is the central theme of the passage?",
    options: [
      "AI will definitely replace all human jobs",
      "AI advancement presents both opportunities and challenges",
      "Critics are opposed to all technological advancement",
      "Data processing is the only benefit of AI"
    ],
    correct: 1,
    explanation: "The passage presents a balanced view — AI brings excitement and promise but also concern and challenges. The central theme is the dual nature of AI advancement."
  },
  {
    id: 5, section: "Quantitative Techniques", difficulty: "medium", timeLimit: 90,
    topic: "Profit and Loss", source: "CLAT Sample",
    passage: "A shopkeeper bought 100 items at ₹50 each. He sold 80 items at ₹70 each and the remaining at ₹30 each.",
    question: "What is the overall profit percentage?",
    options: [
      "20% profit",
      "24% profit",
      "10% loss",
      "8% profit"
    ],
    correct: 1,
    explanation: "Cost = 100 × 50 = ₹5,000. Revenue = (80 × 70) + (20 × 30) = 5,600 + 600 = ₹6,200. Profit = ₹1,200. Profit % = (1200/5000) × 100 = 24%."
  }
];

function Practice({ user, onFinish, onBack }) {
  // Load questions: admin questions from localStorage, fallback to defaults
  const adminQuestions = JSON.parse(localStorage.getItem('examninjaQuestions') || '[]');
  const allQuestions = adminQuestions.length > 0 ? adminQuestions : defaultQuestions;

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(allQuestions[0]?.timeLimit || 90);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNext();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentQ]); // eslint-disable-line

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    const isCorrect = index === allQuestions[currentQ].correct;
    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, {
      questionIndex: currentQ,
      section: allQuestions[currentQ].section,
      topic: allQuestions[currentQ].topic || 'General',
      difficulty: allQuestions[currentQ].difficulty || 'medium',
      selected: index,
      correct: allQuestions[currentQ].correct,
      isCorrect
    }]);
  };

  const handleNext = () => {
    if (currentQ + 1 >= allQuestions.length) {
      saveResults();
      setFinished(true);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setShowExplanation(false);
      setTimeLeft(allQuestions[currentQ + 1]?.timeLimit || 90);
    }
  };

  const saveResults = () => {
    if (!user) return;
    const finalScore = answers.filter(a => a.isCorrect).length + (selected !== null && selected === allQuestions[currentQ].correct ? 1 : 0);

    // Build section and topic breakdowns
    const sections = {};
    const topics = {};
    answers.forEach(a => {
      if (!sections[a.section]) sections[a.section] = { attempted: 0, correct: 0 };
      sections[a.section].attempted++;
      if (a.isCorrect) sections[a.section].correct++;

      const t = a.topic || 'General';
      if (!topics[t]) topics[t] = { attempted: 0, correct: 0 };
      topics[t].attempted++;
      if (a.isCorrect) topics[t].correct++;
    });

    const session = {
      date: new Date().toISOString(),
      totalQuestions: allQuestions.length,
      correct: finalScore,
      sections,
      topics
    };

    const key = `examninjaResults_${user.username}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([...existing, session]));
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setTimeLeft(allQuestions[0]?.timeLimit || 90);
    setAnswers([]);
  };

  if (finished) {
    const pct = Math.round((score / allQuestions.length) * 100);
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif", padding: '20px'
      }}>
        <div style={{
          textAlign: 'center', background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px',
          padding: '60px', maxWidth: '500px', width: '100%'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>
            {pct >= 80 ? '🏆' : pct >= 60 ? '🥷' : '💪'}
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Session Complete!</h1>
          <div style={{
            fontSize: '72px', fontWeight: '800',
            background: 'linear-gradient(90deg, #f7971e, #ffd200)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px'
          }}>
            {score}/{allQuestions.length}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '28px' }}>
            {pct >= 80 ? 'Excellent! You are a true ninja!' :
             pct >= 60 ? 'Good work! Keep practicing!' :
             'Keep going! Every session makes you better!'}
          </p>

          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: '14px',
            padding: '16px', marginBottom: '28px', textAlign: 'left'
          }}>
            {answers.map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontSize: '13px', color: 'rgba(255,255,255,0.65)'
              }}>
                <span>Q{i + 1} — {a.section}</span>
                <span>{a.isCorrect ? '✅ Correct' : '❌ Wrong'}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button onClick={handleRestart} style={{
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              border: 'none', borderRadius: '50px', padding: '14px 40px',
              color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
            }}>
              Practice Again 🥷
            </button>
            {user && (
              <button onClick={onFinish} style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50px', padding: '14px 40px',
                color: 'white', cursor: 'pointer', fontSize: '15px'
              }}>
                View My Dashboard →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const q = allQuestions[currentQ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white', fontFamily: "'Segoe UI', sans-serif", padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '800px', margin: '0 auto 28px', padding: '0 4px'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={onBack || (() => {})}>
          🥷 ExamNinja
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '20px',
            padding: '7px 14px', fontSize: '13px'
          }}>
            Score: {score}/{currentQ}
          </div>
          <div style={{
            background: timeLeft <= 15 ? 'rgba(255,50,50,0.3)' : 'rgba(255,255,255,0.1)',
            border: timeLeft <= 15 ? '1px solid rgba(255,50,50,0.5)' : 'none',
            borderRadius: '20px', padding: '7px 14px', fontSize: '13px',
            color: timeLeft <= 15 ? '#ff6b6b' : 'white'
          }}>
            ⏱️ {timeLeft}s
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        maxWidth: '800px', margin: '0 auto 28px',
        background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '5px'
      }}>
        <div style={{
          width: `${(currentQ / allQuestions.length) * 100}%`, height: '100%',
          background: 'linear-gradient(90deg, #f7971e, #ffd200)',
          borderRadius: '10px', transition: 'width 0.3s'
        }} />
      </div>

      {/* Question Card */}
      <div style={{
        maxWidth: '800px', margin: '0 auto',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px', padding: '36px'
      }}>
        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-block', background: 'rgba(247,151,30,0.2)',
            border: '1px solid rgba(247,151,30,0.4)', borderRadius: '20px',
            padding: '3px 14px', fontSize: '12px', color: '#ffd200'
          }}>
            {q.section} — Q{currentQ + 1} of {allQuestions.length}
          </div>
          {q.difficulty && (
            <div style={{
              display: 'inline-block',
              background: q.difficulty === 'easy' ? 'rgba(74,222,128,0.15)' : q.difficulty === 'hard' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)',
              borderRadius: '20px', padding: '3px 14px', fontSize: '12px',
              color: q.difficulty === 'easy' ? '#4ade80' : q.difficulty === 'hard' ? '#ef4444' : '#fbbf24'
            }}>
              {q.difficulty}
            </div>
          )}
        </div>

        {/* Passage */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
          padding: '18px', marginBottom: '14px', fontSize: '14px',
          lineHeight: '1.75', color: 'rgba(255,255,255,0.82)'
        }}>
          {q.passage}
        </div>

        {/* Principle */}
        {q.principle && (
          <div style={{
            background: 'rgba(247,151,30,0.08)', border: '1px solid rgba(247,151,30,0.2)',
            borderRadius: '12px', padding: '14px', marginBottom: '18px',
            fontSize: '13px', color: '#ffd200', lineHeight: '1.65'
          }}>
            {q.principle}
          </div>
        )}

        {/* Question */}
        <h3 style={{ fontSize: '16px', marginBottom: '20px', lineHeight: '1.55' }}>
          {q.question}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {q.options.map((option, index) => (
            <button key={index} onClick={() => handleSelect(index)} style={{
              background: selected === null
                ? 'rgba(255,255,255,0.04)'
                : index === q.correct
                ? 'rgba(74,222,128,0.18)'
                : selected === index
                ? 'rgba(255,100,100,0.18)'
                : 'rgba(255,255,255,0.04)',
              border: selected === null
                ? '1px solid rgba(255,255,255,0.1)'
                : index === q.correct
                ? '1px solid rgba(74,222,128,0.5)'
                : selected === index
                ? '1px solid rgba(255,100,100,0.5)'
                : '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px', padding: '14px 18px', color: 'white',
              textAlign: 'left', cursor: selected === null ? 'pointer' : 'default',
              fontSize: '14px', lineHeight: '1.5', transition: 'all 0.15s'
            }}>
              <span style={{
                display: 'inline-block', width: '26px', height: '26px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', textAlign: 'center',
                lineHeight: '26px', marginRight: '12px', fontSize: '12px'
              }}>
                {['A', 'B', 'C', 'D'][index]}
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div style={{
            marginTop: '20px', background: 'rgba(74,222,128,0.08)',
            border: '1px solid rgba(74,222,128,0.25)', borderRadius: '12px',
            padding: '16px', fontSize: '13px', lineHeight: '1.7',
            color: 'rgba(255,255,255,0.82)'
          }}>
            <strong style={{ color: '#4ade80' }}>💡 Explanation: </strong>
            {q.explanation}
          </div>
        )}

        {/* Next Button */}
        {selected !== null && (
          <button onClick={handleNext} style={{
            marginTop: '20px', background: 'linear-gradient(90deg, #f7971e, #ffd200)',
            border: 'none', borderRadius: '50px', padding: '14px 40px',
            color: '#000', fontWeight: 'bold', cursor: 'pointer',
            fontSize: '15px', width: '100%'
          }}>
            {currentQ + 1 >= allQuestions.length ? 'See Results 🏆' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
}

export default Practice;
