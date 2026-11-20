"use client";
import { useState } from "react";
export default function AICoach() {
  const [lang, setLang] = useState<"fr" | "en">("fr");
  const [voiceOn, setVoiceOn] = useState(true);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    { role: "ai", text: "Salut champion ! Je suis ton FIT PRO AI. Choisis Français ou English en haut et pose-moi ta question." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const speak = (text: string) => {
    if (!voiceOn) return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang === "en" ? "en-US" : "fr-FR";
    window.speechSynthesis.speak(u);
  };
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput(""); setLoading(true);
    try {
      const res = await fetch("/api/ai-coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text, lang }) });
      const data = await res.json();
      const reply = data.reply || "Désolé, réessaie.";
      setMessages((m) => [...m, { role: "ai", text: reply }]);
      speak(reply);
    } catch { setMessages((m) => [...m, { role: "ai", text: "Erreur de connexion." }]); }
    setLoading(false);
  };
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16, paddingBottom: 100, background: "#fff", minHeight: "100vh" }}>
      <h1 style={{ color: "#000", fontSize: 22, fontWeight: 800 }}>🤖 FIT PRO AI COACH</h1>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button onClick={() => setLang("fr")} style={{ flex: 1, padding: 10, borderRadius: 20, border: "none", background: lang === "fr" ? "#000" : "#eee", color: lang === "fr" ? "#fff" : "#000", fontWeight: 700 }}>🇫🇷 Français</button>
        <button onClick={() => setLang("en")} style={{ flex: 1, padding: 10, borderRadius: 20, border: "none", background: lang === "en" ? "#000" : "#eee", color: lang === "en" ? "#fff" : "#000", fontWeight: 700 }}>🇺🇸 English USA</button>
      </div>
      <button onClick={() => setVoiceOn(!voiceOn)} style={{ width: "100%", marginTop: 8, padding: 10, borderRadius: 20, border: "1px solid #ddd", background: voiceOn ? "#000" : "#fff", color: voiceOn ? "#fff" : "#000", fontWeight: 700 }}>{voiceOn ? "🔊 Voix : ON - Appuie pour couper" : "🔇 Voix : OFF - Appuie pour activer"}</button>
      <p style={{ color: "#666", fontSize: 13, marginTop: 8 }}>{lang === "en" ? "I answer everything, in American English" : "Je réponds à tout, en français"}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
        {messages.map((m, i) => (
          <div key={i} onClick={() => m.role === "ai" && speak(m.text)} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#000" : "#f1f1f1", color: m.role === "user" ? "#fff" : "#000", padding: 12, borderRadius: 14, maxWidth: "85%", fontSize: 15, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.text}{m.role === "ai" ? " 🔊" : ""}</div>
        ))}
        {loading && <p>{lang === "en" ? "AI is thinking..." : "L'AI réfléchit..."}</p>}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#fff", padding: 12, borderTop: "1px solid #eee", display: "flex", gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder={lang === "en" ? "Write your question..." : "Écris ta question..."} style={{ flex: 1, padding: 12, borderRadius: 25, border: "1px solid #ddd", color: "#000", outline: "none" }} />
        <button onClick={sendMessage} style={{ background: "#000", color: "#fff", border: "none", padding: "12px 16px", borderRadius: 25, fontWeight: 700 }}>{lang === "en" ? "Send" : "Envoyer"}</button>
      </div>
    </div>
  );
        }
