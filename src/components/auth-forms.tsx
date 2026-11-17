"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(form: FormData) {
    setBusy(true); setError("");
    const result = await signIn("credentials", { email: form.get("email"), password: form.get("password"), redirect: false, redirectTo: "/dashboard" });
    setBusy(false);
    if (result?.error) setError("Adresse e-mail ou mot de passe incorrect.");
    else window.location.assign(result?.url || "/dashboard");
  }
  return <form action={submit} className="form">
    <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    <label>Mot de passe<input name="password" type="password" autoComplete="current-password" required /></label>
    {error && <p className="error" role="alert">{error}</p>}
    <button className="button full" disabled={busy}>{busy ? "Connexion…" : "Se connecter"}</button>
    <p className="muted small">Mot de passe oublié ? La procédure de réinitialisation par e-mail nécessite encore un fournisseur d’envoi configuré.</p>
  </form>;
}

export function SocialButtons() {
  const google = Boolean(process.env.NEXT_PUBLIC_GOOGLE_LOGIN);
  const facebook = Boolean(process.env.NEXT_PUBLIC_FACEBOOK_LOGIN);
  return <div className="socials">
    {google && <button className="button button-quiet full" type="button" onClick={() => signIn("google", { redirectTo: "/dashboard" })}>Continuer avec Google</button>}
    {facebook && <button className="button button-quiet full" type="button" onClick={() => signIn("facebook", { redirectTo: "/dashboard" })}>Continuer avec Facebook</button>}
  </div>;
}
