"use client";
import { useState } from "react";
export default function AiCoachPage() {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Salut ! Je suis ton FIT PRO AI COACH. Dis-moi ton objectif : prise de masse, perte de poids, endurance ?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  async function send() {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: userMsg.content }) });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "Reessaie." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Erreur connexion, reessaie." }]);
    }
    setLoading(false);
  }
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>FIT PRO AI COACH</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ background: m.role === "user" ? "#dcfce7" : "#f1f5f9", padding: 12, borderRadius: 12 }}>{m.content}</div>
        ))}
        {loading && <div>Le coach ecrit...</div>}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ton objectif..." style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid #ccc" }} />
        <button onClick={send} style={{ padding: "12px 20px", borderRadius: 12, background: "#16a34a", color: "white", border: "none" }}>Envoyer</button>
      </div>
    </div>
  );
}
