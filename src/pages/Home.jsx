import { useState, useEffect } from "react";

function Particle({ style }) {
  return <div className="particle" style={style} />;
}

function Star({ style }) {
  return <div className="star" style={style} />;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const MAX_CHARS = 500;

  const stars = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${1 + Math.random() * 2.5}px`,
    opacity: 0.3 + Math.random() * 0.7,
    delay: `${Math.random() * 4}s`,
  }));

  useEffect(() => {
    setMounted(true);
    const p = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animDelay: `${Math.random() * 8}s`,
      animDuration: `${6 + Math.random() * 6}s`,
      size: `${3 + Math.random() * 5}px`,
      color: i % 3 === 0 ? "#a78bfa" : i % 3 === 1 ? "#60a5fa" : "#f472b6",
      opacity: 0.3 + Math.random() * 0.5,
    }));
    setParticles(p);
  }, []);

  async function handleSend() {
    const trimmed = message.trim();
    if (!trimmed) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage("");
      } else {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Could not reach the server. Try again.");
      setStatus("error");
    }
  }

  function handleReset() {
    setStatus("idle");
    setErrorMsg("");
  }

  return (
    <>
      {/* Essential for Mobile Scaling and Keyboard handling */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
      
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        *, *::before, *::after { 
          box-sizing: border-box; 
          margin: 0; padding: 0; 
          -webkit-tap-highlight-color: transparent; /* Removes blue flash on tap in iOS/Android */
        }

        body { 
          background: #060612; 
          min-height: 100vh; 
          /* Prevents rubber-band scrolling on iOS */
          overscroll-behavior: none; 
          font-family: 'Inter', sans-serif; 
          overflow-x: hidden; 
        }

        /* 100svh ensures the UI doesn't jump when mobile browser address bars hide/show */
        .root {
          min-height: 100svh; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          padding: 20px; 
          position: relative; 
          overflow: hidden;
          background: radial-gradient(ellipse at 20% 20%, #1a0a3d 0%, transparent 55%),
                      radial-gradient(ellipse at 80% 80%, #0a1a3d 0%, transparent 55%),
                      radial-gradient(ellipse at 50% 50%, #0d0a20 0%, #060612 100%);
        }

        .star { position: absolute; border-radius: 50%; background: white; animation: twinkle var(--dur, 3s) var(--delay, 0s) ease-in-out infinite alternate; }
        @keyframes twinkle {
          from { opacity: var(--min-op, 0.2); transform: scale(0.8); }
          to   { opacity: var(--max-op, 1);   transform: scale(1.2); }
        }

        .particle { position: fixed; bottom: -10px; border-radius: 50%; animation: particleRise var(--dur, 8s) var(--delay, 0s) ease-in infinite; pointer-events: none; z-index: 0; }
        @keyframes particleRise {
          0%   { transform: translateY(0) scale(1);   opacity: var(--op, 0.6); }
          100% { transform: translateY(-105vh) scale(0.2); opacity: 0; }
        }

        .card {
          position: relative; 
          z-index: 10; 
          width: 100%; 
          max-width: 480px;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 28px; 
          padding: 35px 25px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px); /* Safari support */
          box-shadow: 0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12);
          animation: cardIn 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }

        .ornament { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .ornament-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, #a78bfa88, transparent); }
        .ornament-dot { width: 7px; height: 7px; background: #a78bfa; border-radius: 50%; box-shadow: 0 0 10px #a78bfa; }

        .icon-wrap { display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
        .icon-circle {
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(167,139,250,0.2), rgba(96,165,250,0.15));
          border: 1px solid rgba(167,139,250,0.3);
          display: flex; align-items: center; justify-content: center; font-size: 24px;
        }

        .title {
          font-size: 24px; font-weight: 700; text-align: center;
          background: linear-gradient(135deg, #c4b5fd, #93c5fd, #e879f9);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin-bottom: 6px; letter-spacing: -0.3px;
        }

        .subtitle { text-align: center; color: rgba(255,255,255,0.38); font-size: 13px; margin-bottom: 25px; }

        .textarea-wrap { position: relative; margin-bottom: 8px; }
        .msg-textarea {
          width: 100%; 
          background: rgba(255,255,255,0.04); 
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; 
          padding: 16px; 
          color: #fff;
          font-family: 'Inter', sans-serif; 
          /* Font size must be at least 16px on iOS to prevent auto-zoom */
          font-size: 16px; 
          line-height: 1.5;
          resize: none; 
          height: 140px; 
          outline: none;
          transition: all 0.25s;
          /* Critical for mobile: removes default shadow on iOS inputs */
          -webkit-appearance: none;
        }

        .msg-textarea:focus { border-color: rgba(167,139,250,0.5); background: rgba(167,139,250,0.08); }

        .char-count { text-align: right; font-size: 12px; color: rgba(255,255,255,0.25); margin-bottom: 18px; }
        .char-count.warn { color: #f87171; }

        .send-btn {
          width: 100%; padding: 16px; border-radius: 16px; border: none;
          font-size: 16px; font-weight: 600; 
          background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #fff;
          box-shadow: 0 4px 20px rgba(124,58,237,0.3);
          /* Prevents grey overlay on mobile when clicking */
          user-select: none;
        }

        .send-btn:active { transform: scale(0.98); opacity: 0.9; }

        .error-note { margin-top: 12px; padding: 10px; background: rgba(248,113,113,0.1); border-radius: 10px; color: #fca5a5; font-size: 13px; text-align: center; }
        .github-link { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 25px; color: rgba(255,255,255,0.3); font-size: 12px; text-decoration: none; }
        .github-link svg { width: 18px; height: 18px; fill: currentColor; }

        .success-wrap { text-align: center; }
        .success-icon { font-size: 48px; margin-bottom: 10px; display: block; }
        .success-title { font-size: 22px; font-weight: 700; color: #86efac; margin-bottom: 8px; }
        .success-msg { color: rgba(255,255,255,0.5); font-size: 14px; margin-bottom: 25px; }
        
        .send-another-btn { 
          width: 100%; padding: 14px; border-radius: 14px; 
          border: 1px solid rgba(255,255,255,0.1); 
          background: rgba(255,255,255,0.05); 
          color: #fff; font-size: 14px; 
        }

        @media (max-width: 400px) {
          .card { padding: 30px 20px; }
          .title { font-size: 20px; }
        }
      `}</style>

      <div className="root">
        {stars.map((s) => (
          <Star key={s.id} style={{ left: s.left, top: s.top, width: s.size, height: s.size, opacity: s.opacity, "--dur": `${2 + Math.random() * 3}s`, "--delay": s.delay, "--min-op": s.opacity * 0.3, "--max-op": s.opacity }} />
        ))}
        {mounted && particles.map((p) => (
          <Particle key={p.id} style={{ left: p.left, width: p.size, height: p.size, background: p.color, "--dur": p.animDuration, "--delay": p.animDelay, "--op": p.opacity }} />
        ))}

        <div className="card">
          {status === "success" ? (
            <div className="success-wrap">
              <span className="success-icon">✉️</span>
              <div className="success-title">Message Sent!</div>
              <p className="success-msg">Your anonymous message was delivered.<br />No one will ever know it was you 🤫</p>
              <button className="send-another-btn" onClick={handleReset}>Send another message</button>
            </div>
          ) : (
            <>
              <div className="ornament">
                <div className="ornament-line" />
                <div className="ornament-dot" />
                <div className="ornament-line" />
              </div>
              <div className="icon-wrap"><div className="icon-circle">💬</div></div>
              <h1 className="title">Send Anonymous Message</h1>
              <p className="subtitle">To Kawsar Ahmed Fahim</p>

              <div className="textarea-wrap">
                <textarea
                  className="msg-textarea"
                  placeholder="Write your message here…"
                  value={message}
                  maxLength={MAX_CHARS}
                  onChange={(e) => { setMessage(e.target.value); if (status === "error") setStatus("idle"); }}
                  disabled={status === "sending"}
                />
              </div>
              <div className={`char-count${message.length > MAX_CHARS - 40 ? " warn" : ""}`}>{message.length} / {MAX_CHARS}</div>

              <button className="send-btn" onClick={handleSend} disabled={status === "sending" || !message.trim()}>
                {status === "sending" ? "Sending…" : "Send Anonymously 🚀"}
              </button>

              {status === "error" && <div className="error-note">⚠️ {errorMsg}</div>}

              <a 
                href="https://github.com/kafahim993/Anonymus-Messaage-" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="github-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span>GitHub</span>
              </a>
            </>
          )}
        </div>
      </div>
    </>
  );
}
