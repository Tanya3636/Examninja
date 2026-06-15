import React, { useState, useEffect } from 'react';
import AiAssistant from './AiAssistant';

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

// ─── Adaptive Session Builder ────────────────────────────────────────────────
// Guarantees at least 1 question from EVERY section (holistic baseline),
// then fills remaining slots with inverse-accuracy weighting (weak areas get more).

function buildAdaptiveSession(allQuestions, userHistory, sessionSize = 10) {
  const SECTIONS = [
    'Legal Reasoning',
    'English Language',
    'Logical Reasoning',
    'Quantitative Techniques',
    'Current Affairs'
  ];

  // Aggregate per-section accuracy from all past sessions
  const sectionPerf = {};
  SECTIONS.forEach(s => { sectionPerf[s] = { correct: 0, attempted: 0 }; });
  userHistory.forEach(session => {
    Object.entries(session.sections || {}).forEach(([section, data]) => {
      if (sectionPerf[section]) {
        sectionPerf[section].correct += data.correct || 0;
        sectionPerf[section].attempted += data.attempted || 0;
      }
    });
  });

  const getAcc = (s) =>
    sectionPerf[s] && sectionPerf[s].attempted > 0
      ? sectionPerf[s].correct / sectionPerf[s].attempted
      : null; // null = new section, no history

  // Group questions by section
  const bySection = {};
  SECTIONS.forEach(s => { bySection[s] = allQuestions.filter(q => q.section === s); });
  const sectionsAvailable = SECTIONS.filter(s => bySection[s].length > 0);

  const selected = [];
  const usedIds = new Set();

  // STEP 1 — Holistic baseline: guarantee 1 question from every available section
  sectionsAvailable.forEach(section => {
    const acc = getAcc(section);
    // Target difficulty based on accuracy: struggling → easy, mastered → hard, else medium
    const targetDiff = acc === null ? 'medium' : acc < 0.4 ? 'easy' : acc > 0.75 ? 'hard' : 'medium';
    const pool = bySection[section];
    const preferred = pool.filter(q => q.difficulty === targetDiff);
    const candidates = preferred.length > 0 ? preferred : pool;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    if (picked) {
      selected.push(picked);
      usedIds.add(picked.id);
    }
  });

  // STEP 2 — Weighted fill: weak sections appear more, but every section stays in play
  const remaining = Math.max(0, sessionSize - selected.length);
  if (remaining > 0 && sectionsAvailable.length > 0) {
    // Inverse accuracy: lower accuracy → higher weight
    const weights = sectionsAvailable.map(s => {
      const acc = getAcc(s);
      return {
        section: s,
        weight: acc === null ? 1.0 : Math.max(0.15, 1.4 - acc * 1.25)
      };
    });
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);

    for (let i = 0; i < remaining; i++) {
      // Weighted random section pick
      let rand = Math.random() * totalWeight;
      let chosenSection = sectionsAvailable[0];
      for (const { section, weight } of weights) {
        rand -= weight;
        if (rand <= 0) { chosenSection = section; break; }
      }

      const available = bySection[chosenSection].filter(q => !usedIds.has(q.id));
      if (!available.length) continue;

      const acc = getAcc(chosenSection);
      const targetDiff = acc === null ? 'medium' : acc < 0.4 ? 'easy' : acc > 0.75 ? 'hard' : 'medium';
      const preferred = available.filter(q => q.difficulty === targetDiff);
      const candidates = preferred.length > 0 ? preferred : available;
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      if (picked) {
        selected.push(picked);
        usedIds.add(picked.id);
      }
    }
  }

  // Shuffle so sections are interleaved naturally
  return selected.sort(() => Math.random() - 0.5);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSessionQuestions(user) {
  const adminQs = JSON.parse(localStorage.getItem('examninjaQuestions') || '[]');
  const allQs = adminQs.length > 0 ? adminQs : defaultQuestions;
  const history = user
    ? JSON.parse(localStorage.getItem(`examninjaResults_${user.username}`) || '[]')
    : [];
  return buildAdaptiveSession(allQs, history);
}

function buildAiContext(q) {
  if (!q) return '';
  return [
    `CLAT Practice — ${q.section}${q.topic ? ` | ${q.topic}` : ''}${q.difficulty ? ` | ${q.difficulty}` : ''}`,
    q.passage ? `\nPassage:\n${q.passage}` : '',
    q.principle ? `\nPrinciple:\n${q.principle}` : '',
    `\nQuestion: ${q.question}`,
    `\nOptions:\n${q.options.map((o, i) => `${['A', 'B', 'C', 'D'][i]}) ${o}`).join('\n')}`,
    `\nCorrect Answer: ${['A', 'B', 'C', 'D'][q.correct]}) ${q.options[q.correct]}`,
    q.explanation ? `\nExplanation: ${q.explanation}` : ''
  ].join('');
}

// ─── Component ────────────────────────────────────────────────────────────────

function Practice({ user, onFinish, onBack }) {
  const [sessionQuestions, setSessionQuestions] = useState(() => getSessionQuestions(user));
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(sessionQuestions[0]?.timeLimit || 90);
  const [answers, setAnswers] = useState([]);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');

  // Timer
  useEffect(() => {
    if (finished) return;
    if (timeLeft === 0) {
      handleNext();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, currentQ, finished]); // eslint-disable-line

  const handleSelect = (index) => {
    if (selected !== null) return;
    const q = sessionQuestions[currentQ];
    const isCorrect = index === q.correct;
    setSelected(index);
    setShowExplanation(true);
    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, {
      questionIndex: currentQ,
      section: q.section,
      topic: q.topic || 'General',
      difficulty: q.difficulty || 'medium',
      selected: index,
      correct: q.correct,
      isCorrect
    }]);
  };

  const handleNext = () => {
    if (currentQ + 1 >= sessionQuestions.length) {
      saveResults();
      setFinished(true);
    } else {
      const next = currentQ + 1;
      setCurrentQ(next);
      setSelected(null);
      setShowExplanation(false);
      setTimeLeft(sessionQuestions[next]?.timeLimit || 90);
    }
  };

  const saveResults = () => {
    if (!user) return;
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
      totalQuestions: sessionQuestions.length,
      correct: score,
      sections,
      topics
    };
    const key = `examninjaResults_${user.username}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([...existing, session]));
  };

  const handleRestart = () => {
    const newSession = getSessionQuestions(user);
    setSessionQuestions(newSession);
    setCurrentQ(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
    setTimeLeft(newSession[0]?.timeLimit || 90);
    setAnswers([]);
    setAiInitialPrompt('');
  };

  // ── Empty state ──────────────────────────────────────────────────────────
  if (sessionQuestions.length === 0) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif", textAlign: 'center', padding: '40px'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <h2 style={{ marginBottom: '12px' }}>No questions yet</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '28px' }}>
            The admin hasn't added questions yet. Check back soon!
          </p>
          <button onClick={onBack} style={{
            background: 'linear-gradient(90deg, #f7971e, #ffd200)',
            border: 'none', borderRadius: '50px', padding: '12px 32px',
            color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
          }}>← Go Back</button>
        </div>
      </div>
    );
  }

  // ── Results screen ───────────────────────────────────────────────────────
  if (finished) {
    const pct = Math.round((score / sessionQuestions.length) * 100);

    // Section summary
    const sectionSummary = {};
    answers.forEach(a => {
      if (!sectionSummary[a.section]) sectionSummary[a.section] = { attempted: 0, correct: 0 };
      sectionSummary[a.section].attempted++;
      if (a.isCorrect) sectionSummary[a.section].correct++;
    });

    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif", padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px', padding: '48px', maxWidth: '560px', width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '56px', marginBottom: '12px' }}>
              {pct >= 80 ? '🏆' : pct >= 60 ? '🥷' : '💪'}
            </div>
            <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Session Complete!</h1>
            <div style={{
              fontSize: '64px', fontWeight: '800',
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '6px'
            }}>
              {score}/{sessionQuestions.length}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              {pct >= 80 ? 'Excellent! You are a true ninja! 🔥' :
               pct >= 60 ? 'Good work! Keep the momentum going!' :
               'Every session makes you better. Keep going!'}
            </p>
          </div>

          {/* Section breakdown */}
          {Object.keys(sectionSummary).length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
              padding: '18px', marginBottom: '24px'
            }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Section Breakdown
              </div>
              {Object.entries(sectionSummary).map(([section, data]) => {
                const secPct = Math.round((data.correct / data.attempted) * 100);
                const color = secPct >= 70 ? '#4ade80' : secPct >= 50 ? '#fbbf24' : '#f87171';
                return (
                  <div key={section} style={{ marginBottom: '10px' }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: '13px', marginBottom: '5px'
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{section}</span>
                      <span style={{ color }}>{data.correct}/{data.attempted}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '5px' }}>
                      <div style={{
                        width: `${secPct}%`, height: '100%', borderRadius: '6px',
                        background: color, transition: 'width 0.4s'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Q-by-Q summary */}
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
            padding: '16px', marginBottom: '24px', maxHeight: '180px', overflowY: 'auto'
          }}>
            {answers.map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontSize: '12px', color: 'rgba(255,255,255,0.6)'
              }}>
                <span>Q{i + 1} · {a.section}</span>
                <span>{a.isCorrect ? '✅' : '❌'}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <button onClick={handleRestart} style={{
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              border: 'none', borderRadius: '50px', padding: '14px 40px',
              color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
            }}>
              New Adaptive Session 🥷
            </button>
            {user && (
              <button onClick={onFinish} style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50px', padding: '14px 40px',
                color: 'white', cursor: 'pointer', fontSize: '15px'
              }}>
                View My Dashboard →
              </button>
            )}
          </div>
        </div>

        <AiAssistant
          context="The student just finished a CLAT practice session."
          initialPrompt={aiInitialPrompt}
          onInitialPromptUsed={() => setAiInitialPrompt('')}
        />
      </div>
    );
  }

  // ── Practice screen ──────────────────────────────────────────────────────
  const q = sessionQuestions[currentQ];
  const answeredWrong = selected !== null && selected !== q.correct;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white', fontFamily: "'Segoe UI', sans-serif", padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        maxWidth: '800px', margin: '0 auto 24px', padding: '0 4px'
      }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={onBack || (() => {})}>
          🥷 ExamNinja
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {user && (
            <div style={{
              background: 'rgba(247,151,30,0.15)', border: '1px solid rgba(247,151,30,0.3)',
              borderRadius: '20px', padding: '5px 12px', fontSize: '12px', color: '#ffd200'
            }}>
              Adaptive
            </div>
          )}
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
        maxWidth: '800px', margin: '0 auto 24px',
        background: 'rgba(255,255,255,0.1)', borderRadius: '10px', height: '5px'
      }}>
        <div style={{
          width: `${(currentQ / sessionQuestions.length) * 100}%`, height: '100%',
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
            {q.section} — Q{currentQ + 1} of {sessionQuestions.length}
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
          {q.topic && (
            <div style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.07)',
              borderRadius: '20px', padding: '3px 14px', fontSize: '12px',
              color: 'rgba(255,255,255,0.45)'
            }}>
              {q.topic}
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
                lineHeight: '26px', marginRight: '12px', fontSize: '12px', flexShrink: 0
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

        {/* Ask AI button — shown only after a wrong answer */}
        {answeredWrong && (
          <button
            onClick={() => setAiInitialPrompt(
              `I just got this ${q.section} question wrong. The topic is "${q.topic || q.section}". I chose option ${['A','B','C','D'][selected]}) "${q.options[selected]}" but the correct answer is ${['A','B','C','D'][q.correct]}) "${q.options[q.correct]}". Please explain step by step why my answer was wrong and how to arrive at the correct answer.`
            )}
            style={{
              marginTop: '14px', width: '100%',
              background: 'rgba(247,151,30,0.12)', border: '1px solid rgba(247,151,30,0.35)',
              borderRadius: '12px', padding: '12px', color: '#ffd200',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            🤖 Ask AI to explain this
          </button>
        )}

        {/* Next Button */}
        {selected !== null && (
          <button onClick={handleNext} style={{
            marginTop: '14px', background: 'linear-gradient(90deg, #f7971e, #ffd200)',
            border: 'none', borderRadius: '50px', padding: '14px 40px',
            color: '#000', fontWeight: 'bold', cursor: 'pointer',
            fontSize: '15px', width: '100%'
          }}>
            {currentQ + 1 >= sessionQuestions.length ? 'See Results 🏆' : 'Next Question →'}
          </button>
        )}
      </div>

      {/* AI Tutor — floating, always available during practice */}
      <AiAssistant
        context={buildAiContext(q)}
        initialPrompt={aiInitialPrompt}
        onInitialPromptUsed={() => setAiInitialPrompt('')}
      />
    </div>
  );
}

export default Practice;
