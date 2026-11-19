"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const input = { width: "100%", padding: 14, borderRadius: 12, border: "1px solid #333", backgroundColor: "#1A1A1A", color: "white", marginTop: 8, boxSizing: "border-box" as const };
  return (
    <div style={{ padding: 20, backgroundColor: "#0A0F0A", minHeight: "100vh", color: "white", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <h1 style={{ fontSize: 32, margin: 0 }}>Bon retour 👋</h1>
      <p style={{ color: "#AAA" }}>Connecte-toi pour reprendre ton entraînement</p>
      <label style={{ marginTop: 20 }}>Email</label>
      <input style={input} placeholder="diallo@gmail.com" value={email} onChange={e => setEmail(e.target.value)} />
      <label style
