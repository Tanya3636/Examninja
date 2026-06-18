import React, { useState, useRef } from 'react';

const ADMIN_PASSWORD = 'examninja2026';

const SECTIONS = [
  'Legal Reasoning', 'English Language', 'Logical Reasoning',
  'Quantitative Techniques', 'Current Affairs'
];

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSVText(rawText) {
  const rows = [];
  const text = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  let pos = 0;

  const parseField = () => {
    let val = '';
    if (text[pos] === '"') {
      pos++;
      while (pos < text.length) {
        if (text[pos] === '"' && text[pos + 1] === '"') { val += '"'; pos += 2; }
        else if (text[pos] === '"') { pos++; break; }
        else { val += text[pos++]; }
      }
    } else {
      while (pos < text.length && text[pos] !== ',' && text[pos] !== '\n') val += text[pos++];
    }
    return val.trim();
  };

  while (pos < text.length) {
    if (text[pos] === '\n') { pos++; continue; }
    const row = [];
    while (pos < text.length && text[pos] !== '\n') {
      row.push(parseField());
      if (pos < text.length && text[pos] === ',') pos++;
    }
    if (pos < text.length && text[pos] === '\n') pos++;
    if (row.some(f => f !== '')) rows.push(row);
  }
  return rows;
}

// CSV format: set_id, section, topic, difficulty, timeLimit, source, passage, principle,
//             question, option_a, option_b, option_c, option_d, correct, explanation
function csvToSets(rows) {
  const errors = [];
  const first = rows[0]?.map(f => f.toLowerCase().replace(/[^a-z_]/g, '')) || [];
  const hasHeader = first[0] === 'setid' || first[0] === 'set_id' || first[8] === 'question';
  const dataRows = hasHeader ? rows.slice(1) : rows;

  const setMap = new Map();

  dataRows.forEach((row, i) => {
    const lineNum = i + (hasHeader ? 2 : 1);
    if (row.length < 14) { errors.push(`Row ${lineNum}: only ${row.length} columns (need 15)`); return; }

    const [setId, section, topic, difficulty, timeLimit, source, passage, principle,
      question, optA, optB, optC, optD, correct, explanation] = row;

    if (!SECTIONS.includes(section)) { errors.push(`Row ${lineNum}: unknown section "${section}"`); return; }
    if (!['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) { errors.push(`Row ${lineNum}: difficulty must be easy/medium/hard`); return; }
    const correctIdx = parseInt(correct);
    if (isNaN(correctIdx) || correctIdx < 0 || correctIdx > 3) { errors.push(`Row ${lineNum}: correct must be 0–3`); return; }
    if (!question.trim()) { errors.push(`Row ${lineNum}: question is empty`); return; }

    if (!setMap.has(setId)) {
      setMap.set(setId, {
        id: Date.now() + Math.random(),
        section, topic: topic || 'General',
        difficulty: difficulty.toLowerCase(),
        timeLimit: parseInt(timeLimit) || 90,
        source: source || '',
        passage: passage || '',
        principle: principle || null,
        questions: []
      });
    }

    setMap.get(setId).questions.push({
      question: question.trim(),
      options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
      correct: correctIdx,
      explanation: explanation || ''
    });
  });

  const parsed = Array.from(setMap.values()).filter(s => s.questions.length > 0);
  return { parsed, errors };
}

function downloadTemplate() {
  const header = 'set_id,section,topic,difficulty,timeLimit,source,passage,principle,question,option_a,option_b,option_c,option_d,correct,explanation';
  const rows = [
    `S1,Legal Reasoning,Environmental Tort,medium,90,Original,"Arjun owns a factory near a river. The factory releases chemical effluents that damage Maya the farmer's crops.","Principle: A person is liable for damage caused by their activity even if the activity is lawful.","Will Maya succeed in a claim against Arjun?","Yes — the principle makes him liable regardless of intent","No — Arjun's factory is lawful","Yes — but only if she proves negligence","No — she should have stopped using the river",0,"Under the principle, even lawful activity that causes harm creates liability. Maya will succeed."`,
    `S1,Legal Reasoning,Environmental Tort,medium,90,Original,"Arjun owns a factory near a river. The factory releases chemical effluents that damage Maya the farmer's crops.","Principle: A person is liable for damage caused by their activity even if the activity is lawful.","If Arjun proves the release was accidental, does Maya still succeed?","No — the accident removes liability","Yes — the principle does not require intent","Only if the accident was foreseeable","Only partial compensation is awarded",1,"The principle is clear — liability arises from damage caused, not from intent or negligence."`,
    `S2,English Language,Inference,easy,60,Original,"Scientists debate whether language shapes thought or thought shapes language. Recent bilingual studies suggest the relationship is bidirectional.",,What does the passage primarily suggest?,"Language determines thought completely","Thought determines language completely","Language and thought influence each other","Bilingual speakers think differently",2,"The passage explicitly states the relationship is bidirectional — each influences the other."`,
    `S2,English Language,Inference,easy,60,Original,"Scientists debate whether language shapes thought or thought shapes language. Recent bilingual studies suggest the relationship is bidirectional.",,Which assumption does the passage rely on?,"Bilingual speakers are better thinkers","Language research is always reliable","Both language and thought are observable and measurable","Cultural variation is irrelevant to language",2,"The passage draws conclusions based on bilingual studies, implying language and thought can be studied and measured."`
  ];
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'examninja_import_template.csv';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ─── Preview Modal ────────────────────────────────────────────────────────────
function SetPreview({ set, onClose }) {
  const [activeQ, setActiveQ] = useState(0);
  if (!set) return null;
  const q = set.questions[activeQ];
  const diffColor = set.difficulty === 'easy' ? '#4ade80' : set.difficulty === 'hard' ? '#ef4444' : '#fbbf24';

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000,
      display: 'flex', alignItems: 'stretch', overflow: 'hidden'
    }} onClick={onClose}>
      <div style={{
        margin: 'auto', width: '92%', maxWidth: '1000px', height: '80vh',
        background: '#13132b', border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '20px', display: 'flex', overflow: 'hidden',
        fontFamily: "'Segoe UI', sans-serif", color: 'white'
      }} onClick={e => e.stopPropagation()}>

        {/* Left — passage */}
        <div style={{
          width: '44%', flexShrink: 0, overflowY: 'auto', padding: '28px 28px',
          borderRight: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Student Preview
          </div>
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <span style={{ background: 'rgba(247,151,30,0.2)', border: '1px solid rgba(247,151,30,0.4)', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: '#ffd200' }}>{set.section}</span>
            <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: diffColor }}>{set.difficulty}</span>
            {set.topic && <span style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{set.topic}</span>}
          </div>
          <div style={{ fontSize: '14px', lineHeight: '1.85', color: 'rgba(255,255,255,0.82)' }}>{set.passage}</div>
          {set.principle && (
            <div style={{
              background: 'rgba(247,151,30,0.08)', border: '1px solid rgba(247,151,30,0.2)',
              borderRadius: '12px', padding: '14px', marginTop: '18px',
              fontSize: '13px', color: '#ffd200', lineHeight: '1.7', whiteSpace: 'pre-line'
            }}>{set.principle}</div>
          )}
        </div>

        {/* Right — question */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            {/* Question dots */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {set.questions.map((_, i) => (
                <button key={i} onClick={() => setActiveQ(i)} style={{
                  width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                  background: i === activeQ ? 'linear-gradient(135deg, #f7971e, #ffd200)' : 'rgba(255,255,255,0.1)',
                  color: i === activeQ ? '#000' : 'white', fontWeight: '700', fontSize: '12px',
                  cursor: 'pointer'
                }}>{i + 1}</button>
              ))}
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
              width: '30px', height: '30px', color: 'white', cursor: 'pointer', fontSize: '14px'
            }}>✕</button>
          </div>

          <h3 style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>{q.question}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {q.options.map((opt, idx) => (
              <div key={idx} style={{
                background: idx === q.correct ? 'rgba(74,222,128,0.18)' : 'rgba(255,255,255,0.04)',
                border: idx === q.correct ? '1px solid rgba(74,222,128,0.5)' : '1px solid rgba(255,255,255,0.09)',
                borderRadius: '12px', padding: '12px 16px', fontSize: '14px',
                display: 'flex', alignItems: 'flex-start', gap: '10px'
              }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                  background: idx === q.correct ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.1)',
                  fontSize: '11px', fontWeight: '700'
                }}>
                  {idx === q.correct ? '✓' : ['A','B','C','D'][idx]}
                </span>
                {opt}
              </div>
            ))}
          </div>

          {q.explanation && (
            <div style={{
              background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
              borderRadius: '12px', padding: '14px', fontSize: '13px', lineHeight: '1.7',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <strong style={{ color: '#4ade80' }}>💡 Explanation: </strong>{q.explanation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const emptyQ = () => ({ question: '', option0: '', option1: '', option2: '', option3: '', correct: '0', explanation: '' });
const blankForm = () => ({
  section: 'Legal Reasoning', difficulty: 'medium', timeLimit: '90',
  source: '', topic: '', passage: '', principle: '',
  questionBlocks: [emptyQ(), emptyQ(), emptyQ(), emptyQ()]
});

function Admin({ onBack }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [wrongPassword, setWrongPassword] = useState(false);

  const [questionSets, setQuestionSets] = useState(() => {
    const raw = localStorage.getItem('examninjaQuestions');
    return raw ? JSON.parse(raw) : [];
  });

  const [addTab, setAddTab] = useState('manual');
  const [form, setForm] = useState(blankForm());
  const [formSaved, setFormSaved] = useState(false);

  const fileInputRef = useRef(null);
  const [csvParsed, setCsvParsed] = useState(null);
  const [csvErrors, setCsvErrors] = useState([]);
  const [csvImported, setCsvImported] = useState(false);

  const [previewSet, setPreviewSet] = useState(null);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) setAuthenticated(true);
    else setWrongPassword(true);
  };

  // ── Manual form handlers ─────────────────────────────────────────────────
  const handleTopChange = (field, value) => { setForm(p => ({ ...p, [field]: value })); setFormSaved(false); };
  const handleQChange = (qi, field, value) => {
    setForm(p => {
      const blocks = [...p.questionBlocks];
      blocks[qi] = { ...blocks[qi], [field]: value };
      return { ...p, questionBlocks: blocks };
    });
    setFormSaved(false);
  };
  const addQBlock = () => {
    if (form.questionBlocks.length >= 5) return;
    setForm(p => ({ ...p, questionBlocks: [...p.questionBlocks, emptyQ()] }));
  };
  const removeQBlock = (qi) => {
    if (form.questionBlocks.length <= 1) return;
    setForm(p => ({ ...p, questionBlocks: p.questionBlocks.filter((_, i) => i !== qi) }));
  };

  const handleSave = () => {
    const validQs = form.questionBlocks
      .filter(q => q.question.trim() && q.option0.trim() && q.option1.trim() && q.option2.trim() && q.option3.trim())
      .map(q => ({
        question: q.question.trim(),
        options: [q.option0, q.option1, q.option2, q.option3],
        correct: parseInt(q.correct),
        explanation: q.explanation
      }));

    if (!form.passage.trim()) { alert('Please add a passage.'); return; }
    if (validQs.length === 0) { alert('Please complete at least one question with all 4 options.'); return; }

    const newSet = {
      id: Date.now(),
      section: form.section, topic: form.topic, difficulty: form.difficulty,
      timeLimit: parseInt(form.timeLimit), source: form.source,
      passage: form.passage, principle: form.principle || null,
      questions: validQs
    };
    const updated = [...questionSets, newSet];
    setQuestionSets(updated);
    localStorage.setItem('examninjaQuestions', JSON.stringify(updated));
    setFormSaved(true);
    setForm(blankForm());
  };

  // ── CSV handlers ─────────────────────────────────────────────────────────
  const processCSV = (text) => {
    setCsvImported(false);
    const rows = parseCSVText(text);
    const { parsed, errors } = csvToSets(rows);
    setCsvParsed(parsed); setCsvErrors(errors);
  };
  const handleFileSelect = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => processCSV(ev.target.result);
    reader.readAsText(file);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => processCSV(ev.target.result);
    reader.readAsText(file);
  };
  const handleCSVImport = () => {
    if (!csvParsed?.length) return;
    const updated = [...questionSets, ...csvParsed];
    setQuestionSets(updated);
    localStorage.setItem('examninjaQuestions', JSON.stringify(updated));
    setCsvImported(true); setCsvParsed(null); setCsvErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id) => {
    const updated = questionSets.filter(s => s.id !== id);
    setQuestionSets(updated);
    localStorage.setItem('examninjaQuestions', JSON.stringify(updated));
  };
  const handleClearAll = () => {
    if (!window.confirm(`Delete ALL ${questionSets.length} passage sets? Cannot be undone.`)) return;
    setQuestionSets([]);
    localStorage.setItem('examninjaQuestions', JSON.stringify([]));
  };

  // ── Styles ───────────────────────────────────────────────────────────────
  const inp = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)',
    color: 'white', fontSize: '14px', outline: 'none', marginBottom: '14px', boxSizing: 'border-box'
  };
  const lbl = {
    display: 'block', fontSize: '11px', color: 'rgba(255,255,255,0.45)',
    marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '48px', width: '360px', textAlign: 'center', color: 'white'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🥷</div>
          <h2 style={{ marginBottom: '8px' }}>Admin Panel</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>ExamNinja — Restricted Access</p>
          <input type="password" placeholder="Enter admin password" value={password}
            onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ ...inp, textAlign: 'center' }} />
          {wrongPassword && <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '16px' }}>Wrong password.</p>}
          <button onClick={handleLogin} style={{
            width: '100%', padding: '14px', borderRadius: '50px', border: 'none',
            background: 'linear-gradient(90deg, #f7971e, #ffd200)', color: '#000',
            fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'
          }}>Enter Admin Panel</button>
          <button onClick={onBack} style={{ marginTop: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px' }}>← Back</button>
        </div>
      </div>
    );
  }

  // ── Main panel ────────────────────────────────────────────────────────────
  const users = JSON.parse(localStorage.getItem('examninjaUsers') || '[]');
  const totalQuestions = questionSets.reduce((sum, s) => sum + (s.questions?.length || 0), 0);

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white', fontFamily: "'Segoe UI', sans-serif", padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>🥷 Admin Panel</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
              {questionSets.length} passage sets · {totalQuestions} total questions · {users.length} students
            </p>
          </div>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px', padding: '8px 20px', color: 'white', cursor: 'pointer', fontSize: '14px'
          }}>← Back to site</button>
        </div>

        {/* ── Add / Import card ── */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '36px', marginBottom: '32px'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {[{ key: 'manual', label: '✏️ Add Manually' }, { key: 'csv', label: '📥 Import CSV' }].map(tab => (
              <button key={tab.key} onClick={() => setAddTab(tab.key)} style={{
                padding: '9px 22px', borderRadius: '50px', border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px',
                background: addTab === tab.key ? 'linear-gradient(90deg, #f7971e, #ffd200)' : 'rgba(255,255,255,0.08)',
                color: addTab === tab.key ? '#000' : 'rgba(255,255,255,0.6)'
              }}>{tab.label}</button>
            ))}
          </div>

          {/* ── Manual ── */}
          {addTab === 'manual' && (
            <>
              <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>➕ Add New Passage Set</h2>

              {/* Top fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={lbl}>Section</label>
                  <select value={form.section} onChange={e => handleTopChange('section', e.target.value)} style={inp}>
                    {SECTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Difficulty</label>
                  <select value={form.difficulty} onChange={e => handleTopChange('difficulty', e.target.value)} style={inp}>
                    <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Topic</label>
                  <input type="text" placeholder="e.g. Tort Law, Inference" value={form.topic} onChange={e => handleTopChange('topic', e.target.value)} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Source</label>
                  <input type="text" placeholder="e.g. CLAT 2024, Original" value={form.source} onChange={e => handleTopChange('source', e.target.value)} style={inp} />
                </div>
              </div>

              <label style={lbl}>Time per Question (seconds)</label>
              <select value={form.timeLimit} onChange={e => handleTopChange('timeLimit', e.target.value)} style={inp}>
                <option value="60">60s — Easy</option><option value="90">90s — Medium</option><option value="120">120s — Hard</option>
              </select>

              {/* Passage */}
              <label style={lbl}>Passage</label>
              <textarea placeholder="Paste the full passage here. This will stay visible while students answer all questions below." value={form.passage} onChange={e => handleTopChange('passage', e.target.value)}
                style={{ ...inp, height: '130px', resize: 'vertical' }} />

              {/* Principle */}
              <label style={lbl}>Principle (Legal Reasoning only — leave blank for other sections)</label>
              <textarea placeholder="Principle 1: ...\n\nPrinciple 2: ..." value={form.principle} onChange={e => handleTopChange('principle', e.target.value)}
                style={{ ...inp, height: '70px', resize: 'vertical' }} />

              {/* Divider */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '24px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>
                  Questions ({form.questionBlocks.length}/5)
                </h3>
                {form.questionBlocks.length < 5 && (
                  <button onClick={addQBlock} style={{
                    background: 'rgba(247,151,30,0.1)', border: '1px solid rgba(247,151,30,0.3)',
                    borderRadius: '20px', padding: '6px 16px', color: '#ffd200',
                    cursor: 'pointer', fontSize: '13px', fontWeight: '600'
                  }}>+ Add Question</button>
                )}
              </div>

              {/* Question blocks */}
              {form.questionBlocks.map((qb, qi) => (
                <div key={qi} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '14px', padding: '22px', marginBottom: '18px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{
                      background: 'linear-gradient(90deg, #f7971e, #ffd200)', color: '#000',
                      borderRadius: '20px', padding: '3px 14px', fontSize: '12px', fontWeight: '700'
                    }}>Question {qi + 1}</span>
                    {form.questionBlocks.length > 1 && (
                      <button onClick={() => removeQBlock(qi)} style={{
                        background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '8px', padding: '4px 12px', color: '#f87171',
                        cursor: 'pointer', fontSize: '12px'
                      }}>Remove</button>
                    )}
                  </div>

                  <label style={lbl}>Question Text</label>
                  <textarea placeholder={`Question ${qi + 1}...`} value={qb.question}
                    onChange={e => handleQChange(qi, 'question', e.target.value)}
                    style={{ ...inp, height: '70px', resize: 'vertical' }} />

                  <label style={lbl}>Options</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {['A','B','C','D'].map((letter, oi) => (
                      <div key={oi} style={{ position: 'relative' }}>
                        <span style={{
                          position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
                          fontSize: '12px', fontWeight: '700', color: 'rgba(255,210,0,0.7)', pointerEvents: 'none',
                          marginBottom: '14px'
                        }}>{letter}</span>
                        <input type="text" placeholder={`Option ${letter}`} value={qb[`option${oi}`]}
                          onChange={e => handleQChange(qi, `option${oi}`, e.target.value)}
                          style={{ ...inp, paddingLeft: '30px', marginBottom: '0' }} />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                    <div>
                      <label style={lbl}>Correct Answer</label>
                      <select value={qb.correct} onChange={e => handleQChange(qi, 'correct', e.target.value)} style={inp}>
                        <option value="0">Option A</option><option value="1">Option B</option>
                        <option value="2">Option C</option><option value="3">Option D</option>
                      </select>
                    </div>
                    <div>
                      <label style={lbl}>Explanation</label>
                      <textarea placeholder="Why is this the correct answer?" value={qb.explanation}
                        onChange={e => handleQChange(qi, 'explanation', e.target.value)}
                        style={{ ...inp, height: '42px', resize: 'vertical', marginBottom: '0' }} />
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={handleSave} style={{
                width: '100%', padding: '16px', borderRadius: '50px', border: 'none',
                background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '8px'
              }}>
                ➕ Save Passage Set to Database
              </button>

              {formSaved && (
                <div style={{
                  marginTop: '14px', background: 'rgba(74,222,128,0.15)',
                  border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px',
                  padding: '12px', textAlign: 'center', color: '#4ade80', fontSize: '14px'
                }}>✅ Passage set saved!</div>
              )}
            </>
          )}

          {/* ── CSV Import ── */}
          {addTab === 'csv' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', marginBottom: '6px' }}>📥 Import from CSV</h2>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.65' }}>
                    Each row = one question. Group multiple questions under the same passage<br />using the same <code style={{ color: '#ffd200' }}>set_id</code> value.
                  </p>
                </div>
                <button onClick={downloadTemplate} style={{
                  background: 'rgba(255,210,0,0.1)', border: '1px solid rgba(255,210,0,0.3)',
                  borderRadius: '12px', padding: '10px 18px', color: '#ffd200',
                  cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', marginLeft: '16px', flexShrink: 0
                }}>⬇ Download Template</button>
              </div>

              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
                padding: '14px 18px', marginBottom: '20px', fontSize: '12px',
                color: 'rgba(255,255,255,0.4)', lineHeight: '1.8'
              }}>
                <strong style={{ color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: '5px' }}>Column order (15 columns):</strong>
                <span style={{ color: '#ffd200' }}>set_id</span> · section · topic · difficulty · timeLimit · source · passage · principle · question · option_a · option_b · option_c · option_d · <span style={{ color: '#ffd200' }}>correct</span> · explanation
                <br />
                Rows with the same <span style={{ color: '#ffd200' }}>set_id</span> share the same passage.
                <span style={{ color: '#ffd200' }}> correct</span> = 0 (A), 1 (B), 2 (C), 3 (D).
              </div>

              <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(255,255,255,0.18)', borderRadius: '16px',
                  padding: '44px', textAlign: 'center', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)', marginBottom: '18px'
                }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>📂</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '5px' }}>Drop CSV here or click to browse</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>.csv files only</div>
                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} style={{ display: 'none' }} />
              </div>

              {csvErrors.length > 0 && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '12px', padding: '14px', marginBottom: '14px'
                }}>
                  <div style={{ color: '#f87171', fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>
                    ⚠️ {csvErrors.length} row{csvErrors.length !== 1 ? 's' : ''} skipped:
                  </div>
                  {csvErrors.map((e, i) => <div key={i} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '2px' }}>· {e}</div>)}
                </div>
              )}

              {csvParsed !== null && csvParsed.length > 0 && (
                <>
                  <div style={{
                    background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
                    borderRadius: '12px', padding: '16px', marginBottom: '14px'
                  }}>
                    <div style={{ color: '#4ade80', fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>
                      ✅ {csvParsed.length} passage set{csvParsed.length !== 1 ? 's' : ''} ready ({csvParsed.reduce((s, p) => s + p.questions.length, 0)} total questions)
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          {['#','Section','Topic','Diff','Qs','Passage preview'].map(h => (
                            <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: 'rgba(255,255,255,0.35)', fontWeight: '600' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvParsed.slice(0, 6).map((s, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '7px 10px', color: 'rgba(255,255,255,0.3)' }}>{i+1}</td>
                            <td style={{ padding: '7px 10px', color: '#ffd200', whiteSpace: 'nowrap' }}>{s.section.split(' ')[0]}</td>
                            <td style={{ padding: '7px 10px', color: 'rgba(255,255,255,0.5)' }}>{s.topic}</td>
                            <td style={{ padding: '7px 10px', color: s.difficulty === 'easy' ? '#4ade80' : s.difficulty === 'hard' ? '#ef4444' : '#fbbf24' }}>{s.difficulty}</td>
                            <td style={{ padding: '7px 10px', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>{s.questions.length}</td>
                            <td style={{ padding: '7px 10px', color: 'rgba(255,255,255,0.6)', maxWidth: '220px' }}>
                              {s.passage.length > 55 ? s.passage.slice(0, 55) + '…' : s.passage}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {csvParsed.length > 6 && (
                      <div style={{ textAlign: 'center', padding: '8px', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                        + {csvParsed.length - 6} more sets
                      </div>
                    )}
                  </div>
                  <button onClick={handleCSVImport} style={{
                    width: '100%', padding: '16px', borderRadius: '50px', border: 'none',
                    background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                    color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'
                  }}>➕ Import {csvParsed.length} Passage Sets Now</button>
                </>
              )}

              {csvImported && (
                <div style={{
                  marginTop: '14px', background: 'rgba(74,222,128,0.15)',
                  border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px',
                  padding: '13px', textAlign: 'center', color: '#4ade80', fontSize: '14px'
                }}>🎉 Imported! Questions are live in practice sessions.</div>
              )}
            </>
          )}
        </div>

        {/* ── Users ── */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '36px', marginBottom: '32px'
        }}>
          <h2 style={{ marginBottom: '8px', fontSize: '20px' }}>👥 Registered Students ({users.length})</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '20px' }}>All students who have signed up</p>
          {users.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '28px 0' }}>No students yet. Share the link!</p>
          ) : (
            <>
              <div style={{
                background: 'rgba(247,151,30,0.07)', border: '1px solid rgba(247,151,30,0.15)',
                borderRadius: '10px', padding: '9px 14px', marginBottom: '18px', fontSize: '12px', color: 'rgba(255,255,255,0.38)'
              }}>
                💡 Export via browser console: <code style={{ color: '#ffd200', fontSize: '11px' }}>copy(JSON.stringify(JSON.parse(localStorage.getItem('examninjaUsers')), null, 2))</code>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.6fr 0.8fr 0.6fr', gap: '10px', padding: '8px 10px', marginBottom: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <span>Name</span><span>Username</span><span>Email</span><span>Joined</span><span>Sessions</span>
              </div>
              {users.map((u, i) => {
                const results = JSON.parse(localStorage.getItem(`examninjaResults_${u.username}`) || '[]');
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.6fr 0.8fr 0.6fr', gap: '10px', padding: '12px 10px', background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderRadius: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{u.name}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>@{u.username}</span>
                    <span style={{ fontSize: '13px', color: '#ffd200' }}>{u.email || '—'}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                    </span>
                    <span style={{ fontSize: '13px', color: results.length > 0 ? '#4ade80' : 'rgba(255,255,255,0.25)' }}>{results.length}</span>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* ── Question Database ── */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '36px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>📚 Passage Sets ({questionSets.length})</h2>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>{totalQuestions} individual questions</p>
            </div>
            {questionSets.length > 0 && (
              <button onClick={handleClearAll} style={{
                background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '7px 14px', color: '#f87171', cursor: 'pointer', fontSize: '13px'
              }}>🗑 Clear All</button>
            )}
          </div>

          {/* Section summary */}
          {questionSets.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
              {SECTIONS.map(s => {
                const count = questionSets.filter(q => q.section === s).length;
                if (!count) return null;
                return (
                  <div key={s} style={{
                    background: 'rgba(255,255,255,0.06)', borderRadius: '20px',
                    padding: '3px 13px', fontSize: '12px', color: 'rgba(255,255,255,0.5)'
                  }}>
                    {s.split(' ')[0]}: <strong style={{ color: '#ffd200' }}>{count}</strong>
                  </div>
                );
              })}
            </div>
          )}

          {questionSets.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px 0' }}>No passage sets yet. Add one above!</p>
          ) : (
            questionSets.map(set => (
              <div key={set.id} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px', padding: '18px 20px', marginBottom: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      <span style={{ background: 'rgba(247,151,30,0.2)', border: '1px solid rgba(247,151,30,0.3)', borderRadius: '20px', padding: '2px 12px', fontSize: '11px', color: '#ffd200' }}>{set.section}</span>
                      <span style={{
                        background: set.difficulty === 'easy' ? 'rgba(74,222,128,0.2)' : set.difficulty === 'medium' ? 'rgba(251,191,36,0.2)' : 'rgba(239,68,68,0.2)',
                        borderRadius: '20px', padding: '2px 12px', fontSize: '11px',
                        color: set.difficulty === 'easy' ? '#4ade80' : set.difficulty === 'medium' ? '#fbbf24' : '#ef4444'
                      }}>{set.difficulty}</span>
                      {set.topic && <span style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '20px', padding: '2px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{set.topic}</span>}
                      <span style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '20px', padding: '2px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                        {set.questions?.length || 0} question{(set.questions?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.5', margin: 0 }}>
                      {set.passage?.length > 100 ? set.passage.slice(0, 100) + '…' : set.passage}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => setPreviewSet(set)} style={{
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px', padding: '5px 14px', color: 'rgba(255,255,255,0.7)',
                      cursor: 'pointer', fontSize: '12px'
                    }}>👁 Preview</button>
                    <button onClick={() => handleDelete(set.id)} style={{
                      background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                      borderRadius: '8px', padding: '5px 14px', color: '#ef4444',
                      cursor: 'pointer', fontSize: '12px'
                    }}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <SetPreview set={previewSet} onClose={() => setPreviewSet(null)} />
    </div>
  );
}

export default Admin;
