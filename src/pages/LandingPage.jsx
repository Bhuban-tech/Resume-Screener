import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'wouter';

/* ─── Feature icons as colored SVG-style boxes (matching the reference HTML) ─── */
const FEATURES = [
  {
    title: 'Smart Screening',
    description: 'Upload multiple PDFs and screen them against any job description instantly.',
    icon: '🎯',
    bg: 'rgba(239,68,68,0.15)',
  },
  {
    title: 'Skill Matching',
    description: 'Skills matched against your job description and ranked automatically.',
    icon: '⚡',
    bg: 'rgba(250,204,21,0.15)',
  },
  {
    title: 'Ranked Results',
    description: 'Candidates ranked by score with clear skill match and gap analysis.',
    icon: '📊',
    bg: 'rgba(59,130,246,0.15)',
  },
  {
    title: 'Export CSV',
    description: 'Download your screening results as a CSV for further analysis or sharing.',
    icon: '📁',
    bg: 'rgba(251,146,60,0.15)',
  },
];

export default function LandingPage() {
  const [, navigate] = useLocation();
  const canvasRef = useRef(null);
  const statsRef = useRef(null);

  const [stats, setStats] = useState({ resumes: 0, time: 0, accuracy: 0 });

  /* ─── Particle canvas (exact port from resumescreen_redesign.html script) ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight || 900;
    }
    resize();
    window.addEventListener('resize', resize);

    function rand(a, b) { return a + Math.random() * (b - a); }

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: rand(0, W), y: rand(0, H),
        vx: rand(-0.2, 0.2), vy: rand(-0.3, -0.08),
        r: rand(1, 2.5), o: rand(0.2, 0.6),
      });
    }

    let animId;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,110,247,${p.o})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < 0) p.y = H;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(79,110,247,${0.12 * (1 - d / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  /* ─── Count-up animation (exact port from reference) ─── */
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const dur = 1200;
            const step = 16;
            const steps = dur / step;
            let current = 0;
            const timer = setInterval(() => {
              current++;
              setStats({
                resumes: Math.min(Math.floor((50 / steps) * current), 50),
                time: Math.min(Math.floor((30 / steps) * current), 30),
                accuracy: Math.min(Math.floor((98 / steps) * current), 98),
              });
              if (current >= steps) {
                clearInterval(timer);
                setStats({ resumes: 50, time: 30, accuracy: 98 });
              }
            }, step);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="rs-wrap">
      {/* Particle canvas background */}
      <canvas id="particles" ref={canvasRef} />

      {/* ═══════════ HERO ═══════════ */}
      <section className="rs-hero">
        <div className="rs-pill">
          <div className="rs-logo-dot" style={{ width: 6, height: 6, animationDelay: '.5s' }} />
          AI-Powered Resume Screening
        </div>
        <h1 className="rs-h1">
          Screen resumes<br />
          <span className="hi">in seconds,</span><br />
          not hours.
        </h1>
        <p className="rs-sub">
          Upload PDF resumes, paste a job description, and get ranked candidates with skill match scores — instantly.
        </p>
        <div className="rs-hero-btns">
          <button className="rs-btn-primary" onClick={() => navigate('/dashboard')}>
            Get Started — It's Free
          </button>
          <button className="rs-btn-outline" onClick={() => navigate('/dashboard')}>
            See Demo
          </button>
        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <div className="rs-stats" ref={statsRef}>
        <div className="rs-stat" style={{ borderRadius: '16px 0 0 16px' }}>
          <div className="rs-stat-num">{stats.resumes}+</div>
          <div className="rs-stat-label">Resumes per batch</div>
        </div>
        <div className="rs-stat" style={{ borderLeft: 'none' }}>
          <div className="rs-stat-num">&lt;{stats.time}s</div>
          <div className="rs-stat-label">Screening time</div>
        </div>
        <div className="rs-stat" style={{ borderRadius: '0 16px 16px 0', borderLeft: 'none' }}>
          <div className="rs-stat-num">{stats.accuracy}%</div>
          <div className="rs-stat-label">Skill accuracy</div>
        </div>
      </div>

      {/* ═══════════ FEATURES ═══════════ */}
      <section className="rs-section">
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div className="rs-section-tag">Features</div>
          <h2 className="rs-section-title">Everything you need to hire faster</h2>
          <p className="rs-section-sub">No more reading every resume manually</p>
        </div>
        <div className="rs-features">
          {FEATURES.map((f) => (
            <div className="rs-feat" key={f.title}>
              <div className="rs-feat-icon" style={{ background: f.bg }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS / STEPS ═══════════ */}
      <section className="rs-section" style={{ paddingTop: 0 }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div className="rs-section-tag">How it works</div>
          <h2 className="rs-section-title">Three simple steps</h2>
        </div>
        <div className="rs-steps-row">
          {[
            { num: '01', title: 'Paste Job Description', desc: 'Add the job title, required experience, and full job description.' },
            { num: '02', title: 'Upload Resumes', desc: 'Drag and drop up to 50 PDF resumes at once.' },
            { num: '03', title: 'Get Ranked Results', desc: 'View scored, ranked candidates with detailed skill analysis.' },
          ].map((s) => (
            <div className="rs-step" key={s.num}>
              <div className="rs-step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ DASHBOARD PREVIEW (from reference images 4 & 5) ═══════════ */}
      <section className="rs-dashboard-preview">
        <div className="rs-section-tag" style={{ marginBottom: 16 }}>Dashboard Preview</div>
        <div className="rs-dash">
          <div className="rs-dash-bar">
            <div className="rs-dash-dot" />
            <div className="rs-dash-dot" style={{ background: '#febc2e' }} />
            <div className="rs-dash-dot" style={{ background: '#28c840' }} />
            <div className="rs-dash-url">localhost:5174/dashboard</div>
          </div>
          <div className="rs-dash-inner">
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
                Resume Screening Dashboard
              </h3>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                Saved jobs, async batch screening, must-have skills, PDF/DOCX uploads.
              </p>
            </div>
            <div className="rs-dash-grid">
              <div className="rs-form-card">
                <div className="rs-field">
                  <div className="rs-label">Job Title</div>
                  <input className="rs-input" type="text" defaultValue="Software Engineer" readOnly />
                </div>
                <div className="rs-field">
                  <div className="rs-label">Must-have skills</div>
                  <input className="rs-input" type="text" placeholder="e.g. Java, Spring Boot, MySQL" readOnly />
                </div>
                <div className="rs-field">
                  <div className="rs-label">Job Description</div>
                  <textarea
                    className="rs-textarea"
                    placeholder="Paste the job description here — include required skills, experience, and qualifications."
                    readOnly
                  />
                </div>
                <div className="rs-field">
                  <div className="rs-label">Upload Resumes</div>
                  <div className="rs-dropzone">
                    <div className="rs-dropzone-icon">📄</div>
                    <p><span>Drag &amp; drop</span> PDF or DOCX resumes</p>
                    <p style={{ marginTop: 4, fontSize: 11, opacity: 0.6 }}>PDF or DOCX · Max 10MB · Up to 50 files</p>
                  </div>
                </div>
                <button
                  className="rs-btn-primary"
                  style={{ width: '100%', padding: 14 }}
                  onClick={() => navigate('/dashboard')}
                >
                  Start Screening
                </button>
              </div>
              <div className="rs-sidebar">
                <div className="rs-sidebar-card">
                  <h4>Saved Jobs</h4>
                  <p style={{ fontSize: 12 }}>Saved jobs appear here after your first screening.</p>
                </div>
                <div className="rs-sidebar-card">
                  <h4>Screening History</h4>
                  <p style={{ fontSize: 12 }}>No screening history yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <div className="rs-cta">
        <h2>Ready to screen smarter?</h2>
        <p>Start screening resumes in seconds. No account required.</p>
        <button
          className="rs-btn-primary"
          style={{ fontSize: 15, padding: '15px 36px' }}
          onClick={() => navigate('/dashboard')}
        >
          Start Screening Now
        </button>
      </div>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="rs-footer">© 2025 ResumeScreen · Built with React + Spring Boot</footer>
    </div>
  );
}
