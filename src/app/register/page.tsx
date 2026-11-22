"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

const GOALS = ["Prise de masse", "Perte de poids", "Forme"] as const;

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState<string>("Prise de masse");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const input = {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "1px solid #333",
    backgroundColor: "#1A1A1A",
    color: "white",
    marginBottom: 12,
    fontSize: 15,
    boxSizing: "border-box" as const,
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setErrorMessage("Remplis nom, email et mot de passe.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Mot de passe : 6 caractères minimum.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
          goal,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(
          typeof data?.error === "string" && data.error.trim()
            ? data.error
            : "Impossible de créer le compte. Vérifie tes informations et réessaie."
        );
        return;
      }

      const login = await signIn("credentials", {
        email: cleanEmail,
        password,
        redirect: false,
      });

      if (login?.error) {
        router.push("/login");
        router.refresh();
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Erreur réseau lors de la création du compte.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      style={{
        padding: 20,
        backgroundColor: "#0A0F0A",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: 28 }}>Créer un compte 💪</h1>
      <p style={{ color: "#AAA" }}>Rejoins FitPro</p>

      {errorMessage && (
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            backgroundColor: "#3B1111",
            border: "1px solid #991B1B",
            color: "#FECACA",
            marginBottom: 14,
            fontSize: 14,
          }}
        >
          {errorMessage}
        </div>
      )}

      <input
        style={input}
        placeholder="Ton nom - ex: Diallo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        style={input}
        type="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        style={input}
        type="password"
        autoComplete="new-password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <p style={{ fontWeight: "bold" }}>Ton objectif :</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {GOALS.map((g) => (
          <button
            type="button"
            key={g}
            onClick={() => setGoal(g)}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 12,
              border: "none",
              backgroundColor: goal === g ? "#00FF88" : "#333",
              color: goal === g ? "black" : "white",
              fontWeight: "bold",
            }}
          >
            {g}
          </button>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: 15,
          borderRadius: 12,
          border: "none",
          backgroundColor: "#00FF88",
          color: "black",
          fontWeight: "bold",
          fontSize: 16,
          opacity: loading ? 0.65 : 1,
        }}
      >
        {loading ? "Inscription en cours..." : "S'inscrire"}
      </button>

      <p style={{ textAlign: "center", marginTop: 16 }}>
        Déjà un compte ?{" "}
        <Link href="/login" style={{ color: "#00FF88" }}>
          Se connecter
        </Link>
      </p>
    </form>
  );
      }
    
