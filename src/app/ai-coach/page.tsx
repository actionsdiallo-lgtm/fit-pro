"use client";
import { useState } from "react";

export default function AiCoachPage() {
  const [messages, setMessages] = useState<{role:string; content:string}[]>([
    { role: "assistant", content: "Salut ! Je suis ton FIT PRO AI COACH. Dis-moi ton objectif : prise de masse, perte de poids, endurance ?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const newMsgs = [...messages, { role: "user", content: input }];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });
      const data = await res.json();
      setMessages([...newMsgs, { role: "assistant", content: data.reply || "Je n'ai pas compris, réessaie." }]);
    } catch {
      setMessages([...newMsgs, { role: "assistant", content: "Erreur, réessaie." }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold" }}>🤖 FIT PRO AI COACH</h1>
      <p style={{ color: "#666" }}>Ton coach personnel - Premium</p>
      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ background: m.role === "user" ? "#000" : "#eee", color: m.role === "user" ? "#fff" : "#000", padding: 12, borderRadius: 12, alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            {m.content}
          </div>
        ))}
        {loading && <p>Le coach écrit...</p>}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ex: Je veux perdre du poids..." style={{ flex: 1, padding: 12, borderRadius: 10, border: "1px solid #ccc" }} />
        <button onClick={send} style={{ background: "#000", color: "#fff", padding: "12px 18px", borderRadius: 10 }}>Envoyer</button>
      </div>
    </div>
  );
            }
