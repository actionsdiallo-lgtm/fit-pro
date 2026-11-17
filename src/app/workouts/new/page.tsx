import Link from "next/link";
import { saveWorkout } from "./actions";

export default async function NewWorkout({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <main className="auth-shell"><Link className="brand" href="/dashboard">FIT<span>PRO</span></Link><section className="auth-card"><p className="eyebrow">SUIVI PERSONNEL</p><h1>Enregistrer une séance</h1><p className="muted">Les champs facultatifs resteront vides si tu ne disposes pas de la mesure.</p>{error && <p className="error">Vérifie les valeurs saisies.</p>}
    <form action={saveWorkout} className="form"><label>Nom de la séance<input name="title" required minLength={2} maxLength={100} placeholder="Ex. Course en endurance" /></label><label>Catégorie<input name="category" required minLength={2} maxLength={40} placeholder="Ex. Cardio, Musculation" /></label><label>Durée (minutes)<input name="durationMinutes" type="number" min="1" max="1440" required /></label><label>Distance (km), facultatif<input name="distanceKm" type="number" min="0.01" max="1000" step="0.01" /></label><label>Calories mesurées, facultatif<input name="calories" type="number" min="1" max="10000" /></label><label>Notes<textarea name="notes" maxLength={1000} rows={3} /></label><button className="button full">Enregistrer la séance</button></form></section></main>;
}
