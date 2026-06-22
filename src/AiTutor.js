import React, { useState, useRef, useEffect } from 'react';

const SECTIONS = [
  { label: 'Legal Reasoning', icon: '⚖️', color: '#f7971e' },
  { label: 'English Language', icon: '📖', color: '#4ade80' },
  { label: 'Logical Reasoning', icon: '🧩', color: '#60a5fa' },
  { label: 'Quantitative Techniques', icon: '📐', color: '#f472b6' },
  { label: 'Current Affairs', icon: '🌏', color: '#a78bfa' },
];

const QUICK_ACTIONS = [
  { label: 'Explain a concept', prompt: 'Can you explain a CLAT concept I am finding difficult? I will tell you which one.' },
  { label: 'Make a study plan', prompt: 'Based on my weak areas, can you make me a focused study plan for this week?' },
  { label: 'Legal reasoning tips', prompt: 'Give me the most important tips and strategies for scoring well in Legal Reasoning in CLAT.' },
  { label: 'How to read passages faster', prompt: 'How do I read and analyse passages faster in CLAT English and Logical Reasoning sections?' },
  { label: 'Quantitative shortcuts', prompt: 'Teach me the most useful shortcuts for Quantitative Techniques in CLAT — profit/loss, percentages, data interpretation.' },
  { label: 'Current Affairs strategy', prompt: 'How should I prepare Current Affairs for CLAT? Which sources should I follow and what exactly do I need to know?' },
];

function AiTutor({ user, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Pull user's weak areas from localStorage for context
  const getUserContext = () => {
    if (!user) return '';
    const results = JSON.parse(localStorage.getItem(`examninjaResults_${user.username}`) || '[]');
    if (!results.length) return `Student: ${user.name}. No practice sessions completed yet.`;

    const sectionStats = {};
    const topicStats = {};
    results.forEach(r => {
      Object.entries(r.sections || {}).forEach(([s, d]) => {
        if (!sectionStats[s]) sectionStats[s] = { attempted: 0, correct: 0 };
        sectionStats[s].attempted += d.attempted;
        sectionStats[s].correct += d.correct;
      });
      Object.entries(r.topics || {}).forEach(([t, d]) => {
        if (!topicStats[t]) topicStats[t] = { attempted: 0, correct: 0 };
        topicStats[t].attempted += d.attempted;
        topicStats[t].correct += d.correct;
      });
    });

    const sectionSummary = Object.entries(sectionStats)
      .map(([s, d]) => `${s}: ${Math.round((d.correct / d.attempted) * 100)}% accuracy`)
      .join(', ');

    const weakTopics = Object.entries(topicStats)
      .filter(([, d]) => d.attempted >= 2)
      .map(([t, d]) => ({ t, acc: Math.round((d.correct / d.attempted) * 100) }))
      .sort((a, b) => a.acc - b.acc)
      .slice(0, 3)
      .map(({ t, acc }) => `${t} (${acc}%)`)
      .join(', ');

    const totalQ = results.reduce((s, r) => s + r.totalQuestions, 0);
    const totalC = results.reduce((s, r) => s + r.correct, 0);
    const overall = totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0;

    return `Student name: ${user.name}. Overall accuracy: ${overall}% across ${results.length} sessions (${totalQ} questions). Section performance: ${sectionSummary || 'not enough data yet'}. Weakest topics: ${weakTopics || 'not enough data yet'}.`;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const sectionContext = selectedSection
      ? `The student has selected to focus on ${selectedSection} right now.`
      : '';

    const userMsg = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          context: `TUTOR SESSION — This is the dedicated AI Tutor page, not just a question explainer. Act as a personal teacher.\n\nStudent data: ${getUserContext()}\n${sectionContext}`,
          mode: 'tutor'
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a connection issue right now. Please check your internet and try again in a moment!"
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleQuickAction = (prompt) => {
    send(prompt);
  };

  const sectionAccuracy = (() => {
    if (!user) return {};
    const results = JSON.parse(localStorage.getItem(`examninjaResults_${user.username}`) || '[]');
    const stats = {};
    results.forEach(r => {
      Object.entries(r.sections || {}).forEach(([s, d]) => {
        if (!stats[s]) stats[s] = { attempted: 0, correct: 0 };
        stats[s].attempted += d.attempted;
        stats[s].correct += d.correct;
      });
    });
    const out = {};
    Object.entries(stats).forEach(([s, d]) => {
      out[s] = Math.round((d.correct / d.attempted) * 100);
    });
    return out;
  })();

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white', fontFamily: "'Segoe UI', sans-serif"
    }}>

      {/* Top bar */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: '16px',
        padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '20px', padding: '6px 16px', color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer', fontSize: '13px'
        }}>← Back</button>
        <div>
          <div style={{ fontSize: '17px', fontWeight: '700' }}>🤖 AI Tutor</div>
          <div style={{ fontSize: '11px', color: '#ffd200', marginTop: '1px' }}>
            Your personal CLAT teacher · Available 24/7
          </div>
        </div>
        {user && (
          <div style={{
            marginLeft: 'auto', fontSize: '12px', color: 'rgba(255,255,255,0.4)'
          }}>
            Hi, {user.name} 👋
          </div>
        )}
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>

        {/* Left sidebar */}
        <div style={{
          width: '260px', flexShrink: 0, overflowY: 'auto',
          padding: '20px 16px', borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', gap: '20px'
        }}>

          {/* Section selector */}
          <div>
            <div style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px',
              textTransform: 'uppercase', letterSpacing: '0.6px'
            }}>Focus on a section</div>
            {SECTIONS.map(sec => {
              const acc = sectionAccuracy[sec.label];
              const isSelected = selectedSection === sec.label;
              return (
                <button
                  key={sec.label}
                  onClick={() => setSelectedSection(isSelected ? null : sec.label)}
                  style={{
                    width: '100%', textAlign: 'left', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 12px', borderRadius: '10px', marginBottom: '5px',
                    background: isSelected ? `${sec.color}22` : 'rgba(255,255,255,0.04)',
                    border: isSelected ? `1px solid ${sec.color}55` : '1px solid rgba(255,255,255,0.08)',
                    color: isSelected ? sec.color : 'rgba(255,255,255,0.65)',
                    cursor: 'pointer', fontSize: '12px', fontWeight: isSelected ? '600' : '400'
                  }}
                >
                  <span>{sec.icon} {sec.label}</span>
                  {acc !== undefined && (
                    <span style={{
                      fontSize: '11px', fontWeight: '700',
                      color: acc >= 70 ? '#4ade80' : acc >= 50 ? '#fbbf24' : '#f87171'
                    }}>{acc}%</span>
                  )}
                </button>
              );
            })}
            {selectedSection && (
              <div style={{
                fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '6px',
                textAlign: 'center'
              }}>
                AI is focused on {selectedSection}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div>
            <div style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px',
              textTransform: 'uppercase', letterSpacing: '0.6px'
            }}>Quick actions</div>
            {QUICK_ACTIONS.map((a, i) => (
              <button
                key={i}
                onClick={() => handleQuickAction(a.prompt)}
                disabled={loading}
                style={{
                  width: '100%', textAlign: 'left', padding: '9px 12px',
                  borderRadius: '10px', marginBottom: '5px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.65)', cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '12px', lineHeight: '1.4'
                }}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* Tip */}
          <div style={{
            background: 'rgba(247,151,30,0.08)', border: '1px solid rgba(247,151,30,0.2)',
            borderRadius: '12px', padding: '12px', fontSize: '11px',
            color: 'rgba(255,255,255,0.5)', lineHeight: '1.6'
          }}>
            💡 <strong style={{ color: '#ffd200' }}>Tip:</strong> Ask me to explain any CLAT topic, walk you through a concept, or quiz you on what you've learned.
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '24px 32px',
            display: 'flex', flexDirection: 'column', gap: '16px'
          }}>

            {/* Welcome state */}
            {messages.length === 0 && (
              <div style={{ maxWidth: '640px', margin: '0 auto', paddingTop: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
                  <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>
                    I'm your AI CLAT tutor
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.7' }}>
                    Ask me anything — concepts, strategy, why an answer is correct, how to improve your score,
                    or what to study next. I'm here 24/7 and I never get tired of your questions.
                  </p>
                </div>

                {user && Object.keys(sectionAccuracy).length > 0 && (() => {
                  const weakSection = Object.entries(sectionAccuracy).sort((a, b) => a[1] - b[1])[0];
                  return weakSection && weakSection[1] < 70 ? (
                    <div style={{
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: '14px', padding: '16px 20px', marginBottom: '24px',
                      cursor: 'pointer'
                    }}
                      onClick={() => send(`I'm struggling with ${weakSection[0]}. My accuracy there is only ${weakSection[1]}%. Can you help me understand it better and give me tips to improve?`)}
                    >
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
                        📊 Based on your performance
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                        Your weakest area: {weakSection[0]} ({weakSection[1]}%)
                      </div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                        Tap to get personalised help with this section →
                      </div>
                    </div>
                  ) : null;
                })()}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {QUICK_ACTIONS.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickAction(a.prompt)}
                      style={{
                        padding: '12px 14px', borderRadius: '12px', textAlign: 'left',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '13px', lineHeight: '1.4'
                      }}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message bubbles */}
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '760px', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                width: '100%'
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #f7971e, #ffd200)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', marginRight: '10px', marginTop: '4px'
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: msg.role === 'user' ? '70%' : '85%',
                  padding: '12px 16px', borderRadius: '18px', fontSize: '14px', lineHeight: '1.7',
                  background: msg.role === 'user'
                    ? 'linear-gradient(90deg, #f7971e, #ffd200)'
                    : 'rgba(255,255,255,0.07)',
                  color: msg.role === 'user' ? '#000' : 'rgba(255,255,255,0.9)',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '18px',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '18px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #f7971e, #ffd200)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
                }}>🤖</div>
                <div style={{
                  padding: '12px 18px', borderRadius: '18px', borderBottomLeftRadius: '4px',
                  background: 'rgba(255,255,255,0.07)',
                  display: 'flex', gap: '5px', alignItems: 'center'
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '7px', height: '7px', borderRadius: '50%', background: '#ffd200',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div style={{
            flexShrink: 0, padding: '16px 32px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(0,0,0,0.2)'
          }}>
            {selectedSection && (
              <div style={{
                fontSize: '11px', color: '#ffd200', marginBottom: '8px',
                display: 'flex', alignItems: 'center', gap: '6px'
              }}>
                <span style={{ opacity: 0.6 }}>Focused on:</span>
                <span style={{ fontWeight: '600' }}>{selectedSection}</span>
                <span
                  onClick={() => setSelectedSection(null)}
                  style={{ opacity: 0.4, cursor: 'pointer', marginLeft: '4px' }}
                >✕</span>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                placeholder="Ask me anything about CLAT — a concept, a strategy, why an answer is wrong…"
                rows={2}
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: '14px', resize: 'none',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(255,255,255,0.07)', color: 'white',
                  fontSize: '14px', outline: 'none', lineHeight: '1.5', maxHeight: '120px',
                  fontFamily: 'inherit'
                }}
              />
              <button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                style={{
                  background: loading || !input.trim()
                    ? 'rgba(255,255,255,0.08)'
                    : 'linear-gradient(90deg, #f7971e, #ffd200)',
                  border: 'none', borderRadius: '12px',
                  width: '44px', height: '44px', minWidth: '44px',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '20px', color: loading || !input.trim() ? 'rgba(255,255,255,0.3)' : '#000',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >↑</button>
            </div>
            <div style={{
              fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '8px', textAlign: 'center'
            }}>
              Press Enter to send · Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        textarea::placeholder { color: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  );
}

export default AiTutor;
