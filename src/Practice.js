import React, { useState, useEffect, useCallback } from 'react';
import AiAssistant from './AiAssistant';

// ─── Launch Gate ─────────────────────────────────────────────────────────────
// Set to false on September 1 to unlock the full platform.
const PRE_LAUNCH = true;
const LAUNCH_DATE = 'September 1, 2026';
const FREE_QUESTION_LIMIT = 10;

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
        explanation: 'Principle 2 establishes liability based on damage caused, not on intent or the lawfulness of the activity. Since Arjun\'s factory directly caused harm to Maya\'s crops, she will succeed. The key insight: liability is strict — Arjun cannot escape by saying he didn\'t mean to cause harm.'
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
        explanation: 'Principle 2 is clear — liability arises from causing damage, not from negligence or intent. The principle says "regardless of intent," which covers accidents. Even an accidental malfunction does not shield Arjun if his factory\'s effluents caused Maya\'s loss. This is called strict liability.'
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
        explanation: 'Where damage has multiple contributing causes, a defendant is liable only for the harm they specifically caused or materially worsened. Arjun would be liable for the incremental harm attributable to his factory\'s discharge. Courts apportion liability based on contribution — Arjun didn\'t create all the pollution, only some of it.'
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
        explanation: 'The author explicitly concludes that "technology is a tool, and its effect depends entirely on how it is used." This "it depends on usage" position is the author\'s own view, placed deliberately at the end of the passage. When authors use phrases like "the truth lies somewhere in between," they are signalling their own balanced position — not avoiding a conclusion.'
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
        explanation: 'To weaken an argument, find evidence that directly contradicts its core claim. The critics claim digital interactions are shallow and reduce empathy. Research showing video calls build empathy as well as face-to-face meetings directly contradicts both claims. Options A, C, and D actually support or are neutral to the critics\' view.'
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
        explanation: 'This directly counters the business owners\' concern about reduced footfall while supporting the municipality\'s goals. It provides evidence that the ban leads to better outcomes for businesses — the opposite of what opponents fear. Option B actually strengthens the opposition. Option D only addresses pollution, not the main controversy about retail impact.'
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
        explanation: 'For the ban to reduce footfall, customers who currently drive must be unable or unwilling to switch to other modes. The core assumption is that most customers arrive by car — without this, the ban would not affect footfall at all. An assumption is a gap in the argument\'s reasoning that must be true for the conclusion to hold.'
      },
      {
        question: 'What is a significant flaw in the municipality\'s reasoning?',
        options: [
          'It assumes that banning cars will automatically reduce pollution',
          'It fails to address whether the city\'s public transport has the capacity to absorb the additional commuters displaced by the ban',
          'It cites evidence from European cities without considering local cultural and infrastructure differences',
          'It has not consulted residents about their preferred modes of transport'
        ],
        correct: 1,
        explanation: 'The proposal assumes people will shift to public transport, but if buses and trains cannot handle the additional load, the ban may create chaos rather than ease congestion — directly undermining the proposal\'s own goal. Option C is also reasonable, but the public transport capacity issue is the most concrete operational flaw that would make the policy fail on its own terms.'
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
        explanation: 'Step 1: Apples bought = ₹500 ÷ ₹5 = 100 apples.\nStep 2: Revenue = 100 × ₹8 = ₹800.\nStep 3: Profit = ₹800 − ₹500 = ₹300.\nStep 4: Profit % = (Profit ÷ Cost Price) × 100 = (300 ÷ 500) × 100 = 60%.\n\nKey formula: Profit % = (Profit / CP) × 100. Always divide by the cost price, not selling price.'
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
        explanation: 'Step 1: Ravi\'s Day 1 earnings (his Day 2 capital) = ₹800.\nStep 2: Mangoes bought = ₹800 ÷ ₹10 = 80 mangoes.\nStep 3: Revenue from selling mangoes = 80 × ₹12 = ₹960.\n\nNote: The question asks for revenue (total received), not profit. Don\'t subtract cost here.'
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
        explanation: 'Step 1: Day 1 profit = Revenue − Cost = ₹800 − ₹500 = ₹300.\nStep 2: Day 2 profit = Revenue − Cost = ₹960 − ₹800 = ₹160.\nStep 3: Total profit = ₹300 + ₹160 = ₹460.\n\nCommon mistake: Students often add the revenues or costs incorrectly. Always calculate profit per day first, then add.'
      }
    ]
  }
];

// ─── Normalize old or new format ────────────────────────────────────────────
function normalizeData(raw) {
  if (!raw || !raw.length) return [];
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
function buildAdaptiveSession(allSets, userHistory, targetQuestionCount = 20) {
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

  const pickFromSection = (section, pool) => {
    const avail = pool.filter(s => !usedIds.has(s.id));
    if (!avail.length) return null;
    const acc = getAcc(section);
    const target = acc === null ? 'medium' : acc < 0.4 ? 'easy' : acc > 0.75 ? 'hard' : 'medium';
    const preferred = avail.filter(s => s.difficulty === target);
    const candidates = preferred.length > 0 ? preferred : avail;
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  // Phase 1: guarantee 1 set from every available section
  sectionsAvailable.forEach(section => {
    const picked = pickFromSection(section, bySection[section]);
    if (picked) { selected.push(picked); usedIds.add(picked.id); }
  });

  // Phase 2: keep adding weighted sets until we meet targetQuestionCount
  const currentQ = () => selected.reduce((sum, s) => sum + (s.questions?.length || 0), 0);

  const weights = sectionsAvailable.map(s => ({
    section: s,
    weight: (() => { const acc = getAcc(s); return acc === null ? 1 : Math.max(0.15, 1.4 - acc * 1.25); })()
  }));
  const totalW = weights.reduce((sum, w) => sum + w.weight, 0);

  let safety = 0;
  while (currentQ() < targetQuestionCount && safety < 50) {
    safety++;
    let rand = Math.random() * totalW;
    let chosen = sectionsAvailable[0];
    for (const { section, weight } of weights) { rand -= weight; if (rand <= 0) { chosen = section; break; } }
    const picked = pickFromSection(chosen, bySection[chosen]);
    if (!picked) break;
    selected.push(picked);
    usedIds.add(picked.id);
  }

  return selected.sort(() => Math.random() - 0.5);
}

// ─── Component ────────────────────────────────────────────────────────────────
function Practice({ user, onFinish, onBack }) {
  const [phase, setPhase] = useState('setup'); // 'setup' | 'practice' | 'results' | 'review'
  const [targetQuestions, setTargetQuestions] = useState(20);
  const [sessionSets, setSessionSets] = useState([]);
  const [currentSetIdx, setCurrentSetIdx] = useState(0);
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // no reveal — just tracks selection
  const [userAnswers, setUserAnswers] = useState([]); // filled at end of each question
  const [timeLeft, setTimeLeft] = useState(90);
  const [timedOut, setTimedOut] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [aiInitialPrompt, setAiInitialPrompt] = useState('');

  const allSetsRaw = JSON.parse(localStorage.getItem('examninjaQuestions') || '[]');
  const allSets = normalizeData(allSetsRaw.length > 0 ? allSetsRaw : defaultSets);
  const history = user ? JSON.parse(localStorage.getItem(`examninjaResults_${user.username}`) || '[]') : [];

  const currentSet = sessionSets[currentSetIdx];
  const currentQ = currentSet?.questions[currentQIdx];
  const totalQuestions = sessionSets.reduce((sum, s) => sum + (s.questions?.length || 0), 0);
  const globalQNum = sessionSets.slice(0, currentSetIdx).reduce((sum, s) => sum + (s.questions?.length || 0), 0) + currentQIdx + 1;

  // Build flat review list
  const allReviewItems = sessionSets.flatMap((set, sIdx) =>
    set.questions.map((q, qIdx) => ({
      set, sIdx, qIdx, q,
      answer: userAnswers.find(a => a.setIdx === sIdx && a.qIdx === qIdx) || null
    }))
  );

  // Timer — only runs during practice
  useEffect(() => {
    if (phase !== 'practice') return;
    if (timeLeft <= 0) {
      // Time's up — auto-record no answer and move on
      handleTimeOut();
      return;
    }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, phase]); // eslint-disable-line

  const handleTimeOut = useCallback(() => {
    if (!currentQ) return;
    setTimedOut(true);
    setUserAnswers(prev => [...prev, {
      setIdx: currentSetIdx, qIdx: currentQIdx,
      section: currentSet.section, topic: currentSet.topic || 'General',
      difficulty: currentSet.difficulty || 'medium',
      selected: null, correct: currentQ.correct, isCorrect: false, timedOut: true
    }]);
  }, [currentSetIdx, currentQIdx, currentSet, currentQ]);

  const handleSelect = (optIdx) => {
    if (selectedOption !== null || timedOut || !currentQ) return;
    setSelectedOption(optIdx);
    setUserAnswers(prev => [...prev, {
      setIdx: currentSetIdx, qIdx: currentQIdx,
      section: currentSet.section, topic: currentSet.topic || 'General',
      difficulty: currentSet.difficulty || 'medium',
      selected: optIdx, correct: currentQ.correct,
      isCorrect: optIdx === currentQ.correct, timedOut: false
    }]);
  };

  const advanceQuestion = () => {
    setSelectedOption(null);
    setTimedOut(false);
    if (currentQIdx + 1 < currentSet.questions.length) {
      setCurrentQIdx(p => p + 1);
      setTimeLeft(currentSet.timeLimit || 90);
    } else if (currentSetIdx + 1 < sessionSets.length) {
      const next = sessionSets[currentSetIdx + 1];
      setCurrentSetIdx(p => p + 1);
      setCurrentQIdx(0);
      setTimeLeft(next.timeLimit || 90);
    } else {
      saveResults();
      setPhase('results');
    }
  };

  const saveResults = () => {
    if (!user) return;
    const finalAnswers = [...userAnswers];
    // Include current unanswered question if somehow we get here without recording
    const sections = {}, topics = {};
    finalAnswers.forEach(a => {
      if (!sections[a.section]) sections[a.section] = { attempted: 0, correct: 0 };
      sections[a.section].attempted++;
      if (a.isCorrect) sections[a.section].correct++;
      if (!topics[a.topic]) topics[a.topic] = { attempted: 0, correct: 0 };
      topics[a.topic].attempted++;
      if (a.isCorrect) topics[a.topic].correct++;
    });
    const score = finalAnswers.filter(a => a.isCorrect).length;
    const session = {
      date: new Date().toISOString(),
      totalQuestions: finalAnswers.length,
      correct: score, sections, topics
    };
    const key = `examninjaResults_${user.username}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify([...existing, session]));
  };

  const startSession = () => {
    const effectiveTarget = PRE_LAUNCH ? FREE_QUESTION_LIMIT : targetQuestions;
    const sets = buildAdaptiveSession(allSets, history, effectiveTarget);
    setSessionSets(sets);
    setCurrentSetIdx(0);
    setCurrentQIdx(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setTimedOut(false);
    setTimeLeft(sets[0]?.timeLimit || 90);
    setPhase('practice');
  };

  const handleRestart = () => {
    setPhase('setup');
    setSessionSets([]);
    setUserAnswers([]);
    setSelectedOption(null);
    setTimedOut(false);
    setReviewIdx(0);
    setAiInitialPrompt('');
  };

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE: SETUP
  // ════════════════════════════════════════════════════════════════════════════
  if (phase === 'setup') {
    const options = [
      {
        count: 20,
        label: PRE_LAUNCH ? 'Free Preview' : 'Quick',
        emoji: '⚡',
        desc: PRE_LAUNCH ? `${FREE_QUESTION_LIMIT} questions · ~10 minutes` : '~20 minutes',
        note: PRE_LAUNCH ? 'Try ExamNinja before launch' : 'Great for a daily warm-up',
        locked: false,
        displayCount: PRE_LAUNCH ? FREE_QUESTION_LIMIT : 20
      },
      {
        count: 30, label: 'Standard', emoji: '🎯',
        desc: '~30 minutes', note: 'The recommended session length',
        locked: PRE_LAUNCH, displayCount: 30
      },
      {
        count: 40, label: 'Deep Dive', emoji: '🔥',
        desc: '~40 minutes', note: 'Full CLAT-intensity workout',
        locked: PRE_LAUNCH, displayCount: 40
      },
    ];

    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        color: 'white', fontFamily: "'Segoe UI', sans-serif",
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{ maxWidth: '480px', width: '100%' }}>
          {/* Back */}
          <button onClick={onBack} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontSize: '13px', marginBottom: '32px', padding: '0'
          }}>← Back</button>

          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '52px', marginBottom: '14px' }}>🥷</div>
            <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px' }}>
              {PRE_LAUNCH ? 'Try ExamNinja Free' : 'Choose Your Session'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px' }}>
              {PRE_LAUNCH
                ? `${FREE_QUESTION_LIMIT} adaptive questions, completely free. Full platform launches ${LAUNCH_DATE}.`
                : 'Questions are adapted to your weak areas across all 5 CLAT sections.'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            {options.map(opt => (
              <button
                key={opt.count}
                onClick={() => !opt.locked && setTargetQuestions(opt.count)}
                style={{
                  background: opt.locked
                    ? 'rgba(255,255,255,0.02)'
                    : targetQuestions === opt.count
                    ? 'linear-gradient(135deg, rgba(247,151,30,0.25), rgba(255,210,0,0.15))'
                    : 'rgba(255,255,255,0.04)',
                  border: opt.locked
                    ? '2px solid rgba(255,255,255,0.06)'
                    : targetQuestions === opt.count
                    ? '2px solid rgba(247,151,30,0.7)'
                    : '2px solid rgba(255,255,255,0.09)',
                  borderRadius: '16px', padding: '18px 22px',
                  cursor: opt.locked ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '16px', textAlign: 'left',
                  transition: 'all 0.15s', opacity: opt.locked ? 0.45 : 1
                }}>
                <span style={{ fontSize: '28px' }}>{opt.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: opt.locked ? 'rgba(255,255,255,0.4)' : 'white' }}>
                      {opt.label}
                    </span>
                    {opt.locked ? (
                      <span style={{
                        fontSize: '11px', fontWeight: '700', color: '#a78bfa',
                        background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)',
                        borderRadius: '20px', padding: '3px 10px'
                      }}>
                        🔒 Sept 1
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '20px', fontWeight: '800',
                        background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                      }}>
                        {opt.displayCount} Q
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '3px' }}>
                    {opt.desc} · {opt.note}
                  </div>
                </div>
                {!opt.locked && targetQuestions === opt.count && (
                  <span style={{ fontSize: '18px', color: '#ffd200' }}>✓</span>
                )}
              </button>
            ))}
          </div>

          {PRE_LAUNCH && (
            <div style={{
              background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: '12px', padding: '14px 18px', marginBottom: '20px',
              fontSize: '12px', color: 'rgba(167,139,250,0.9)', lineHeight: '1.65'
            }}>
              🚀 Full platform — 30 & 40 question sessions, all sections, AI Tutor — launches <strong>{LAUNCH_DATE}</strong>.
              You're already on the list.
            </div>
          )}

          <div style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px', padding: '14px 18px', marginBottom: '24px',
            fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: '1.6'
          }}>
            💡 Answers are revealed only <strong style={{ color: 'rgba(255,255,255,0.65)' }}>after</strong> your session ends.
            Review every question with detailed explanations at the end.
          </div>

          <button onClick={startSession} style={{
            width: '100%', background: 'linear-gradient(90deg, #f7971e, #ffd200)',
            border: 'none', borderRadius: '50px', padding: '16px',
            color: '#000', fontWeight: '800', cursor: 'pointer', fontSize: '16px',
            letterSpacing: '0.3px'
          }}>
            {PRE_LAUNCH ? `Start Free Preview 🥷` : `Start ${targetQuestions}-Question Session 🥷`}
          </button>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE: PRACTICE
  // ════════════════════════════════════════════════════════════════════════════
  if (phase === 'practice') {
    if (!sessionSets.length || !currentSet) {
      return (
        <div style={{
          minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Segoe UI', sans-serif", textAlign: 'center', padding: '40px'
        }}>
          <div>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h2 style={{ marginBottom: '12px' }}>No questions available</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '28px' }}>Ask an admin to add passage sets.</p>
            <button onClick={onBack} style={{
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              border: 'none', borderRadius: '50px', padding: '12px 32px',
              color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px'
            }}>← Go Back</button>
          </div>
        </div>
      );
    }

    const isLastQInSet = currentQIdx + 1 >= currentSet.questions.length;
    const isLastSet = currentSetIdx + 1 >= sessionSets.length;
    const canAdvance = selectedOption !== null || timedOut;
    const diffColor = currentSet.difficulty === 'easy' ? '#4ade80' : currentSet.difficulty === 'hard' ? '#ef4444' : '#fbbf24';
    const diffBg = currentSet.difficulty === 'easy' ? 'rgba(74,222,128,0.12)' : currentSet.difficulty === 'hard' ? 'rgba(239,68,68,0.12)' : 'rgba(251,191,36,0.12)';

    return (
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        color: 'white', fontFamily: "'Segoe UI', sans-serif"
      }}>

        {/* Top bar */}
        <div style={{
          flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{ fontSize: '17px', fontWeight: 'bold', cursor: 'pointer' }} onClick={onBack}>
            🥷 ExamNinja
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              background: 'rgba(255,255,255,0.08)', borderRadius: '20px',
              padding: '5px 13px', fontSize: '13px'
            }}>
              {globalQNum}/{totalQuestions}
            </div>
            <div style={{
              background: timeLeft <= 15 ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)',
              border: timeLeft <= 15 ? '1px solid rgba(239,68,68,0.5)' : '1px solid transparent',
              borderRadius: '20px', padding: '5px 13px', fontSize: '13px',
              color: timeLeft <= 15 ? '#f87171' : 'white',
              transition: 'all 0.3s'
            }}>
              ⏱ {timeLeft}s
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ flexShrink: 0, height: '3px', background: 'rgba(255,255,255,0.07)' }}>
          <div style={{
            width: `${((globalQNum - 1) / totalQuestions) * 100}%`, height: '100%',
            background: 'linear-gradient(90deg, #f7971e, #ffd200)', transition: 'width 0.4s ease'
          }} />
        </div>

        {/* Split screen */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

          {/* Left: Passage */}
          <div style={{
            width: '44%', flexShrink: 0, overflowY: 'auto',
            padding: '28px 30px', borderRight: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              Passage {currentSetIdx + 1} of {sessionSets.length}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <span style={{ background: 'rgba(247,151,30,0.18)', border: '1px solid rgba(247,151,30,0.35)', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: '#ffd200' }}>
                {currentSet.section}
              </span>
              <span style={{ background: diffBg, borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: diffColor }}>
                {currentSet.difficulty}
              </span>
              {currentSet.topic && (
                <span style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                  {currentSet.topic}
                </span>
              )}
            </div>
            <div style={{ fontSize: '14px', lineHeight: '1.85', color: 'rgba(255,255,255,0.82)', marginBottom: currentSet.principle ? '20px' : 0 }}>
              {currentSet.passage}
            </div>
            {currentSet.principle && (
              <div style={{
                background: 'rgba(247,151,30,0.07)', border: '1px solid rgba(247,151,30,0.2)',
                borderRadius: '12px', padding: '14px 16px', marginTop: '18px',
                fontSize: '13px', color: '#ffd200', lineHeight: '1.7', whiteSpace: 'pre-line'
              }}>
                {currentSet.principle}
              </div>
            )}
          </div>

          {/* Right: Question */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '28px 30px' }}>
            {/* Q dots within set */}
            <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '22px' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.5px', marginRight: '4px' }}>
                Q{currentQIdx + 1}/{currentSet.questions.length}
              </span>
              {currentSet.questions.map((_, i) => {
                const isCurr = i === currentQIdx;
                const ans = userAnswers.find(a => a.setIdx === currentSetIdx && a.qIdx === i);
                return (
                  <div key={i} style={{
                    width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '700',
                    background: isCurr
                      ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                      : ans
                      ? 'rgba(255,255,255,0.15)'
                      : 'rgba(255,255,255,0.07)',
                    color: isCurr ? '#000' : 'rgba(255,255,255,0.6)',
                    border: isCurr ? 'none' : ans ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {ans ? '·' : i + 1}
                  </div>
                );
              })}
            </div>

            {/* Question text */}
            <h3 style={{ fontSize: '16px', lineHeight: '1.65', marginBottom: '20px', color: 'white', fontWeight: '600' }}>
              {currentQ.question}
            </h3>

            {/* Timed out banner */}
            {timedOut && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '10px 14px', marginBottom: '14px',
                fontSize: '13px', color: '#f87171'
              }}>
                ⏱ Time's up — moving on. You'll see the answer in the review.
              </div>
            )}

            {/* Options — NO colour reveal during practice */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                return (
                  <button key={idx} onClick={() => handleSelect(idx)} style={{
                    background: isSelected
                      ? 'rgba(255,255,255,0.12)'
                      : 'rgba(255,255,255,0.04)',
                    border: isSelected
                      ? '1px solid rgba(255,255,255,0.45)'
                      : '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '12px', padding: '13px 16px', color: 'white',
                    textAlign: 'left', cursor: canAdvance ? 'default' : 'pointer',
                    fontSize: '14px', lineHeight: '1.5', transition: 'all 0.12s',
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    opacity: timedOut ? 0.5 : 1
                  }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                      background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.09)',
                      fontSize: '11px', fontWeight: '700', marginTop: '1px',
                      color: isSelected ? 'white' : 'rgba(255,255,255,0.5)'
                    }}>
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    <span>{option}</span>
                    {isSelected && (
                      <span style={{ marginLeft: 'auto', flexShrink: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        ✓ recorded
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next button — only shown after answering or timing out */}
            {canAdvance && (
              <button onClick={advanceQuestion} style={{
                marginTop: '18px', width: '100%',
                background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                border: 'none', borderRadius: '50px', padding: '14px',
                color: '#000', fontWeight: '800', cursor: 'pointer', fontSize: '15px',
                letterSpacing: '0.3px'
              }}>
                {isLastQInSet && isLastSet ? 'Finish & See Results 🏆' : isLastQInSet ? 'Next Passage →' : 'Next Question →'}
              </button>
            )}
          </div>
        </div>

        <AiAssistant
          context={`CLAT Practice — ${currentSet.section} | ${currentSet.topic || ''}\nPassage: ${currentSet.passage}\n${currentSet.principle ? `Principle: ${currentSet.principle}\n` : ''}Question: ${currentQ.question}\nOptions:\n${currentQ.options.map((o, i) => `${['A','B','C','D'][i]}) ${o}`).join('\n')}`}
          initialPrompt={aiInitialPrompt}
          onInitialPromptUsed={() => setAiInitialPrompt('')}
        />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE: RESULTS
  // ════════════════════════════════════════════════════════════════════════════
  if (phase === 'results') {
    const score = userAnswers.filter(a => a.isCorrect).length;
    const attempted = userAnswers.length;
    const pct = attempted > 0 ? Math.round((score / attempted) * 100) : 0;

    const sectionSummary = {};
    userAnswers.forEach(a => {
      if (!sectionSummary[a.section]) sectionSummary[a.section] = { attempted: 0, correct: 0 };
      sectionSummary[a.section].attempted++;
      if (a.isCorrect) sectionSummary[a.section].correct++;
    });

    const sectionColors = {
      'Legal Reasoning': '#f7971e', 'English Language': '#4ade80',
      'Logical Reasoning': '#60a5fa', 'Quantitative Techniques': '#f472b6',
      'Current Affairs': '#a78bfa'
    };

    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        color: 'white', fontFamily: "'Segoe UI', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
      }}>
        <div style={{ maxWidth: '520px', width: '100%' }}>
          {/* Score card */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', padding: '40px 36px', marginBottom: '16px', textAlign: 'center'
          }}>
            <div style={{ fontSize: '52px', marginBottom: '14px' }}>
              {pct >= 80 ? '🏆' : pct >= 60 ? '🥷' : '💪'}
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>Session Complete!</h1>
            <div style={{
              fontSize: '68px', fontWeight: '900', lineHeight: 1.1, marginBottom: '6px',
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {score}/{attempted}
            </div>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>
              {pct >= 80 ? '🔥 Excellent — CLAT ready!' : pct >= 60 ? 'Good work! Keep the momentum.' : 'Every session makes you sharper.'}
            </div>

            {/* Section breakdown */}
            {Object.keys(sectionSummary).length > 0 && (
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Section Breakdown
                </div>
                {Object.entries(sectionSummary).map(([section, data]) => {
                  const sp = Math.round((data.correct / data.attempted) * 100);
                  const col = sectionColors[section] || '#ffd200';
                  return (
                    <div key={section} style={{ marginBottom: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>{section}</span>
                        <span style={{ color: col, fontWeight: '700' }}>{data.correct}/{data.attempted}</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '5px' }}>
                        <div style={{ width: `${sp}%`, height: '100%', borderRadius: '6px', background: col, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pre-launch upsell */}
          {PRE_LAUNCH && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(96,165,250,0.08))',
              border: '1px solid rgba(167,139,250,0.3)',
              borderRadius: '16px', padding: '20px 22px', marginBottom: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚀</div>
              <div style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px', color: 'white' }}>
                Full platform launches {LAUNCH_DATE}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
                30 & 40 question adaptive sessions · All 5 sections · AI Tutor · Full mock tests.
                You're on the list — we'll notify you on launch day.
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <button onClick={() => { setReviewIdx(0); setPhase('review'); }} style={{
            width: '100%', background: 'linear-gradient(90deg, #f7971e, #ffd200)',
            border: 'none', borderRadius: '50px', padding: '16px',
            color: '#000', fontWeight: '800', cursor: 'pointer', fontSize: '16px',
            marginBottom: '10px'
          }}>
            📖 Review All Answers
          </button>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleRestart} style={{
              flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '50px', padding: '13px', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600'
            }}>
              {PRE_LAUNCH ? 'Try Again 🥷' : 'New Session 🥷'}
            </button>
            {user && (
              <button onClick={onFinish} style={{
                flex: 1, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '50px', padding: '13px', color: 'white', cursor: 'pointer', fontSize: '14px'
              }}>
                Dashboard →
              </button>
            )}
          </div>
        </div>
        <AiAssistant context="The student just completed a CLAT practice session and is viewing their results." initialPrompt="" onInitialPromptUsed={() => {}} />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // PHASE: REVIEW
  // ════════════════════════════════════════════════════════════════════════════
  if (phase === 'review') {
    const item = allReviewItems[reviewIdx];
    if (!item) return null;

    const { set, sIdx, qIdx, q, answer } = item;
    const isFirstQInSet = qIdx === 0;
    const isCorrect = answer?.isCorrect || false;
    const selectedIdx = answer?.selected ?? null;
    const correctIdx = q.correct;
    const labels = ['A', 'B', 'C', 'D'];

    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        color: 'white', fontFamily: "'Segoe UI', sans-serif"
      }}>

        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)',
          position: 'sticky', top: 0, background: 'rgba(15,12,41,0.95)',
          backdropFilter: 'blur(8px)', zIndex: 10
        }}>
          <div style={{ fontSize: '17px', fontWeight: 'bold' }}>📖 Review</div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
              {reviewIdx + 1} / {allReviewItems.length}
            </span>
            <button onClick={() => setPhase('results')} style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: '20px', padding: '5px 14px', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: '12px'
            }}>← Results</button>
          </div>
        </div>

        {/* Dot navigation */}
        <div style={{
          display: 'flex', gap: '6px', padding: '14px 28px', flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          {allReviewItems.map((it, i) => (
            <button key={i} onClick={() => setReviewIdx(i)} style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', cursor: 'pointer', border: 'none',
              background: i === reviewIdx
                ? 'linear-gradient(135deg, #f7971e, #ffd200)'
                : it.answer?.isCorrect ? 'rgba(74,222,128,0.35)'
                : it.answer?.timedOut ? 'rgba(255,255,255,0.1)'
                : it.answer ? 'rgba(239,68,68,0.35)'
                : 'rgba(255,255,255,0.1)',
              color: i === reviewIdx ? '#000' : 'white',
              outline: i === reviewIdx ? '2px solid rgba(247,151,30,0.6)' : 'none',
              outlineOffset: '2px'
            }}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '32px 24px' }}>

          {/* Passage — show when first question of a new set */}
          {isFirstQInSet && (
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '16px', padding: '22px 24px', marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                <span style={{ background: 'rgba(247,151,30,0.18)', border: '1px solid rgba(247,151,30,0.35)', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: '#ffd200' }}>
                  {set.section}
                </span>
                {set.topic && (
                  <span style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                    {set.topic}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '14px', lineHeight: '1.85', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                {set.passage}
              </p>
              {set.principle && (
                <div style={{
                  background: 'rgba(247,151,30,0.07)', border: '1px solid rgba(247,151,30,0.2)',
                  borderRadius: '10px', padding: '14px', marginTop: '16px',
                  fontSize: '13px', color: '#ffd200', lineHeight: '1.7', whiteSpace: 'pre-line'
                }}>
                  {set.principle}
                </div>
              )}
            </div>
          )}

          {/* Result badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: isCorrect ? 'rgba(74,222,128,0.12)' : answer?.timedOut ? 'rgba(255,255,255,0.07)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.35)' : answer?.timedOut ? 'rgba(255,255,255,0.15)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: '20px', padding: '5px 14px', fontSize: '12px', fontWeight: '700',
            color: isCorrect ? '#4ade80' : answer?.timedOut ? 'rgba(255,255,255,0.4)' : '#f87171',
            marginBottom: '16px'
          }}>
            {isCorrect ? '✓ Correct' : answer?.timedOut ? '⏱ Timed Out' : '✗ Incorrect'}
          </div>

          {/* Question text */}
          <h2 style={{ fontSize: '17px', lineHeight: '1.65', marginBottom: '20px', color: 'white', fontWeight: '600' }}>
            {q.question}
          </h2>

          {/* Options with reveal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px' }}>
            {q.options.map((option, idx) => {
              const isThisCorrect = idx === correctIdx;
              const isThisSelected = idx === selectedIdx;
              const isWrongSelected = isThisSelected && !isThisCorrect;

              let bg = 'rgba(255,255,255,0.04)';
              let border = '1px solid rgba(255,255,255,0.09)';
              let labelColor = 'rgba(255,255,255,0.5)';
              let textColor = 'rgba(255,255,255,0.7)';
              let badge = null;

              if (isThisCorrect) {
                bg = 'rgba(74,222,128,0.12)';
                border = '1px solid rgba(74,222,128,0.45)';
                labelColor = '#4ade80';
                textColor = 'white';
                badge = <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#4ade80', fontWeight: '700', flexShrink: 0 }}>✓ Correct</span>;
              } else if (isWrongSelected) {
                bg = 'rgba(239,68,68,0.1)';
                border = '1px solid rgba(239,68,68,0.4)';
                labelColor = '#f87171';
                textColor = 'rgba(255,255,255,0.8)';
                badge = <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#f87171', fontWeight: '700', flexShrink: 0 }}>✗ Your answer</span>;
              }

              return (
                <div key={idx} style={{
                  background: bg, border, borderRadius: '12px', padding: '13px 16px',
                  display: 'flex', alignItems: 'flex-start', gap: '12px'
                }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                    background: isThisCorrect ? 'rgba(74,222,128,0.25)' : isWrongSelected ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.08)',
                    fontSize: '11px', fontWeight: '700', marginTop: '1px', color: labelColor
                  }}>
                    {labels[idx]}
                  </span>
                  <span style={{ fontSize: '14px', lineHeight: '1.5', color: textColor, flex: 1 }}>{option}</span>
                  {badge}
                </div>
              );
            })}
          </div>

          {/* Explanation box */}
          {q.explanation && (
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '22px', marginBottom: '16px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#ffd200', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                💡 Explanation
              </div>

              {/* Why correct */}
              <div style={{
                background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                borderRadius: '10px', padding: '14px 16px', marginBottom: '10px'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#4ade80', marginBottom: '6px' }}>
                  Why {labels[correctIdx]}) is correct
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.65', whiteSpace: 'pre-line' }}>
                  {q.explanation}
                </div>
              </div>

              {/* Why wrong — only if they got it wrong */}
              {!isCorrect && selectedIdx !== null && (
                <div style={{
                  background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: '10px', padding: '14px 16px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#f87171', marginBottom: '6px' }}>
                    You chose {labels[selectedIdx]}) — why this doesn't work
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.65' }}>
                    "{q.options[selectedIdx]}" — this option{' '}
                    {selectedIdx === 0 && correctIdx !== 0 ? 'misses a key part of the principle. ' : ''}
                    {selectedIdx === 2 && correctIdx !== 2 ? 'introduces a condition not stated in the principle or passage. ' : ''}
                    does not hold up against the principle or passage text. Re-read the correct explanation above to see what you should look for next time.
                  </div>
                </div>
              )}

              {answer?.timedOut && (
                <div style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px', padding: '12px 16px', marginTop: '10px',
                  fontSize: '13px', color: 'rgba(255,255,255,0.5)'
                }}>
                  ⏱ You ran out of time on this question. CLAT tip: if you're stuck after 60s, eliminate 2 options and pick the better one — never leave blank.
                </div>
              )}
            </div>
          )}

          {/* Ask AI button */}
          <button onClick={() => setAiInitialPrompt(
            `I'm reviewing a ${set.section} question${!isCorrect ? ` that I got wrong` : ''}. The question was: "${q.question}". The correct answer is ${labels[correctIdx]}) "${q.options[correctIdx]}".${!isCorrect && selectedIdx !== null ? ` I chose ${labels[selectedIdx]}) "${q.options[selectedIdx]}".` : ''} Please explain the concept behind this question and give me a technique to handle similar questions in CLAT.`
          )} style={{
            width: '100%', background: 'rgba(247,151,30,0.1)', border: '1px solid rgba(247,151,30,0.3)',
            borderRadius: '12px', padding: '14px', color: '#ffd200',
            cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginBottom: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            🤖 Get deeper AI explanation for this question
          </button>

          {/* Prev / Next */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setReviewIdx(p => Math.max(0, p - 1))} disabled={reviewIdx === 0} style={{
              flex: 1, background: reviewIdx === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: '50px', padding: '13px',
              color: reviewIdx === 0 ? 'rgba(255,255,255,0.2)' : 'white',
              cursor: reviewIdx === 0 ? 'default' : 'pointer', fontSize: '14px', fontWeight: '600'
            }}>
              ← Previous
            </button>
            {reviewIdx < allReviewItems.length - 1 ? (
              <button onClick={() => setReviewIdx(p => p + 1)} style={{
                flex: 1, background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                border: 'none', borderRadius: '50px', padding: '13px',
                color: '#000', cursor: 'pointer', fontSize: '14px', fontWeight: '800'
              }}>
                Next →
              </button>
            ) : (
              <button onClick={handleRestart} style={{
                flex: 1, background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                border: 'none', borderRadius: '50px', padding: '13px',
                color: '#000', cursor: 'pointer', fontSize: '14px', fontWeight: '800'
              }}>
                New Session 🥷
              </button>
            )}
          </div>
        </div>

        <AiAssistant
          context={`Reviewing CLAT ${set.section} question: "${q.question}"\nCorrect answer: ${labels[correctIdx]}) ${q.options[correctIdx]}\n${!isCorrect && selectedIdx !== null ? `Student chose: ${labels[selectedIdx]}) ${q.options[selectedIdx]}` : ''}`}
          initialPrompt={aiInitialPrompt}
          onInitialPromptUsed={() => setAiInitialPrompt('')}
        />
      </div>
    );
  }

  return null;
}

export default Practice;
