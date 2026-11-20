"use client";
import { useState } from "react";

export default function AICoach() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Salut champion ! Je suis ton FIT PRO AI. Pose-moi ta question sur le sport, la muscu ou la nourriture." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, lang }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply || "ERREUR: PAS DE REPONSE" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "ERREUR SERVEUR" }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16, paddingBottom: 100, minHeight: "100vh", backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2000&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.9)", padding: 10, borderRadius: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: "bold", margin: 0 }}>FIT PRO AI 🤖</h1>
        <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} style={{ padding: "8px 14px", borderRadius: 20, background: "#000", color: "#fff", border: "none" }}>
          {lang === "fr" ? "FR | EN" : "EN | FR"}
        </button>
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#000" : "#ffffff", color: m.role === "user" ? "#fff" : "#000", padding: "10px 14px", borderRadius: 18, maxWidth: "85%", whiteSpace: "pre-line", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ fontSize: 14, color: "#fff", background: "#000", padding: "6px 10px", borderRadius: 10, alignSelf: "flex-start" }}>L&apos;IA écrit...</div>}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: 12, display: "flex", gap: 8, borderTop: "1px solid #eee" }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder={lang === "fr" ? "Pose ta question..." : "Ask your question..."} style={{ flex: 1, padding: 12, borderRadius: 20, border: "1px solid #ddd", outline: "none" }} />
        <button onClick={send} style={{ padding: "12px 18px", borderRadius: 20, background: "#000", color: "#fff", border: "none", fontWeight: "bold" }}>➤</button>
      </div>
    </div>
  );
      }
