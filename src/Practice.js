import React, { useState, useEffect } from 'react';
import AiAssistant from './AiAssistant';

// ─── Default Passage Sets ────────────────────────────────────────────────────
const defaultSets = [
  {
    id: 1,
    section: 'Legal Reasoning', topic: 'Environmental Tort', difficulty: 'medium',
    timeLimit: 90, source: 'CLAT Sample',
    passage: 'Arjun owns a factory on the outskirts of a small town. The factory releases chemical effluents into the Nalwa river. Maya, a farmer whose fields border the river, uses the river water to irrigate her crops. Over six months, her crop yield has dropped by 70% and she has suffered significant losses. Maya files a suit against Arjun claiming compensation for the damage to her crops.',
    principle: 'Principle 1: Every person is entitled to use their property as they see fit, provided such use does not cause harm to others.\n\nPrinciple 2: Where a person\'s lawful activity causes damage to another person\'s property, the person is liable to compensate for that damage regardless of intent.',
    questions: [
      {
        question: 'Will Maya succeed in her claim against Arjun?',
        options: [
          'No — Arjun was operating a lawful business and had no intent to harm Maya',
          'Yes — his factory\'s effluents caused direct harm to Maya\'s crops, making him liable under Principle 2',
          'No — Maya should have changed her water source once she noticed the pollution',
          'Yes — but only if she can prove Arjun knew about the damage and continued operations'
        ],
        correct: 1,
        explanation: 'Principle 2 establishes liability based on damage caused, not on intent or the lawfulness of the activity. Since Arjun\'s factory directly caused harm to Maya\'s crops, she will succeed.'
      },
      {
        question: 'Suppose Arjun proves the effluent release was caused by a sudden machinery malfunction beyond his control. How does this affect Maya\'s claim?',
        options: [
          'Maya\'s claim fails entirely because Arjun was not negligent',
          'Maya\'s claim still succeeds — Principle 2 imposes liability based on damage caused, not on intent or control',
          'Maya can only claim partial compensation since the fault was mechanical',
          'The court must decide based on whether Arjun had prior warning of the malfunction'
        ],
        correct: 1,
        explanation: 'Principle 2 is clear — liability arises from causing damage, not from negligence or intent. Even an accidental malfunction does not shield Arjun if his factory\'s effluents were the cause of Maya\'s loss.'
      },
      {
        question: 'If it is established that the river was already moderately polluted by upstream industries before Arjun\'s factory began operations, how should the court approach Maya\'s claim?',
        options: [
          'Arjun is fully exempt since he did not start the pollution',
          'Arjun is liable only for the additional damage his effluents specifically caused beyond the pre-existing pollution',
          'Maya loses because she knowingly used a polluted water source',
          'Arjun must pay full compensation regardless of the pre-existing pollution'
        ],
        correct: 1,
        explanation: 'Where damage has multiple contributing causes, a defendant is liable only for the harm they specifically caused or materially worsened. Arjun would be liable for the incremental harm attributable to his factory\'s discharge.'
      }
    ]
  },
  {
    id: 2,
    section: 'English Language', topic: 'Reading Comprehension', difficulty: 'easy',
    timeLimit: 60, source: 'CLAT Sample',
    passage: 'The debate over whether technology is making humans more isolated or more connected remains unresolved. On one hand, social media platforms allow people to maintain relationships across vast distances, enabling communication that would have been impossible a generation ago. On the other hand, critics argue that the quality of these digital interactions is shallow compared to face-to-face engagement, and that heavy technology use correlates with increased loneliness and reduced empathy among young people. The truth, as with most complex social questions, likely lies somewhere in between — technology is a tool, and its effect depends entirely on how it is used.',
    principle: null,
    questions: [
      {
        question: 'What is the author\'s primary position on technology and human connection?',
        options: [
          'Technology is overwhelmingly harmful to genuine human relationships',
          'Technology has made people meaningfully more connected than before',
          'The effect of technology on connection is neither fixed nor universal — it depends on usage',
          'Technology debates are too complex to ever reach a meaningful conclusion'
        ],
        correct: 2,
        explanation: 'The author explicitly concludes that "technology is a tool, and its effect depends entirely on how it is used." This indicates outcomes vary with usage, not with technology itself.'
      },
      {
        question: 'Which of the following would most WEAKEN the critics\' argument mentioned in the passage?',
        options: [
          'A study showing social media use among teenagers has doubled in five years',
          'Research finding that regular video calls build empathy as effectively as in-person meetings',
          'Data showing young people spend more than six hours daily on their devices',
          'A survey in which most users report feeling lonely despite being constantly online'
        ],
        correct: 1,
        explanation: 'Critics argue digital interaction is shallow and reduces empathy. Research showing video calls build empathy as well as face-to-face interaction directly undermines the core of their argument.'
      }
    ]
  },
  {
    id: 3,
    section: 'Logical Reasoning', topic: 'Argument Analysis', difficulty: 'medium',
    timeLimit: 90, source: 'CLAT Sample',
    passage: 'The Nagar Palika of a mid-sized Indian city is proposing to ban private cars from the city centre between 8 AM and 8 PM on all weekdays. The proposal argues that this will reduce traffic congestion, lower air pollution, and encourage the use of public transport. Business owners in the affected area are strongly opposing the ban, arguing it will significantly reduce footfall to their shops and hurt their revenues. The municipality counters that cities like Oslo and Amsterdam that implemented similar bans reported no drop in retail revenue and a measurable improvement in air quality.',
    principle: null,
    questions: [
      {
        question: 'Which of the following, if true, would most strongly SUPPORT the municipality\'s proposal?',
        options: [
          'Parking fees in the city centre have increased by 35% in the past two years',
          'A survey shows 78% of current city centre visitors arrive by private car',
          'Cities that banned cars from commercial zones reported a 28% rise in footfall due to increased pedestrian comfort',
          'Air pollution in the city has been above safe limits for three consecutive years'
        ],
        correct: 2,
        explanation: 'This directly counters the business owners\' concern (reduced footfall) while supporting the municipality\'s broader goals. It provides evidence that the ban leads to better outcomes for businesses, making it the strongest piece of support.'
      },
      {
        question: 'The business owners\' argument rests on which underlying assumption?',
        options: [
          'A majority of customers who visit city centre shops arrive by private car',
          'Public transport in the city is too unreliable to substitute private car travel',
          'The ban will not have an exemption for delivery and commercial vehicles',
          'Air pollution is not currently a significant concern for the city\'s residents'
        ],
        correct: 0,
        explanation: 'For the ban to reduce footfall, customers who currently drive must be unable or unwilling to switch to other modes. The assumption is that most customers arrive by car — without this, the ban would not affect footfall at all.'
      },
      {
        question: 'What is a significant flaw in the municipality\'s reasoning?',
        options: [
          'It assumes that banning cars will automatically reduce pollution',
          'It fails to address whether the city\'s public transport has the capacity to absorb the additional commuters displaced by the ban',
          'It cites evidence from European cities without considering local cultural differences',
          'It has not consulted residents about their preferred modes of transport'
        ],
        correct: 1,
        explanation: 'The proposal assumes people will shift to public transport, but if buses and trains cannot handle the additional load, the ban may create chaos rather than smooth the commute — undermining both the congestion and public transport goals.'
      }
    ]
  },
  {
    id: 4,
    section: 'Quantitative Techniques', topic: 'Profit and Loss', difficulty: 'medium',
    timeLimit: 90, source: 'CLAT Sample',
    passage: 'Ravi is a fruit vendor who spent his entire daily capital of ₹500 buying apples at ₹5 per apple. He sold all the apples at ₹8 per apple. The next day, he used his total earnings from the previous day to buy mangoes at ₹10 per mango, and sold all the mangoes at ₹12 per mango.',
    principle: null,
    questions: [
      {
        question: 'How many apples did Ravi buy, and what was his profit percentage on Day 1?',
        options: [
          '80 apples, 50% profit',
          '100 apples, 60% profit',
          '100 apples, 50% profit',
          '80 apples, 60% profit'
        ],
        correct: 1,
        explanation: 'Apples bought = ₹500 ÷ ₹5 = 100 apples. Revenue = 100 × ₹8 = ₹800. Profit = ₹800 − ₹500 = ₹300. Profit % = (300/500) × 100 = 60%.'
      },
      {
        question: 'How many mangoes did Ravi buy on Day 2, and what was his total revenue after selling them?',
        options: [
          '70 mangoes, ₹840',
          '80 mangoes, ₹960',
          '80 mangoes, ₹840',
          '70 mangoes, ₹960'
        ],
        correct: 1,
        explanation: 'Ravi\'s Day 1 earnings = ₹800. Mangoes bought = ₹800 ÷ ₹10 = 80 mangoes. Revenue from selling = 80 × ₹12 = ₹960.'
      },
      {
        question: 'What was Ravi\'s total profit across both days combined?',
        options: [
          '₹280',
          '₹300',
          '₹460',
          '₹380'
        ],
        correct: 2,
        explanation: 'Day 1 profit = ₹800 − ₹500 = ₹300. Day 2 profit = ₹960 − ₹800 = ₹160. Total profit = ₹300 + ₹160 = ₹460.'
      }
    ]
  }
];

// ─── Normalize old or new format ────────────────────────────────────────────
function normalizeData(raw) {
  if (!raw || !raw.length) return [];
  // Old format: items have .options directly (individual questions)
  if (raw[0].options && !raw[0].questions) {
    return raw.map(q => ({
      id: q.id, section: q.section, topic: q.topic || 'General',
      difficulty: q.difficulty || 'medium', timeLimit: q.timeLimit || 90,
      source: q.source || '', passage: q.passage || '', principle: q.principle || null,
      questions: [{
        question: q.question, options: q.options,
        correct: q.correct, explanation: q.explanation || ''
      }]
    }));
  }
  return raw;
}

// ─── Adaptive Session Builder ────────────────────────────────────────────────
function buildAdaptiveSession(allSets, userHistory, sessionSetCount = 4) {
  const SECTIONS = [
    'Legal Reasoning', 'English Language', 'Logical Reasoning',
    'Quantitative Techniques', 'Current Affairs'
  ];

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

  const getAcc = s =>
    sectionPerf[s]?.attempted > 0 ? sectionPerf[s].correct / sectionPerf[s].attempted : null;

  const bySection = {};
  SECTIONS.forEach(s => { bySection[s] = allSets.filter(set => set.section === s); });
  const sectionsAvailable = SECTIONS.filter(s => bySection[s].length > 0);

  const selected = [];
  const usedIds = new Set();

  // Guarantee 1 set from every available section
  sectionsAvailable.forEach(section => {
    const acc = getAcc(section);
    const target = acc === null ? 'medium' : acc < 0.4 ? 'easy' : acc > 0.75 ? 'hard' : 'medium';
    const pool = bySection[section];
    const preferred = pool.filter(s => s.difficulty === target);
    const candidates = preferred.length > 0 ? preferred : pool;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    if (picked) { selected.push(picked); usedIds.add(picked.id); }
  });

  // Fill remaining slots with weighted picks
  const remaining = sessionSetCount - selected.length;
  if (remaining > 0 && sectionsAvailable.length > 0) {
    const weights = sectionsAvailable.map(s => ({
      section: s,
      weight: (() => { const acc = getAcc(s); return acc === null ? 1 : Math.max(0.15, 1.4 - acc * 1.25); })()
    }));
    const totalW = weights.reduce((sum, w) => sum + w.weight, 0);

    for (let i = 0; i < remaining; i++) {
      let rand = Math.random() * totalW;
      let chosen = sectionsAvailable[0];
      for (const { section, weight } of weights) { rand -= weight; if (rand <= 0) { chosen = section; break; } }
      const avail = bySection[chosen].filter(s => !usedIds.has(s.id));
      if (!avail.length) continue;
      const acc = getAcc(chosen);
      const target = acc === null ? 'medium' : acc < 0.4 ? 'easy' : acc > 0.75 ? 'hard' : 'medium';
      const preferred = avail.filter(s => s.difficulty === target);
      const picked = (preferred.length > 0 ? preferred : avail)[Math.floor(Math.random() * (preferred.length > 0 ? preferred : avail).length)];
      if (picked) { selected.push(picked); usedIds.add(picked.id); }
    }
  }

  return selected.sort(() => Math.random() - 0.5);
}

function getSessionSets(user) {
  const raw = JSON.parse(localStorage.getItem('examninjaQuestions') || '[]');
  const allSets = normalizeData(raw.length > 0 ? raw : defaultSets);
  const history = user ? JSON.parse(localStorage.getItem(`examninjaResults_${user.username}`) || '[]') : [];
  return buildAdaptiveSession(allSets, history);
}

// ─── Component ────────────────────────────────────────────────────────────────
function Practice({ user, onFinish, onBack }) {
  const [sessionSets, setSessionSets] = useState(() => getSessionSets(user));
  const [currentSetIdx, setCurrentSetIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => sessionSets[0]?.timeLimit || 90);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');

  const currentSet = sessionSets[currentSetIdx];
  const currentQ = currentSet?.questions[currentQIdx];
  const totalQuestions = sessionSets.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
  const globalQNum = sessionSets.slice(0, currentSetIdx).reduce((sum, s) => sum + (s.questions?.length || 0), 0) + currentQIdx;

  const getAnswerFor = (setIdx, qIdx) => answers.find(a => a.setIdx === setIdx && a.qIdx === qIdx);

  // Timer
  useEffect(() => {
    if (finished) return;
    if (timeLeft === 0) { handleNext(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, currentSetIdx, currentQIdx, finished]); // eslint-disable-line

  const handleSelect = (optIdx) => {
    if (selected !== null || !currentQ) return;
    const isCorrect = optIdx === currentQ.correct;
    setSelected(optIdx);
    setShowExplanation(true);
    if (isCorrect) setScore(p => p + 1);
    setAnswers(prev => [...prev, {
      setIdx: currentSetIdx, qIdx: currentQIdx,
      section: currentSet.section, topic: currentSet.topic || 'General',
      difficulty: currentSet.difficulty || 'medium',
      selected: optIdx, correct: currentQ.correct, isCorrect
    }]);
  };

  const handleNext = () => {
    if (!currentSet) return;
    if (currentQIdx + 1 < currentSet.questions.length) {
      setCurrentQIdx(p => p + 1);
      setSelected(null); setShowExplanation(false);
      setTimeLeft(currentSet.timeLimit || 90);
    } else if (currentSetIdx + 1 < sessionSets.length) {
      const next = sessionSets[currentSetIdx + 1];
      setCurrentSetIdx(p => p + 1);
      setCurrentQIdx(0);
      setSelected(null); setShowExplanation(false);
      setTimeLeft(next.timeLimit || 90);
    } else {
      saveResults();
      setFinished(true);
    }
  };

  const saveResults = () => {
    if (!user) return;
    const sections = {}, topics = {};
    answers.forEach(a => {
      if (!sections[a.section]) sections[a.section] = { attempted: 0, correct: 0 };
      sections[a.section].attempted++;
      if (a.isCorrect) sections[a.section].correct++;
      if (!topics[a.topic]) topics[a.topic] = { attempted: 0, correct: 0 };
      topics[a.topic].attempted++;
      if (a.isCorrect) topics[a.topic].correct++;
    });
    const session = { date: new Date().toISOString(), totalQuestions, correct: score, sections, topics };
    const key = `examninjaResults_${user.username}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([...existing, session]));
  };

  const handleRestart = () => {
    const newSets = getSessionSets(user);
    setSessionSets(newSets);
    setCurrentSetIdx(0); setCurrentQIdx(0);
    setSelected(null); setShowExplanation(false);
    setScore(0); setAnswers([]); setFinished(false);
    setTimeLeft(newSets[0]?.timeLimit || 90);
    setAiInitialPrompt('');
  };

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!sessionSets.length || !currentSet) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif", textAlign: 'center', padding: '40px'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
          <h2 style={{ marginBottom: '12px' }}>No questions yet</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '28px' }}>The admin hasn't added any passage sets yet.</p>
          <button onClick={onBack} style={{
            background: 'linear-gradient(90deg, #f7971e, #ffd200)',
            border: 'none', borderRadius: '50px', padding: '12px 32px',
            color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
          }}>← Go Back</button>
        </div>
      </div>
    );
  }

  // ── Results screen ─────────────────────────────────────────────────────────
  if (finished) {
    const pct = Math.round((score / totalQuestions) * 100);
    const sectionSummary = {};
    answers.forEach(a => {
      if (!sectionSummary[a.section]) sectionSummary[a.section] = { attempted: 0, correct: 0 };
      sectionSummary[a.section].attempted++;
      if (a.isCorrect) sectionSummary[a.section].correct++;
    });
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
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
              fontSize: '64px', fontWeight: '800', marginBottom: '6px',
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {score}/{totalQuestions}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
              {pct >= 80 ? 'Excellent! You are a true ninja! 🔥' :
               pct >= 60 ? 'Good work! Keep the momentum going!' :
               'Every session makes you better. Keep going!'}
            </p>
          </div>

          {Object.keys(sectionSummary).length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: '14px',
              padding: '18px', marginBottom: '24px'
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Section Breakdown
              </div>
              {Object.entries(sectionSummary).map(([section, data]) => {
                const sp = Math.round((data.correct / data.attempted) * 100);
                const col = sp >= 70 ? '#4ade80' : sp >= 50 ? '#fbbf24' : '#f87171';
                return (
                  <div key={section} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>{section}</span>
                      <span style={{ color: col }}>{data.correct}/{data.attempted}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '5px' }}>
                      <div style={{ width: `${sp}%`, height: '100%', borderRadius: '6px', background: col }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={handleRestart} style={{
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              border: 'none', borderRadius: '50px', padding: '14px',
              color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
            }}>New Adaptive Session 🥷</button>
            {user && (
              <button onClick={onFinish} style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50px', padding: '14px', color: 'white', cursor: 'pointer', fontSize: '15px'
              }}>View My Dashboard →</button>
            )}
          </div>
        </div>
        <AiAssistant context="The student just completed a CLAT practice session." initialPrompt={aiInitialPrompt} onInitialPromptUsed={() => setAiInitialPrompt('')} />
      </div>
    );
  }

  // ── Practice screen (split layout) ────────────────────────────────────────
  const isLastQInSet = currentQIdx + 1 >= currentSet.questions.length;
  const isLastSet = currentSetIdx + 1 >= sessionSets.length;
  const answeredWrong = selected !== null && selected !== currentQ.correct;

  const diffColor = currentSet.difficulty === 'easy' ? '#4ade80' : currentSet.difficulty === 'hard' ? '#ef4444' : '#fbbf24';
  const diffBg = currentSet.difficulty === 'easy' ? 'rgba(74,222,128,0.15)' : currentSet.difficulty === 'hard' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)';

  const aiContext = [
    `CLAT Practice — ${currentSet.section}${currentSet.topic ? ` | ${currentSet.topic}` : ''}`,
    `\nPassage:\n${currentSet.passage}`,
    currentSet.principle ? `\nPrinciple:\n${currentSet.principle}` : '',
    `\nQuestion: ${currentQ.question}`,
    `\nOptions:\n${currentQ.options.map((o, i) => `${['A','B','C','D'][i]}) ${o}`).join('\n')}`,
    `\nCorrect Answer: ${['A','B','C','D'][currentQ.correct]}) ${currentQ.options[currentQ.correct]}`,
    currentQ.explanation ? `\nExplanation: ${currentQ.explanation}` : ''
  ].join('');

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white', fontFamily: "'Segoe UI', sans-serif"
    }}>

      {/* ── Top bar ── */}
      <div style={{
        flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }} onClick={onBack}>
          🥷 ExamNinja
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {user && (
            <div style={{
              background: 'rgba(247,151,30,0.15)', border: '1px solid rgba(247,151,30,0.3)',
              borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#ffd200'
            }}>Adaptive</div>
          )}
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '20px',
            padding: '5px 14px', fontSize: '13px'
          }}>
            {score}/{globalQNum} correct
          </div>
          <div style={{
            background: timeLeft <= 15 ? 'rgba(255,50,50,0.3)' : 'rgba(255,255,255,0.1)',
            border: timeLeft <= 15 ? '1px solid rgba(255,50,50,0.5)' : 'none',
            borderRadius: '20px', padding: '5px 14px', fontSize: '13px',
            color: timeLeft <= 15 ? '#ff6b6b' : 'white'
          }}>
            ⏱️ {timeLeft}s
          </div>
        </div>
      </div>

      {/* ── Overall progress bar ── */}
      <div style={{ flexShrink: 0, height: '4px', background: 'rgba(255,255,255,0.08)' }}>
        <div style={{
          width: `${(globalQNum / totalQuestions) * 100}%`, height: '100%',
          background: 'linear-gradient(90deg, #f7971e, #ffd200)', transition: 'width 0.3s'
        }} />
      </div>

      {/* ── Split screen ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left: Passage panel */}
        <div style={{
          width: '44%', flexShrink: 0, overflowY: 'auto',
          padding: '28px 32px', borderRight: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Set indicator */}
          <div style={{
            fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '16px',
            textTransform: 'uppercase', letterSpacing: '0.6px'
          }}>
            Passage {currentSetIdx + 1} of {sessionSets.length}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <span style={{
              background: 'rgba(247,151,30,0.2)', border: '1px solid rgba(247,151,30,0.4)',
              borderRadius: '20px', padding: '3px 13px', fontSize: '11px', color: '#ffd200'
            }}>{currentSet.section}</span>
            <span style={{
              background: diffBg, borderRadius: '20px', padding: '3px 13px',
              fontSize: '11px', color: diffColor
            }}>{currentSet.difficulty}</span>
            {currentSet.topic && (
              <span style={{
                background: 'rgba(255,255,255,0.07)', borderRadius: '20px',
                padding: '3px 13px', fontSize: '11px', color: 'rgba(255,255,255,0.45)'
              }}>{currentSet.topic}</span>
            )}
          </div>

          {/* Passage */}
          <div style={{
            fontSize: '14px', lineHeight: '1.85', color: 'rgba(255,255,255,0.85)',
            marginBottom: currentSet.principle ? '20px' : '0'
          }}>
            {currentSet.passage}
          </div>

          {/* Principle */}
          {currentSet.principle && (
            <div style={{
              background: 'rgba(247,151,30,0.08)', border: '1px solid rgba(247,151,30,0.2)',
              borderRadius: '12px', padding: '16px', marginTop: '20px',
              fontSize: '13px', color: '#ffd200', lineHeight: '1.7', whiteSpace: 'pre-line'
            }}>
              {currentSet.principle}
            </div>
          )}
        </div>

        {/* Right: Question panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

          {/* Question dots */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginRight: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Q{currentQIdx + 1} of {currentSet.questions.length}
            </span>
            {currentSet.questions.map((_, i) => {
              const ans = getAnswerFor(currentSetIdx, i);
              const isCurr = i === currentQIdx;
              return (
                <div key={i} style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: '700',
                  background: isCurr
                    ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                    : ans?.isCorrect ? 'rgba(74,222,128,0.35)'
                    : ans ? 'rgba(239,68,68,0.35)'
                    : 'rgba(255,255,255,0.1)',
                  color: isCurr ? '#000' : 'white',
                  border: isCurr ? 'none'
                    : ans?.isCorrect ? '1px solid rgba(74,222,128,0.5)'
                    : ans ? '1px solid rgba(239,68,68,0.4)'
                    : '1px solid rgba(255,255,255,0.12)'
                }}>
                  {isCurr ? i + 1 : ans ? (ans.isCorrect ? '✓' : '✗') : i + 1}
                </div>
              );
            })}
          </div>

          {/* Question text */}
          <h3 style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '22px', color: 'white' }}>
            {currentQ.question}
          </h3>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentQ.options.map((option, idx) => (
              <button key={idx} onClick={() => handleSelect(idx)} style={{
                background: selected === null ? 'rgba(255,255,255,0.04)'
                  : idx === currentQ.correct ? 'rgba(74,222,128,0.18)'
                  : selected === idx ? 'rgba(255,100,100,0.18)'
                  : 'rgba(255,255,255,0.04)',
                border: selected === null ? '1px solid rgba(255,255,255,0.1)'
                  : idx === currentQ.correct ? '1px solid rgba(74,222,128,0.5)'
                  : selected === idx ? '1px solid rgba(255,100,100,0.5)'
                  : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px', padding: '13px 16px', color: 'white',
                textAlign: 'left', cursor: selected === null ? 'pointer' : 'default',
                fontSize: '14px', lineHeight: '1.5', transition: 'all 0.15s',
                display: 'flex', alignItems: 'flex-start', gap: '12px'
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                  background: 'rgba(255,255,255,0.1)', fontSize: '11px', fontWeight: '700',
                  marginTop: '1px'
                }}>
                  {['A','B','C','D'][idx]}
                </span>
                <span>{option}</span>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div style={{
              marginTop: '18px', background: 'rgba(74,222,128,0.08)',
              border: '1px solid rgba(74,222,128,0.25)', borderRadius: '12px',
              padding: '14px', fontSize: '13px', lineHeight: '1.7', color: 'rgba(255,255,255,0.82)'
            }}>
              <strong style={{ color: '#4ade80' }}>💡 Explanation: </strong>
              {currentQ.explanation}
            </div>
          )}

          {/* Ask AI (wrong answer only) */}
          {answeredWrong && (
            <button onClick={() => setAiInitialPrompt(
              `I just got this ${currentSet.section} question wrong. I chose option ${['A','B','C','D'][selected]}) "${currentQ.options[selected]}" but the correct answer is ${['A','B','C','D'][currentQ.correct]}) "${currentQ.options[currentQ.correct]}". Please explain step by step why my answer was wrong and how to think through this type of question.`
            )} style={{
              marginTop: '12px', width: '100%',
              background: 'rgba(247,151,30,0.1)', border: '1px solid rgba(247,151,30,0.3)',
              borderRadius: '10px', padding: '11px', color: '#ffd200',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              🤖 Ask AI to explain this
            </button>
          )}

          {/* Next button */}
          {selected !== null && (
            <button onClick={handleNext} style={{
              marginTop: '12px', width: '100%',
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              border: 'none', borderRadius: '50px', padding: '14px',
              color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
            }}>
              {isLastQInSet && isLastSet ? 'See Results 🏆'
               : isLastQInSet ? 'Next Passage →'
               : 'Next Question →'}
            </button>
          )}
        </div>
      </div>

      <AiAssistant
        context={aiContext}
        initialPrompt={aiInitialPrompt}
        onInitialPromptUsed={() => setAiInitialPrompt('')}
      />

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}

export default Practice;
