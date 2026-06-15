import React, { useState, useRef, useEffect } from 'react';

function AiAssistant({ context, initialPrompt, onInitialPromptUsed }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // If a prompt is passed in (e.g. "explain this question"), open and auto-send it
  useEffect(() => {
    if (!initialPrompt) return;
    if (!isOpen) {
      setIsOpen(true); // panel will open → effect re-runs with isOpen=true
      return;
    }
    send(initialPrompt);
    if (onInitialPromptUsed) onInitialPromptUsed();
  }, [initialPrompt, isOpen]); // eslint-disable-line

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [messages, isOpen, loading]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

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
          context: context || ''
        })
      });

      const data = await res.json();

      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Check your internet and try again!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Explain this question to me",
    "Why is this the correct answer?",
    "Give me a tip for this section",
    "I'm confused — help me understand"
  ];

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          title="Ask AI Tutor"
          style={{
            position: 'fixed', bottom: '24px', right: '24px',
            width: '58px', height: '58px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #f7971e, #ffd200)',
            border: 'none', cursor: 'pointer', fontSize: '26px',
            boxShadow: '0 4px 24px rgba(247,151,30,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}
        >
          🤖
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '360px', height: '540px',
          background: '#13132b',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '20px', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
          zIndex: 1000, overflow: 'hidden',
          fontFamily: "'Segoe UI', sans-serif"
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(90deg, rgba(247,151,30,0.15), rgba(255,210,0,0.08))',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0
          }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>
                🤖 ExamNinja AI
              </div>
              <div style={{ fontSize: '11px', color: '#ffd200', marginTop: '1px' }}>
                Personal CLAT tutor · Available 24/7
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{
              background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%',
              width: '28px', height: '28px', color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer', fontSize: '13px', display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '10px'
          }}>

            {/* Empty state */}
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🥷</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '6px', fontWeight: '600' }}>
                  Hi! I'm your AI tutor.
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: '1.6' }}>
                  Ask me anything about CLAT — legal reasoning, logical arguments, English comprehension, maths, or any concept you're stuck on.
                </div>

                {/* Quick prompts */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {quickPrompts.map((prompt, i) => (
                    <button key={i} onClick={() => send(prompt)} style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '20px', padding: '8px 14px', color: 'rgba(255,255,255,0.65)',
                      cursor: 'pointer', fontSize: '12px', textAlign: 'left'
                    }}>
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message bubbles */}
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  maxWidth: '88%', padding: '10px 14px',
                  borderRadius: '16px', fontSize: '13px', lineHeight: '1.65',
                  background: msg.role === 'user'
                    ? 'linear-gradient(90deg, #f7971e, #ffd200)'
                    : 'rgba(255,255,255,0.08)',
                  color: msg.role === 'user' ? '#000' : 'rgba(255,255,255,0.88)',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 16px', borderRadius: '16px', borderBottomLeftRadius: '4px',
                  background: 'rgba(255,255,255,0.08)', display: 'flex', gap: '4px', alignItems: 'center'
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: '#ffd200', opacity: 0.7,
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
            padding: '12px 14px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask anything about CLAT..."
              style={{
                flex: 1, padding: '10px 14px', borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)', color: 'white',
                fontSize: '13px', outline: 'none'
              }}
            />
            <button
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim()
                  ? 'rgba(255,255,255,0.1)'
                  : 'linear-gradient(90deg, #f7971e, #ffd200)',
                border: 'none', borderRadius: '50%',
                width: '38px', height: '38px', minWidth: '38px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '17px', color: loading || !input.trim() ? 'rgba(255,255,255,0.3)' : '#000',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              ↑
            </button>
          </div>

          {/* Bounce animation */}
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-4px); }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

export default AiAssistant;
