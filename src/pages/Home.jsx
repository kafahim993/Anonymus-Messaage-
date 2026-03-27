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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060612; min-height: 100vh; font-family: 'Inter', sans-serif; overflow-x: hidden; }
        #root { width: 100% !important; max-width: 100% !important; border-inline: none !important; min-height: 100svh; display: flex; flex-direction: column; }
        .root {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 24px; position: relative; overflow: hidden;
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
          position: relative; z-index: 10; width: 100%; max-width: 480px;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; padding: 44px 40px 40px;
          backdrop-filter: blur(28px);
          box-shadow: 0 32px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12);
          animation: cardIn 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px) scale(0.94); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .ornament { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; animation: fadeUp 0.8s 0.2s both; }
        .ornament-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, #a78bfa88, transparent); }
        .ornament-dot { width: 7px; height: 7px; background: #a78bfa; border-radius: 50%; box-shadow: 0 0 10px #a78bfa; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .icon-wrap { display: flex; align-items: center; justify-content: center; margin-bottom: 14px; animation: fadeUp 0.8s 0.3s both; }
        .icon-circle {
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(167,139,250,0.2), rgba(96,165,250,0.15));
          border: 1px solid rgba(167,139,250,0.3);
          display: flex; align-items: center; justify-content: center; font-size: 24px;
          box-shadow: 0 0 30px rgba(167,139,250,0.2);
        }
        .title {
          font-size: 26px; font-weight: 700; text-align: center;
          background: linear-gradient(135deg, #c4b5fd, #93c5fd, #e879f9);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          margin-bottom: 6px; animation: fadeUp 0.8s 0.35s both; letter-spacing: -0.3px;
        }
        .subtitle { text-align: center; color: rgba(255,255,255,0.38); font-size: 13px; margin-bottom: 30px; animation: fadeUp 0.8s 0.4s both; }
        .textarea-wrap { position: relative; margin-bottom: 8px; animation: fadeUp 0.8s 0.45s both; }
        .msg-textarea {
          width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 16px 18px; color: rgba(255,255,255,0.88);
          font-family: 'Inter', sans-serif; font-size: 14.5px; line-height: 1.6;
          resize: none; height: 150px; outline: none;
          transition: border-color 0.25s, box-shadow 0.25s, background 0.25s;
        }
        .msg-textarea::placeholder { color: rgba(255,255,255,0.22); }
        .msg-textarea:focus { border-color: rgba(167,139,250,0.5); background: rgba(167,139,250,0.05); box-shadow: 0 0 0 3px rgba(167,139,250,0.1); }
        .char-count { text-align: right; font-size: 11.5px; color: rgba(255,255,255,0.25); margin-bottom: 18px; animation: fadeUp 0.8s 0.5s both; }
        .char-count.warn { color: #f87171; }
        .send-btn {
          width: 100%; padding: 14px; border-radius: 14px; border: none; cursor: pointer;
          font-family: 'Inter', sans-serif; font-size: 14.5px; font-weight: 600; letter-spacing: 0.3px;
          transition: all 0.25s; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: #fff;
          box-shadow: 0 4px 20px rgba(124,58,237,0.4); animation: fadeUp 0.8s 0.55s both;
        }
        .send-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,58,237,0.55); background: linear-gradient(135deg, #8b5cf6, #6366f1); }
        .send-btn:active:not(:disabled) { transform: translateY(0); }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-note { margin-top: 12px; padding: 10px 14px; background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); border-radius: 10px; color: #fca5a5; font-size: 13px; text-align: center; animation: fadeUp 0.4s both; }
        .anon-badge { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 20px; color: rgba(255,255,255,0.2); font-size: 12px; letter-spacing: 0.4px; animation: fadeUp 0.8s 0.6s both; }
        .anon-badge svg { width: 13px; height: 13px; opacity: 0.5; }
        .success-wrap { text-align: center; animation: cardIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
        .success-icon { font-size: 52px; margin-bottom: 16px; display: block; }
        .success-title { font-size: 22px; font-weight: 700; background: linear-gradient(135deg, #86efac, #34d399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 8px; }
        .success-msg { color: rgba(255,255,255,0.38); font-size: 13.5px; line-height: 1.6; margin-bottom: 28px; }
        .send-another-btn { width: 100%; padding: 13px; border-radius: 14px; border: 1px solid rgba(167,139,250,0.25); background: rgba(167,139,250,0.08); color: rgba(255,255,255,0.6); font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.25s; }
        .send-another-btn:hover { border-color: rgba(167,139,250,0.5); background: rgba(167,139,250,0.15); color: rgba(255,255,255,0.85); transform: translateY(-1px); }
        @media (max-width: 480px) { .card { padding: 32px 22px 28px; } .title { font-size: 22px; } }
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

              <div className="anon-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"></svg>
                🎭
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
