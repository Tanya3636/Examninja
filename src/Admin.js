import React, { useState } from 'react';

const ADMIN_PASSWORD = 'examninja2026';

function Admin({ onBack }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [wrongPassword, setWrongPassword] = useState(false);
  const [questions, setQuestions] = useState(() => {
    const saved = localStorage.getItem('examninjaQuestions');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({
    section: 'Legal Reasoning',
    difficulty: 'medium',
    timeLimit: '90',
    source: '',
    topic: '',
    passage: '',
    principle: '',
    question: '',
    option0: '',
    option1: '',
    option2: '',
    option3: '',
    correct: '0',
    explanation: ''
  });
  const [saved, setSaved] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      setWrongPassword(true);
    }
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    const newQuestion = {
      id: Date.now(),
      section: form.section,
      difficulty: form.difficulty,
      timeLimit: parseInt(form.timeLimit),
      source: form.source,
      topic: form.topic,
      passage: form.passage,
      principle: form.principle || null,
      question: form.question,
      options: [form.option0, form.option1, form.option2, form.option3],
      correct: parseInt(form.correct),
      explanation: form.explanation
    };

    const updated = [...questions, newQuestion];
    setQuestions(updated);
    localStorage.setItem('examninjaQuestions', JSON.stringify(updated));
    setSaved(true);

    setForm({
      section: 'Legal Reasoning',
      difficulty: 'medium',
      timeLimit: '90',
      source: '',
      topic: '',
      passage: '',
      principle: '',
      question: '',
      option0: '',
      option1: '',
      option2: '',
      option3: '',
      correct: '0',
      explanation: ''
    });
  };

  const handleDelete = (id) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    localStorage.setItem('examninjaQuestions', JSON.stringify(updated));
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.07)',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    marginBottom: '16px',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '6px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  if (!authenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '48px',
          width: '360px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🥷</div>
          <h2 style={{ marginBottom: '8px' }}>Admin Panel</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>
            ExamNinja — Restricted Access
          </p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{ ...inputStyle, textAlign: 'center' }}
          />
          {wrongPassword && (
            <p style={{ color: '#ff6b6b', fontSize: '13px', marginBottom: '16px' }}>
              Wrong password. Try again.
            </p>
          )}
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '50px',
              border: 'none',
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Enter Admin Panel
          </button>
          <button
            onClick={onBack}
            style={{
              marginTop: '16px',
              background: 'none',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            ← Back to site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>🥷 Admin Panel</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
              {questions.length} questions in database
            </p>
          </div>
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              padding: '8px 20px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back to site
          </button>
        </div>

        {/* Add Question Form */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '40px'
        }}>
          <h2 style={{ marginBottom: '32px', fontSize: '20px' }}>➕ Add New Question</h2>

          {/* Section and Difficulty Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Section</label>
              <select
                value={form.section}
                onChange={e => handleChange('section', e.target.value)}
                style={{ ...inputStyle }}
              >
                <option>Legal Reasoning</option>
                <option>English Language</option>
                <option>Logical Reasoning</option>
                <option>Quantitative Techniques</option>
                <option>Current Affairs</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Difficulty</label>
              <select
                value={form.difficulty}
                onChange={e => handleChange('difficulty', e.target.value)}
                style={{ ...inputStyle }}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Topic and Source Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Topic</label>
              <input
                type="text"
                placeholder="e.g. Tort Law, Inference"
                value={form.topic}
                onChange={e => handleChange('topic', e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Source</label>
              <input
                type="text"
                placeholder="e.g. CLAT 2024, UCAT inspired"
                value={form.source}
                onChange={e => handleChange('source', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Passage */}
          <label style={labelStyle}>Passage</label>
          <textarea
            placeholder="Paste the full passage here..."
            value={form.passage}
            onChange={e => handleChange('passage', e.target.value)}
            style={{ ...inputStyle, height: '120px', resize: 'vertical' }}
          />

          {/* Principle — Legal Only */}
          <label style={labelStyle}>Principle (Legal Reasoning only — leave blank for others)</label>
          <textarea
            placeholder="Principle: ..."
            value={form.principle}
            onChange={e => handleChange('principle', e.target.value)}
            style={{ ...inputStyle, height: '60px', resize: 'vertical' }}
          />

          {/* Question */}
          <label style={labelStyle}>Question</label>
          <textarea
            placeholder="Type the question here..."
            value={form.question}
            onChange={e => handleChange('question', e.target.value)}
            style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
          />

          {/* Options */}
          <label style={labelStyle}>Answer Options</label>
          {['A', 'B', 'C', 'D'].map((letter, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Option ${letter}`}
              value={form[`option${i}`]}
              onChange={e => handleChange(`option${i}`, e.target.value)}
              style={inputStyle}
            />
          ))}

          {/* Correct Answer */}
          <label style={labelStyle}>Correct Answer</label>
          <select
            value={form.correct}
            onChange={e => handleChange('correct', e.target.value)}
            style={{ ...inputStyle }}
          >
            <option value="0">Option A</option>
            <option value="1">Option B</option>
            <option value="2">Option C</option>
            <option value="3">Option D</option>
          </select>

          {/* Explanation */}
          <label style={labelStyle}>Explanation</label>
          <textarea
            placeholder="Explain why this answer is correct..."
            value={form.explanation}
            onChange={e => handleChange('explanation', e.target.value)}
            style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
          />

          {/* Time Limit */}
          <label style={labelStyle}>Time Limit (seconds)</label>
          <select
            value={form.timeLimit}
            onChange={e => handleChange('timeLimit', e.target.value)}
            style={{ ...inputStyle }}
          >
            <option value="60">60 seconds — Easy</option>
            <option value="90">90 seconds — Medium</option>
            <option value="120">120 seconds — Hard</option>
          </select>

          {/* Save Button */}
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '50px',
              border: 'none',
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '8px'
            }}
          >
            ➕ Add Question to Database
          </button>

          {saved && (
            <div style={{
              marginTop: '16px',
              background: 'rgba(74,222,128,0.15)',
              border: '1px solid rgba(74,222,128,0.3)',
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center',
              color: '#4ade80',
              fontSize: '14px'
            }}>
              ✅ Question saved successfully!
            </div>
          )}
        </div>

        {/* Questions List */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '40px'
        }}>
          <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>
            📚 Question Database ({questions.length})
          </h2>

          {questions.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '40px 0' }}>
              No questions yet. Add your first question above!
            </p>
          ) : (
            questions.map((q, i) => (
              <div key={q.id} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'rgba(247,151,30,0.2)',
                      border: '1px solid rgba(247,151,30,0.3)',
                      borderRadius: '20px',
                      padding: '2px 12px',
                      fontSize: '11px',
                      color: '#ffd200'
                    }}>
                      {q.section}
                    </span>
                    <span style={{
                      background: q.difficulty === 'easy'
                        ? 'rgba(74,222,128,0.2)'
                        : q.difficulty === 'medium'
                        ? 'rgba(251,191,36,0.2)'
                        : 'rgba(239,68,68,0.2)',
                      borderRadius: '20px',
                      padding: '2px 12px',
                      fontSize: '11px',
                      color: q.difficulty === 'easy'
                        ? '#4ade80'
                        : q.difficulty === 'medium'
                        ? '#fbbf24'
                        : '#ef4444'
                    }}>
                      {q.difficulty}
                    </span>
                    <span style={{
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '20px',
                      padding: '2px 12px',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.5)'
                    }}>
                      {q.topic}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(q.id)}
                    style={{
                      background: 'rgba(239,68,68,0.2)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '1.5'
                }}>
                  {q.question}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;