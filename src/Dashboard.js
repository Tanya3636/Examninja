import React from 'react';

function Dashboard({ user, onStartPractice, onStartMockTest, onStartTutor, onLogout }) {
  const results = JSON.parse(localStorage.getItem(`examninjaResults_${user.username}`) || '[]');

  const totalSessions = results.length;
  const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
  const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Section breakdown
  const sectionStats = {};
  results.forEach(r => {
    Object.entries(r.sections || {}).forEach(([section, data]) => {
      if (!sectionStats[section]) sectionStats[section] = { attempted: 0, correct: 0 };
      sectionStats[section].attempted += data.attempted;
      sectionStats[section].correct += data.correct;
    });
  });

  // Weak topics
  const topicStats = {};
  results.forEach(r => {
    Object.entries(r.topics || {}).forEach(([topic, data]) => {
      if (!topicStats[topic]) topicStats[topic] = { attempted: 0, correct: 0 };
      topicStats[topic].attempted += data.attempted;
      topicStats[topic].correct += data.correct;
    });
  });
  const weakTopics = Object.entries(topicStats)
    .filter(([_, d]) => d.attempted > 0)
    .map(([topic, d]) => ({ topic, accuracy: Math.round((d.correct / d.attempted) * 100), ...d }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const recentSessions = results.slice(-7).reverse();

  const sectionColors = {
    'Legal Reasoning': '#f7971e',
    'English Language': '#4ade80',
    'Logical Reasoning': '#60a5fa',
    'Quantitative Techniques': '#f472b6',
    'Current Affairs': '#a78bfa'
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: 'white', fontFamily: "'Segoe UI', sans-serif", padding: '20px'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '40px', padding: '0 4px'
        }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>🥷 ExamNinja</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '3px' }}>
              Welcome back, {user.name} 👋
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={onStartPractice} style={{
              background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              border: 'none', borderRadius: '25px', padding: '10px 22px',
              color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
            }}>
              Practice Now 🥷
            </button>
            <button onClick={onStartMockTest} style={{
              background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.4)',
              borderRadius: '25px', padding: '10px 18px', color: '#60a5fa',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600'
            }}>
              📝 Full Mock Test
            </button>
            <button onClick={onStartTutor} style={{
              background: 'rgba(247,151,30,0.15)', border: '1px solid rgba(247,151,30,0.4)',
              borderRadius: '25px', padding: '10px 18px', color: '#ffd200',
              cursor: 'pointer', fontSize: '13px', fontWeight: '600'
            }}>
              🤖 AI Tutor
            </button>
            <button onClick={onLogout} style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '25px', padding: '10px 18px', color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', fontSize: '13px'
            }}>
              Log Out
            </button>
          </div>
        </div>

        {/* No data yet */}
        {totalSessions === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎯</div>
            <h2 style={{ fontSize: '26px', marginBottom: '12px' }}>Your journey starts now</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '32px', fontSize: '15px' }}>
              Complete your first practice session to see your performance dashboard.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={onStartPractice} style={{
                background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                border: 'none', borderRadius: '50px', padding: '16px 48px',
                color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '17px'
              }}>
                Start First Session 🥷
              </button>
              <button onClick={onStartMockTest} style={{
                background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.4)',
                borderRadius: '50px', padding: '16px 36px', color: '#60a5fa',
                cursor: 'pointer', fontSize: '15px', fontWeight: '600'
              }}>
                📝 Try Full Mock Test
              </button>
              <button onClick={onStartTutor} style={{
                background: 'rgba(247,151,30,0.15)', border: '1px solid rgba(247,151,30,0.4)',
                borderRadius: '50px', padding: '16px 36px', color: '#ffd200',
                cursor: 'pointer', fontSize: '15px', fontWeight: '600'
              }}>
                🤖 Ask AI Tutor
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '16px', marginBottom: '20px'
            }}>
              {[
                { label: 'Sessions', value: totalSessions, icon: '📅' },
                { label: 'Questions Done', value: totalQuestions, icon: '📝' },
                { label: 'Correct', value: totalCorrect, icon: '✅' },
                { label: 'Accuracy', value: `${accuracy}%`, icon: '🎯' }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px', padding: '22px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '26px', marginBottom: '6px' }}>{stat.icon}</div>
                  <div style={{
                    fontSize: '30px', fontWeight: '800',
                    background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                  }}>
                    {stat.value}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginTop: '4px' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

              {/* Section Performance */}
              <div style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px', padding: '26px'
              }}>
                <h3 style={{ fontSize: '15px', marginBottom: '20px', color: 'rgba(255,255,255,0.75)' }}>
                  📊 Section Performance
                </h3>
                {Object.keys(sectionStats).length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                    Practice more to see breakdown
                  </p>
                ) : (
                  Object.entries(sectionStats).map(([section, data]) => {
                    const pct = data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0;
                    const color = sectionColors[section] || '#ffd200';
                    return (
                      <div key={section} style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)' }}>{section}</span>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color }}>{pct}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '4px', height: '5px' }}>
                          <div style={{
                            width: `${pct}%`, height: '100%', background: color,
                            borderRadius: '4px', transition: 'width 0.5s'
                          }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Focus Areas */}
              <div style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px', padding: '26px'
              }}>
                <h3 style={{ fontSize: '15px', marginBottom: '20px', color: 'rgba(255,255,255,0.75)' }}>
                  🎯 Focus Areas
                </h3>
                {weakTopics.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
                    Practice more to see weak areas
                  </p>
                ) : (
                  weakTopics.map((t, i) => (
                    <div key={i} style={{
                      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: '10px', padding: '12px 14px', marginBottom: '10px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>{t.topic || 'General'}</div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                          {t.correct}/{t.attempted} correct
                        </div>
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '800', color: '#ef4444' }}>
                        {t.accuracy}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Sessions */}
            <div style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px', padding: '26px'
            }}>
              <h3 style={{ fontSize: '15px', marginBottom: '20px', color: 'rgba(255,255,255,0.75)' }}>
                📅 Recent Sessions
              </h3>
              {recentSessions.map((session, i) => {
                const pct = Math.round((session.correct / session.totalQuestions) * 100);
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <div>
                      <div style={{ fontSize: '14px' }}>
                        {session.correct}/{session.totalQuestions} correct
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                        {new Date(session.date).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </div>
                    <div style={{
                      fontSize: '18px', fontWeight: '800',
                      color: pct >= 70 ? '#4ade80' : pct >= 50 ? '#fbbf24' : '#ef4444'
                    }}>
                      {pct}%
                    </div>
                  </div>
                );
              })}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
                <button onClick={onStartPractice} style={{
                  flex: 1, padding: '13px', borderRadius: '50px',
                  border: 'none', background: 'linear-gradient(90deg, #f7971e, #ffd200)',
                  color: '#000', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px',
                  minWidth: '120px'
                }}>
                  Practice 🥷
                </button>
                <button onClick={onStartMockTest} style={{
                  flex: 1, padding: '13px', borderRadius: '50px',
                  background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.4)',
                  color: '#60a5fa', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                  minWidth: '120px'
                }}>
                  📝 Mock Test
                </button>
                <button onClick={onStartTutor} style={{
                  flex: 1, padding: '13px', borderRadius: '50px',
                  background: 'rgba(247,151,30,0.15)', border: '1px solid rgba(247,151,30,0.4)',
                  color: '#ffd200', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                  minWidth: '120px'
                }}>
                  🤖 AI Tutor
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
