import React, { useState, useRef } from 'react';

const ADMIN_PASSWORD = 'examninja2026';

const SECTIONS = [
  'Legal Reasoning',
  'English Language',
  'Logical Reasoning',
  'Quantitative Techniques',
  'Current Affairs'
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
      while (pos < text.length && text[pos] !== ',' && text[pos] !== '\n') {
        val += text[pos++];
      }
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

function csvToQuestions(rows) {
  const errors = [];
  const parsed = [];

  // Detect and skip header row
  const first = rows[0]?.map(f => f.toLowerCase().replace(/[^a-z]/g, '')) || [];
  const hasHeader = first[0] === 'section' || first[6] === 'question';
  const dataRows = hasHeader ? rows.slice(1) : rows;

  dataRows.forEach((row, i) => {
    const lineNum = i + (hasHeader ? 2 : 1);
    if (row.length < 12) {
      errors.push(`Row ${lineNum}: only ${row.length} columns found (need at least 13)`);
      return;
    }
    const [section, topic, difficulty, timeLimit, passage, principle,
      question, optA, optB, optC, optD, correct, explanation, source] = row;

    if (!SECTIONS.includes(section)) {
      errors.push(`Row ${lineNum}: unknown section "${section}"`);
      return;
    }
    if (!['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
      errors.push(`Row ${lineNum}: difficulty must be easy/medium/hard, got "${difficulty}"`);
      return;
    }
    const correctIdx = parseInt(correct);
    if (isNaN(correctIdx) || correctIdx < 0 || correctIdx > 3) {
      errors.push(`Row ${lineNum}: correct must be 0–3, got "${correct}"`);
      return;
    }
    if (!question.trim() || !optA.trim() || !optB.trim() || !optC.trim() || !optD.trim()) {
      errors.push(`Row ${lineNum}: missing question or one of the options`);
      return;
    }
    parsed.push({
      id: Date.now() + Math.random(),
      section,
      topic: topic || 'General',
      difficulty: difficulty.toLowerCase(),
      timeLimit: parseInt(timeLimit) || 90,
      passage: passage || '',
      principle: principle || null,
      question: question.trim(),
      options: [optA.trim(), optB.trim(), optC.trim(), optD.trim()],
      correct: correctIdx,
      explanation: explanation || '',
      source: source || ''
    });
  });

  return { parsed, errors };
}

function downloadTemplate() {
  const header = 'section,topic,difficulty,timeLimit,passage,principle,question,option_a,option_b,option_c,option_d,correct,explanation,source';
  const ex1 = `"Legal Reasoning","Tort Law","medium","90","Arjun owns a factory near a residential area. The factory emits smoke continuously that damages Priya's mango orchard. Priya files a suit claiming compensation for crop loss.","Principle: A person is liable in tort if their activity, though lawful, causes damage to another's property.","Can Priya succeed in claiming damages from Arjun?","Yes — the principle holds Arjun liable even without negligence","No — Arjun is running a lawful business","Yes — but only if Priya proves Arjun acted negligently","No — Priya must first notify the local authority","0","The principle imposes liability regardless of intent or lawfulness of the activity. Since the factory smoke caused direct harm to Priya's orchard, she can succeed.","Original"`;
  const ex2 = `"English Language","Inference","easy","60","Scientists have long debated whether language shapes thought or thought shapes language. Recent studies on bilingual speakers suggest the relationship is bidirectional — each influences the other in complex ways that vary across cultures.","","What can be best inferred from the passage?","Language and thought are completely independent","Language influences thought but thought cannot influence language","The relationship between language and thought is mutual","Bilingual speakers think differently than monolingual speakers","2","The passage explicitly states the relationship is 'bidirectional', meaning both influence each other. This makes option C the correct inference.","Original"`;
  const csv = [header, ex1, ex2].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'examninja_import_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Preview Modal ────────────────────────────────────────────────────────────
function QuestionPreview({ q, onClose }) {
  if (!q) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: '20px', overflowY: 'auto'
    }} onClick={onClose}>
      <div style={{
        background: '#13132b', border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '20px', padding: '36px', maxWidth: '720px', width: '100%',
        fontFamily: "'Segoe UI', sans-serif", color: 'white',
        maxHeight: '90vh', overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Student Preview</div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', color: 'white', cursor: 'pointer', fontSize: '16px'
          }}>✕</button>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <span style={{
            background: 'rgba(247,151,30,0.2)', border: '1px solid rgba(247,151,30,0.4)',
            borderRadius: '20px', padding: '3px 14px', fontSize: '12px', color: '#ffd200'
          }}>{q.section}</span>
          <span style={{
            background: q.difficulty === 'easy' ? 'rgba(74,222,128,0.15)' : q.difficulty === 'hard' ? 'rgba(239,68,68,0.15)' : 'rgba(251,191,36,0.15)',
            borderRadius: '20px', padding: '3px 14px', fontSize: '12px',
            color: q.difficulty === 'easy' ? '#4ade80' : q.difficulty === 'hard' ? '#ef4444' : '#fbbf24'
          }}>{q.difficulty}</span>
          {q.topic && (
            <span style={{
              background: 'rgba(255,255,255,0.07)', borderRadius: '20px',
              padding: '3px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.45)'
            }}>{q.topic}</span>
          )}
          <span style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: '20px',
            padding: '3px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.35)'
          }}>⏱ {q.timeLimit}s</span>
        </div>

        {/* Passage */}
        {q.passage && (
          <div style={{
            background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
            padding: '18px', marginBottom: '14px', fontSize: '14px',
            lineHeight: '1.75', color: 'rgba(255,255,255,0.82)'
          }}>{q.passage}</div>
        )}

        {/* Principle */}
        {q.principle && (
          <div style={{
            background: 'rgba(247,151,30,0.08)', border: '1px solid rgba(247,151,30,0.2)',
            borderRadius: '12px', padding: '14px', marginBottom: '18px',
            fontSize: '13px', color: '#ffd200', lineHeight: '1.65'
          }}>{q.principle}</div>
        )}

        {/* Question */}
        <h3 style={{ fontSize: '16px', marginBottom: '20px', lineHeight: '1.55' }}>{q.question}</h3>

        {/* Options — correct shown green, others neutral */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {q.options.map((option, idx) => (
            <div key={idx} style={{
              background: idx === q.correct ? 'rgba(74,222,128,0.18)' : 'rgba(255,255,255,0.04)',
              border: idx === q.correct ? '1px solid rgba(74,222,128,0.5)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', padding: '14px 18px',
              fontSize: '14px', lineHeight: '1.5', color: 'white',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0,
                background: idx === q.correct ? 'rgba(74,222,128,0.4)' : 'rgba(255,255,255,0.1)',
                fontSize: '12px', fontWeight: 'bold'
              }}>
                {idx === q.correct ? '✓' : ['A','B','C','D'][idx]}
              </span>
              {option}
            </div>
          ))}
        </div>

        {/* Explanation */}
        {q.explanation && (
          <div style={{
            background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
            borderRadius: '12px', padding: '16px', fontSize: '13px',
            lineHeight: '1.7', color: 'rgba(255,255,255,0.82)'
          }}>
            <strong style={{ color: '#4ade80' }}>💡 Explanation: </strong>
            {q.explanation}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Component ─────────────────────────────────────────────────────
function Admin({ onBack }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [wrongPassword, setWrongPassword] = useState(false);

  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('examninjaQuestions');
    return saved ? JSON.parse(saved) : [];
  });

  // Tabs: 'manual' | 'csv'
  const [addTab, setAddTab] = useState('manual');

  // Manual form
  const [form, setForm] = useState({
    section: 'Legal Reasoning', difficulty: 'medium', timeLimit: '90',
    source: '', topic: '', passage: '', principle: '',
    question: '', option0: '', option1: '', option2: '', option3: '',
    correct: '0', explanation: ''
  });
  const [formSaved, setFormSaved] = useState(false);

  // CSV import
  const fileInputRef = useRef(null);
  const [csvParsed, setCsvParsed] = useState(null);
  const [csvErrors, setCsvErrors] = useState([]);
  const [csvImported, setCsvImported] = useState(false);

  // Preview modal
  const [previewQ, setPreviewQ] = useState(null);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) setAuthenticated(true);
    else setWrongPassword(true);
  };

  // ── Manual form ──────────────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setFormSaved(false);
  };

  const handleSave = () => {
    if (!form.question || !form.option0 || !form.option1 || !form.option2 || !form.option3 || !form.passage) {
      alert('Please fill in passage, question, and all four options.');
      return;
    }
    const newQ = {
      id: Date.now(),
      section: form.section, difficulty: form.difficulty,
      timeLimit: parseInt(form.timeLimit), source: form.source,
      topic: form.topic, passage: form.passage,
      principle: form.principle || null, question: form.question,
      options: [form.option0, form.option1, form.option2, form.option3],
      correct: parseInt(form.correct), explanation: form.explanation
    };
    const updated = [...questions, newQ];
    setQuestions(updated);
    localStorage.setItem('examninjaQuestions', JSON.stringify(updated));
    setFormSaved(true);
    setForm({
      section: 'Legal Reasoning', difficulty: 'medium', timeLimit: '90',
      source: '', topic: '', passage: '', principle: '',
      question: '', option0: '', option1: '', option2: '', option3: '',
      correct: '0', explanation: ''
    });
  };

  // ── CSV import ───────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCsvImported(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSVText(ev.target.result);
      const { parsed, errors } = csvToQuestions(rows);
      setCsvParsed(parsed);
      setCsvErrors(errors);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    setCsvImported(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const rows = parseCSVText(ev.target.result);
      const { parsed, errors } = csvToQuestions(rows);
      setCsvParsed(parsed);
      setCsvErrors(errors);
    };
    reader.readAsText(file);
  };

  const handleCSVImport = () => {
    if (!csvParsed || csvParsed.length === 0) return;
    const updated = [...questions, ...csvParsed];
    setQuestions(updated);
    localStorage.setItem('examninjaQuestions', JSON.stringify(updated));
    setCsvImported(true);
    setCsvParsed(null);
    setCsvErrors([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = (id) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    localStorage.setItem('examninjaQuestions', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (!window.confirm(`Delete ALL ${questions.length} questions? This cannot be undone.`)) return;
    setQuestions([]);
    localStorage.setItem('examninjaQuestions', JSON.stringify([]));
  };

  // ── Shared styles ────────────────────────────────────────────────────────
  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)',
    color: 'white', fontSize: '14px', outline: 'none', marginBottom: '16px',
    boxSizing: 'border-box'
  };
  const labelStyle = {
    display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.5)',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'
  };

  // ─── Login screen ──────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '48px', width: '360px',
          textAlign: 'center', color: 'white'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🥷</div>
          <h2 style={{ marginBottom: '8px' }}>Admin Panel</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>
            ExamNinja — Restricted Access
          </p>
          <input
            type="password" placeholder="Enter admin password"
            value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ ...inputStyle, textAlign: 'center' }}
          />
          {wrongPassword && (
            <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '16px' }}>
              Wrong password. Try again.
            </p>
          )}
          <button onClick={handleLogin} style={{
            width: '100%', padding: '14px', borderRadius: '50px', border: 'none',
            background: 'linear-gradient(90deg, #f7971e, #ffd200)',
            color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'
          }}>
            Enter Admin Panel
          </button>
          <button onClick={onBack} style={{
            marginTop: '16px', background: 'none', border: 'none',
            color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '13px'
          }}>
            ← Back to site
          </button>
        </div>
      </div>
    );
  }

  // ─── Authenticated admin ───────────────────────────────────────────────────
  const users = JSON.parse(localStorage.getItem('examninjaUsers') || '[]');

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white', fontFamily: "'Segoe UI', sans-serif", padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>🥷 Admin Panel</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
              {questions.length} questions · {users.length} students
            </p>
          </div>
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px', padding: '8px 20px', color: 'white',
            cursor: 'pointer', fontSize: '14px'
          }}>
            ← Back to site
          </button>
        </div>

        {/* ── Add / Import card ── */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '36px', marginBottom: '32px'
        }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {[
              { key: 'manual', label: '✏️ Add Manually' },
              { key: 'csv',    label: '📥 Import CSV'   }
            ].map(tab => (
              <button key={tab.key} onClick={() => setAddTab(tab.key)} style={{
                padding: '9px 22px', borderRadius: '50px', border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '14px',
                background: addTab === tab.key
                  ? 'linear-gradient(90deg, #f7971e, #ffd200)' : 'rgba(255,255,255,0.08)',
                color: addTab === tab.key ? '#000' : 'rgba(255,255,255,0.6)'
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Manual form ── */}
          {addTab === 'manual' && (
            <>
              <h2 style={{ marginBottom: '28px', fontSize: '20px' }}>➕ Add New Question</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Section</label>
                  <select value={form.section} onChange={e => handleChange('section', e.target.value)} style={inputStyle}>
                    {SECTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Difficulty</label>
                  <select value={form.difficulty} onChange={e => handleChange('difficulty', e.target.value)} style={inputStyle}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Topic</label>
                  <input type="text" placeholder="e.g. Tort Law, Inference" value={form.topic}
                    onChange={e => handleChange('topic', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Source</label>
                  <input type="text" placeholder="e.g. CLAT 2024, Original" value={form.source}
                    onChange={e => handleChange('source', e.target.value)} style={inputStyle} />
                </div>
              </div>

              <label style={labelStyle}>Passage</label>
              <textarea placeholder="Paste the full passage here..." value={form.passage}
                onChange={e => handleChange('passage', e.target.value)}
                style={{ ...inputStyle, height: '120px', resize: 'vertical' }} />

              <label style={labelStyle}>Principle (Legal Reasoning only — leave blank for other sections)</label>
              <textarea placeholder="Principle: ..." value={form.principle}
                onChange={e => handleChange('principle', e.target.value)}
                style={{ ...inputStyle, height: '60px', resize: 'vertical' }} />

              <label style={labelStyle}>Question</label>
              <textarea placeholder="Type the question here..." value={form.question}
                onChange={e => handleChange('question', e.target.value)}
                style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />

              <label style={labelStyle}>Answer Options</label>
              {['A', 'B', 'C', 'D'].map((letter, i) => (
                <input key={i} type="text" placeholder={`Option ${letter}`}
                  value={form[`option${i}`]}
                  onChange={e => handleChange(`option${i}`, e.target.value)}
                  style={inputStyle} />
              ))}

              <label style={labelStyle}>Correct Answer</label>
              <select value={form.correct} onChange={e => handleChange('correct', e.target.value)} style={inputStyle}>
                <option value="0">Option A</option>
                <option value="1">Option B</option>
                <option value="2">Option C</option>
                <option value="3">Option D</option>
              </select>

              <label style={labelStyle}>Explanation</label>
              <textarea placeholder="Explain why this answer is correct..." value={form.explanation}
                onChange={e => handleChange('explanation', e.target.value)}
                style={{ ...inputStyle, height: '100px', resize: 'vertical' }} />

              <label style={labelStyle}>Time Limit</label>
              <select value={form.timeLimit} onChange={e => handleChange('timeLimit', e.target.value)} style={inputStyle}>
                <option value="60">60 seconds — Easy</option>
                <option value="90">90 seconds — Medium</option>
                <option value="120">120 seconds — Hard</option>
              </select>

              <button onClick={handleSave} style={{
                width: '100%', padding: '16px', borderRadius: '50px', border: 'none',
                background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', marginTop: '8px'
              }}>
                ➕ Add Question to Database
              </button>

              {formSaved && (
                <div style={{
                  marginTop: '16px', background: 'rgba(74,222,128,0.15)',
                  border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px',
                  padding: '12px', textAlign: 'center', color: '#4ade80', fontSize: '14px'
                }}>
                  ✅ Question saved!
                </div>
              )}
            </>
          )}

          {/* ── CSV Import ── */}
          {addTab === 'csv' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '20px', marginBottom: '6px' }}>📥 Import from CSV</h2>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: '1.6' }}>
                    Upload a spreadsheet with hundreds of questions at once.<br />
                    13 columns required — download the template to get started.
                  </p>
                </div>
                <button onClick={downloadTemplate} style={{
                  background: 'rgba(255,210,0,0.1)', border: '1px solid rgba(255,210,0,0.3)',
                  borderRadius: '12px', padding: '10px 18px', color: '#ffd200',
                  cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap',
                  marginLeft: '16px', flexShrink: 0
                }}>
                  ⬇ Download Template
                </button>
              </div>

              {/* Column guide */}
              <div style={{
                background: 'rgba(255,255,255,0.04)', borderRadius: '12px',
                padding: '16px 20px', marginBottom: '24px', fontSize: '12px',
                color: 'rgba(255,255,255,0.45)', lineHeight: '1.8'
              }}>
                <strong style={{ color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '6px' }}>
                  Required column order:
                </strong>
                section · topic · difficulty · timeLimit · passage · principle · question · option_a · option_b · option_c · option_d · correct · explanation · source
                <br />
                <span style={{ color: '#ffd200' }}>correct</span> = 0 (A), 1 (B), 2 (C), or 3 (D) &nbsp;·&nbsp;
                <span style={{ color: '#ffd200' }}>difficulty</span> = easy / medium / hard &nbsp;·&nbsp;
                <span style={{ color: '#ffd200' }}>principle</span> can be blank for non-Legal sections
              </div>

              {/* Drop zone */}
              <div
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '16px',
                  padding: '48px', textAlign: 'center', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)', marginBottom: '20px',
                  transition: 'border-color 0.2s'
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>📂</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', marginBottom: '6px' }}>
                  Drop your CSV file here, or click to browse
                </div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                  .csv files only · any number of questions
                </div>
                <input
                  ref={fileInputRef} type="file" accept=".csv"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Errors */}
              {csvErrors.length > 0 && (
                <div style={{
                  background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '12px', padding: '16px', marginBottom: '16px'
                }}>
                  <div style={{ color: '#f87171', fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>
                    ⚠️ {csvErrors.length} row{csvErrors.length !== 1 ? 's' : ''} skipped due to errors:
                  </div>
                  {csvErrors.map((err, i) => (
                    <div key={i} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', marginBottom: '3px' }}>
                      · {err}
                    </div>
                  ))}
                </div>
              )}

              {/* Parsed preview */}
              {csvParsed !== null && (
                <>
                  <div style={{
                    background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
                    borderRadius: '12px', padding: '16px', marginBottom: '16px'
                  }}>
                    <div style={{ color: '#4ade80', fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>
                      ✅ {csvParsed.length} question{csvParsed.length !== 1 ? 's' : ''} ready to import
                    </div>

                    {/* Preview table */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            {['#', 'Section', 'Topic', 'Difficulty', 'Question (preview)'].map(h => (
                              <th key={h} style={{
                                padding: '8px 10px', textAlign: 'left',
                                color: 'rgba(255,255,255,0.4)', fontWeight: '600', letterSpacing: '0.4px'
                              }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {csvParsed.slice(0, 8).map((q, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                              <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.3)' }}>{i + 1}</td>
                              <td style={{ padding: '8px 10px', color: '#ffd200', whiteSpace: 'nowrap' }}>{q.section.split(' ')[0]}</td>
                              <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.5)' }}>{q.topic}</td>
                              <td style={{ padding: '8px 10px', color: q.difficulty === 'easy' ? '#4ade80' : q.difficulty === 'hard' ? '#ef4444' : '#fbbf24' }}>{q.difficulty}</td>
                              <td style={{ padding: '8px 10px', color: 'rgba(255,255,255,0.7)', maxWidth: '260px' }}>
                                {q.question.length > 60 ? q.question.slice(0, 60) + '…' : q.question}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {csvParsed.length > 8 && (
                        <div style={{ textAlign: 'center', padding: '10px', color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
                          + {csvParsed.length - 8} more questions not shown
                        </div>
                      )}
                    </div>
                  </div>

                  <button onClick={handleCSVImport} style={{
                    width: '100%', padding: '16px', borderRadius: '50px', border: 'none',
                    background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                    color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'
                  }}>
                    ➕ Import {csvParsed.length} Questions Now
                  </button>
                </>
              )}

              {csvImported && (
                <div style={{
                  marginTop: '16px', background: 'rgba(74,222,128,0.15)',
                  border: '1px solid rgba(74,222,128,0.3)', borderRadius: '12px',
                  padding: '14px', textAlign: 'center', color: '#4ade80', fontSize: '14px'
                }}>
                  🎉 Questions imported successfully! They're live in the practice sessions.
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Registered Users ── */}
        <div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px', padding: '36px', marginBottom: '32px'
        }}>
          <h2 style={{ marginBottom: '8px', fontSize: '20px' }}>👥 Registered Students ({users.length})</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '24px' }}>
            All students who have signed up on ExamNinja
          </p>

          {users.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '30px 0' }}>
              No students yet. Share the link!
            </p>
          ) : (
            <>
              <div style={{
                background: 'rgba(247,151,30,0.08)', border: '1px solid rgba(247,151,30,0.15)',
                borderRadius: '10px', padding: '10px 16px', marginBottom: '20px', fontSize: '12px',
                color: 'rgba(255,255,255,0.4)'
              }}>
                💡 To export — open browser console (Cmd+Option+J) and run:{' '}
                <code style={{ color: '#ffd200', fontSize: '11px' }}>
                  copy(JSON.stringify(JSON.parse(localStorage.getItem('examninjaUsers')), null, 2))
                </code>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.6fr 0.8fr 0.6fr',
                gap: '10px', padding: '8px 12px', marginBottom: '6px',
                fontSize: '11px', color: 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>
                <span>Name</span><span>Username</span><span>Email</span><span>Joined</span><span>Sessions</span>
              </div>

              {users.map((u, i) => {
                const results = JSON.parse(localStorage.getItem(`examninjaResults_${u.username}`) || '[]');
                return (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.6fr 0.8fr 0.6fr',
                    gap: '10px', padding: '13px 12px',
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                    borderRadius: '8px', alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{u.name}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>@{u.username}</span>
                    <span style={{ fontSize: '13px', color: '#ffd200' }}>{u.email || '—'}</span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}
                    </span>
                    <span style={{ fontSize: '13px', color: results.length > 0 ? '#4ade80' : 'rgba(255,255,255,0.25)' }}>
                      {results.length}
                    </span>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px' }}>📚 Question Database ({questions.length})</h2>
            {questions.length > 0 && (
              <button onClick={handleClearAll} style={{
                background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '7px 16px', color: '#f87171',
                cursor: 'pointer', fontSize: '13px'
              }}>
                🗑 Clear All
              </button>
            )}
          </div>

          {/* Section summary */}
          {questions.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {SECTIONS.map(s => {
                const count = questions.filter(q => q.section === s).length;
                if (count === 0) return null;
                return (
                  <div key={s} style={{
                    background: 'rgba(255,255,255,0.06)', borderRadius: '20px',
                    padding: '4px 14px', fontSize: '12px', color: 'rgba(255,255,255,0.55)'
                  }}>
                    {s.split(' ')[0]}: <strong style={{ color: '#ffd200' }}>{count}</strong>
                  </div>
                );
              })}
            </div>
          )}

          {questions.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px 0' }}>
              No questions yet. Add manually or import a CSV above!
            </p>
          ) : (
            questions.map((q, i) => (
              <div key={q.id} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px', padding: '18px 20px', marginBottom: '12px'
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'flex-start', marginBottom: '10px', gap: '12px'
                }}>
                  <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', flex: 1 }}>
                    <span style={{
                      background: 'rgba(247,151,30,0.2)', border: '1px solid rgba(247,151,30,0.3)',
                      borderRadius: '20px', padding: '2px 12px', fontSize: '11px', color: '#ffd200'
                    }}>{q.section}</span>
                    <span style={{
                      background: q.difficulty === 'easy' ? 'rgba(74,222,128,0.2)' : q.difficulty === 'medium' ? 'rgba(251,191,36,0.2)' : 'rgba(239,68,68,0.2)',
                      borderRadius: '20px', padding: '2px 12px', fontSize: '11px',
                      color: q.difficulty === 'easy' ? '#4ade80' : q.difficulty === 'medium' ? '#fbbf24' : '#ef4444'
                    }}>{q.difficulty}</span>
                    {q.topic && (
                      <span style={{
                        background: 'rgba(255,255,255,0.08)', borderRadius: '20px',
                        padding: '2px 12px', fontSize: '11px', color: 'rgba(255,255,255,0.45)'
                      }}>{q.topic}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button onClick={() => setPreviewQ(q)} style={{
                      background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px', padding: '4px 14px',
                      color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '12px'
                    }}>
                      👁 Preview
                    </button>
                    <button onClick={() => handleDelete(q.id)} style={{
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '8px', padding: '4px 14px',
                      color: '#ef4444', cursor: 'pointer', fontSize: '12px'
                    }}>
                      Delete
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.5', margin: 0 }}>
                  {q.question.length > 120 ? q.question.slice(0, 120) + '…' : q.question}
                </p>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Preview modal */}
      <QuestionPreview q={previewQ} onClose={() => setPreviewQ(null)} />
    </div>
  );
}

export default Admin;
