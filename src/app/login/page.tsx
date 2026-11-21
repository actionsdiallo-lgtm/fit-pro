"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { playClick, playSuccess } from "../../lib/sound";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    playClick();
    if (!email.trim() || !password) {
      alert("Mets ton email et ton mot de passe");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      alert(error.message || "Email ou mot de passe incorrect");
      return;
    }

    playSuccess();
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main
      style={{
        background: "#040706",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "system-ui",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            width: 64,
            height: 64,
            background: "#00FF88",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            color: "#000",
            fontSize: 32,
            margin: "0 auto",
          }}
        >
          F
        </div>
        <h1 style={{ margin: "12px 0 0", fontSize: 28, fontWeight: 900 }}>
          FIT <span style={{ color: "#00FF88" }}>PRO</span>
        </h1>
        <p style={{ margin: "6px 0 0", color: "#8A9A8F", fontSize: 13 }}>
          Bon retour, connecte-toi
        </p>
      </div>

      <div
        style={{
          background: "#101613",
          borderRadius: 20,
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <label style={{ fontSize: 13, color: "#8A9A8F" }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          style={{
            background: "#0A0F0D",
            border: "1px solid #1E2A24",
            borderRadius: 12,
            padding: "14px",
            color: "#fff",
            fontSize: 15,
            width: "100%",
            boxSizing: "border-box",
          }}
        />

        <label style={{ fontSize: 13, color: "#8A9A8F" }}>Mot de passe</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type={show ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              background: "#0A0F0D",
              border: "1px solid #1E2A24",
              borderRadius: 12,
              padding: "14px",
              color: "#fff",
              fontSize: 15,
              flex: 1,
            }}
          />
          <button
            type="button"
            onClick={() => {
              playClick();
              setShow(!show);
            }}
            style={{
              background: "#1E2A24",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "0 14px",
              fontWeight: 800,
            }}
          >
            {show ? "Cacher" : "Voir"}
          </button>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleLogin}
          style={{
            background: "#00FF88",
            color: "#000",
            border: "none",
            borderRadius: 12,
            padding: "16px",
            fontWeight: 900,
            fontSize: 16,
            marginTop: 8,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "CONNEXION..." : "SE CONNECTER"}
        </button>

        <Link
          href="/mot-de-passe-oublie"
          style={{
            textAlign: "right",
            display: "block",
            marginTop: "10px",
            color: "#00E5FF",
            fontSize: 13,
          }}
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <p
        style={{
          textAlign: "center",
          color: "#8A9A8F",
          fontSize: 13,
          marginTop: 18,
        }}
      >
        Pas de compte ?{" "}
        <Link
          href="/register"
          style={{
            color: "#00FF88",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Créer un compte
        </Link>
      </p>
    </main>
  );
            }
              
