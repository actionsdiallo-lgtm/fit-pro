import Link from "next/link";
import { register } from "./actions";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="auth-shell"><Link className="brand" href="/">FIT<span>PRO</span></Link><section className="auth-card"><p className="eyebrow">TON PARCOURS COMMENCE ICI</p><h1>Créer un compte</h1><p className="muted">Un compte pour retrouver tes données sur tes appareils.</p>
    {error === "exists" && <p className="error" role="alert">Cette adresse possède déjà un compte. Connecte-toi.</p>}
    {error === "invalid" && <p className="error" role="alert">Vérifie les champs. Le mot de passe doit contenir au moins 12 caractères, une majuscule, une minuscule et un chiffre.</p>}
    <form action={register} className="form"><label>Nom affiché<input name="name" autoComplete="name" minLength={2} maxLength={80} required /></label><label>Adresse e-mail<input name="email" type="email" autoComplete="email" maxLength={254} required /></label><label>Mot de passe<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={72} required /><span className="hint">12 caractères minimum, majuscule, minuscule et chiffre.</span></label><button className="button full">Créer mon compte</button></form>
    <p className="muted small">Déjà inscrit ? <Link href="/login">Se connecter</Link></p></section></main>;
}
