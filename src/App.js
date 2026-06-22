import React, { useState, useEffect } from 'react';
import './App.css';
import Practice from './Practice';
import MockTest from './MockTest';
import Admin from './Admin';
import Auth from './Auth';
import Dashboard from './Dashboard';
import AiTutor from './AiTutor';

function App() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [page, setPage] = useState('landing'); // landing | auth | dashboard | practice | mocktest | admin
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user is already logged in on load
  useEffect(() => {
    const saved = localStorage.getItem('examninjaCurrentUser');
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('examninjaCurrentUser');
    setCurrentUser(null);
    setPage('landing');
  };

  const handleStartFree = () => {
    if (currentUser) {
      setPage('dashboard');
    } else {
      setPage('auth');
    }
  };

  // Page routing
  if (page === 'admin') return <Admin onBack={() => setPage('landing')} />;
  if (page === 'auth') return <Auth onLogin={handleLogin} onBack={() => setPage('landing')} />;
  if (page === 'aitutor') return (
    <AiTutor user={currentUser} onBack={() => setPage(currentUser ? 'dashboard' : 'landing')} />
  );
  if (page === 'dashboard') return (
    <Dashboard
      user={currentUser}
      onStartPractice={() => setPage('practice')}
      onStartMockTest={() => setPage('mocktest')}
      onStartTutor={() => setPage('aitutor')}
      onLogout={handleLogout}
    />
  );
  if (page === 'practice') return (
    <Practice
      user={currentUser}
      onFinish={() => setPage('dashboard')}
      onBack={() => currentUser ? setPage('dashboard') : setPage('landing')}
    />
  );
  if (page === 'mocktest') return (
    <MockTest
      user={currentUser}
      onFinish={() => setPage('dashboard')}
      onBack={() => setPage('dashboard')}
    />
  );

  // Landing page
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email) {
      try {
        await fetch('https://formspree.io/f/xjgdlvze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        setSubmitted(true);
      } catch {
        setSubmitted(true);
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white', fontFamily: "'Segoe UI', sans-serif"
    }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 60px', borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>🥷 ExamNinja</div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="#features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Pricing</a>
          {currentUser ? (
            <button onClick={() => setPage('dashboard')} style={{
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              border: 'none', borderRadius: '25px', padding: '10px 24px',
              color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
            }}>
              My Dashboard
            </button>
          ) : (
            <button onClick={handleStartFree} style={{
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              border: 'none', borderRadius: '25px', padding: '10px 24px',
              color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
            }}>
              Start Free
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        textAlign: 'center', padding: '100px 20px 60px',
        maxWidth: '800px', margin: '0 auto'
      }}>
        <div style={{
          background: 'rgba(247,151,30,0.15)', border: '1px solid rgba(247,151,30,0.3)',
          borderRadius: '25px', padding: '8px 20px', display: 'inline-block',
          marginBottom: '24px', fontSize: '14px', color: '#ffd200'
        }}>
          🚀 India's Smartest CLAT Prep Platform
        </div>

        <h1 style={{
          fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px',
          background: 'linear-gradient(90deg, #ffffff, #ffd200)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          Stop Practicing.<br />Start Training.
        </h1>

        <p style={{
          fontSize: '20px', color: 'rgba(255,255,255,0.7)',
          marginBottom: '48px', lineHeight: '1.6'
        }}>
          ExamNinja doesn't just throw questions at you. It learns how your brain works
          and trains you like a personal coach — so every minute you practice actually counts.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} style={{
            display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap'
          }}>
            <input
              type="email" placeholder="Enter your email to get early access"
              value={email} onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: '16px 24px', borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.1)', color: 'white',
                fontSize: '16px', width: '320px', outline: 'none'
              }}
            />
            <button type="submit" style={{
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              border: 'none', borderRadius: '50px', padding: '16px 32px',
              color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'
            }}>
              Get Early Access 🥷
            </button>
          </form>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.1)', borderRadius: '16px',
            padding: '24px', fontSize: '18px'
          }}>
            🎉 You're on the list! We'll notify you when ExamNinja launches.
          </div>
        )}

        <p style={{ marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
          Free to start. No credit card required.
        </p>

        <button onClick={handleStartFree} style={{
          marginTop: '20px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px',
          padding: '12px 28px', color: 'rgba(255,255,255,0.7)',
          cursor: 'pointer', fontSize: '14px'
        }}>
          Try a free practice session →
        </button>
      </section>

      {/* Stats */}
      <section style={{
        display: 'flex', justifyContent: 'center', gap: '60px',
        padding: '60px 20px', flexWrap: 'wrap'
      }}>
        {[
          { number: '5,000+', label: 'Practice Questions' },
          { number: '70,000+', label: 'CLAT Aspirants' },
          { number: '3x', label: 'Faster Improvement' },
          { number: '100%', label: 'Free to Start' }
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: '40px', fontWeight: '800',
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {stat.number}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginTop: '4px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 60px', maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: '800', marginBottom: '60px' }}>
          Why ExamNinja is Different
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {[
            { icon: '🧠', title: 'Learns Your Brain', desc: 'Our AI maps exactly how you think — not just what you get wrong, but why. Then it fixes that specific pattern.' },
            { icon: '🎯', title: 'Surgical Practice', desc: 'No more random questions. Every question you see is chosen specifically for your weak spots on that day.' },
            { icon: '📊', title: 'Real Insights', desc: "Not just \"you scored 65%\". We tell you exactly which patterns cost you marks and how to fix them." },
            { icon: '⏱️', title: '20 Min Daily', desc: 'Designed for real life. 20 focused minutes with ExamNinja beats 3 hours of random practice.' },
            { icon: '🏆', title: 'Score Prediction', desc: 'Know your likely CLAT score right now — and exactly what to do to increase it.' },
            { icon: '🌍', title: 'Hindi + English', desc: 'Full platform in Hindi and English. Because your language should never be a barrier.' }
          ].map((feature, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px', padding: '32px'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{feature.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>Simple Pricing</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '60px', fontSize: '18px' }}>
          Start free. Upgrade when you're ready.
        </p>
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '24px',
          flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto'
        }}>
          {/* Free */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px', padding: '40px', width: '260px'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Free</h3>
            <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px' }}>₹0</div>
            {['10 questions/day', 'Basic performance tracker', '1 mock test/month', 'Email support'].map((item, i) => (
              <div key={i} style={{
                padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)', fontSize: '14px', textAlign: 'left'
              }}>✅ {item}</div>
            ))}
            <button onClick={handleStartFree} style={{
              width: '100%', marginTop: '24px', padding: '14px', borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
              color: 'white', cursor: 'pointer', fontSize: '16px'
            }}>
              Get Started Free
            </button>
          </div>

          {/* Pro */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(247,151,30,0.2), rgba(255,210,0,0.1))',
            border: '2px solid #ffd200', borderRadius: '20px', padding: '40px',
            width: '260px', position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
              background: 'linear-gradient(90deg, #f7971e, #ffd200)', color: '#000',
              fontWeight: 'bold', padding: '4px 20px', borderRadius: '20px', fontSize: '12px'
            }}>MOST POPULAR</div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Pro</h3>
            <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '4px' }}>₹299</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '24px', fontSize: '14px' }}>per month</div>
            {['Unlimited questions', 'Full AI analytics', 'Unlimited mock tests', 'Error pattern tracking', 'Score prediction', 'Priority support'].map((item, i) => (
              <div key={i} style={{
                padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)', fontSize: '14px', textAlign: 'left'
              }}>✅ {item}</div>
            ))}
            <button onClick={handleStartFree} style={{
              width: '100%', marginTop: '24px', padding: '14px', borderRadius: '50px',
              border: 'none', background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px'
            }}>
              Start Pro — ₹299/mo
            </button>
          </div>

          {/* Yearly */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px', padding: '40px', width: '260px'
          }}>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Yearly</h3>
            <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: '4px' }}>₹1,999</div>
            <div style={{ color: '#4ade80', marginBottom: '24px', fontSize: '14px' }}>Save ₹1,589/year</div>
            {['Everything in Pro', '2 months free', 'Early access to new features', 'Dedicated support'].map((item, i) => (
              <div key={i} style={{
                padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)', fontSize: '14px', textAlign: 'left'
              }}>✅ {item}</div>
            ))}
            <button onClick={handleStartFree} style={{
              width: '100%', marginTop: '24px', padding: '14px', borderRadius: '50px',
              border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
              color: 'white', cursor: 'pointer', fontSize: '16px'
            }}>
              Get Yearly — ₹1,999
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: 'center', padding: '100px 20px', background: 'rgba(255,255,255,0.03)' }}>
        <h2 style={{ fontSize: '40px', fontWeight: '800', marginBottom: '20px' }}>
          Ready to become a CLAT Ninja? 🥷
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', marginBottom: '40px' }}>
          Join thousands of aspirants training smarter, not harder.
        </p>
        <button onClick={handleStartFree} style={{
          background: 'linear-gradient(90deg, #f7971e, #ffd200)',
          border: 'none', borderRadius: '50px', padding: '18px 48px',
          color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px'
        }}>
          Start Free Today 🥷
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '40px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.4)', fontSize: '14px'
      }}>
        © 2026 ExamNinja. Built with 💛 in India.
        <span
          onClick={() => setPage('admin')}
          style={{ marginLeft: '20px', cursor: 'pointer', opacity: 0.1 }}
        >
          &middot;
        </span>
      </footer>
    </div>
  );
}

export default App;
