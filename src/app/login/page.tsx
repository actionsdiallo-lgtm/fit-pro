import Link from "next/link";
import { LoginForm, SocialButtons } from "@/components/auth-forms";

export default function LoginPage() {
  return <main className="auth-shell"><Link className="brand" href="/">FIT<span>PRO</span></Link><section className="auth-card"><p className="eyebrow">BON RETOUR</p><h1>Connexion</h1><p className="muted">Retrouve tes séances et ta progression enregistrée.</p><SocialButtons /><LoginForm /><p className="muted small">Pas encore de compte ? <Link href="/register">Créer un compte</Link></p></section></main>;
}
