import Link from "next/link";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const [profile, workouts, goals] = await Promise.all([
    db.athleteProfile.findUnique({ where: { userId: session.user.id } }),
    db.workout.findMany({ where: { userId: session.user.id }, orderBy: { performedAt: "desc" }, take: 8 }),
    db.goal.findMany({ where: { userId: session.user.id, completedAt: null }, orderBy: { createdAt: "desc" }, take: 5 })
  ]);
  const totalMinutes = workouts.reduce((sum, workout) => sum + workout.durationMinutes, 0);
  const calories = workouts.reduce((sum, workout) => sum + (workout.calories ?? 0), 0);
  return <main className="dashboard"><header className="dash-header"><Link className="brand" href="/">FIT<span>PRO</span></Link><form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}><button className="text-link">Déconnexion</button></form></header>
    <section className="dash-intro"><p className="eyebrow">ESPACE PERSONNEL</p><h1>Bonjour{session.user.name ? `, ${session.user.name}` : ""}.</h1><p className="muted">Tes indicateurs sont calculés uniquement à partir des séances que tu enregistres.</p></section>
    <section className="stats-grid"><article className="stat"><span>Séances affichées</span><strong>{workouts.length}</strong><small>8 plus récentes</small></article><article className="stat"><span>Durée enregistrée</span><strong>{totalMinutes}<small> min</small></strong><small>sur les séances affichées</small></article><article className="stat"><span>Calories déclarées</span><strong>{calories}</strong><small>valeurs saisies uniquement</small></article></section>
    <div className="dash-columns"><section className="panel"><div className="panel-title"><div><p className="eyebrow">HISTORIQUE</p><h2>Entraînements récents</h2></div><Link className="text-link" href="/workouts/new">+ Ajouter</Link></div>{workouts.length ? <ul className="workout-list">{workouts.map((workout) => <li key={workout.id}><div><strong>{workout.title}</strong><span>{workout.category} · {new Date(workout.performedAt).toLocaleDateString("fr-FR")}</span></div><b>{workout.durationMinutes} min</b></li>)}</ul> : <p className="empty">Aucune séance enregistrée. Ajoute ton premier entraînement pour commencer ton historique.</p>}</section>
    <aside className="panel"><p className="eyebrow">TON PROFIL</p><h2>Profil sportif</h2><p>{profile?.discipline || "Discipline à renseigner"}</p><p className="muted">{profile?.age ? `${profile.age} ans` : "Âge non renseigné"} · {profile?.heightCm ? `${profile.heightCm} cm` : "Taille non renseignée"} · {profile?.weightKg ? `${profile.weightKg} kg` : "Poids non renseigné"}</p><h3>Objectifs en cours</h3>{goals.length ? goals.map((goal) => <p key={goal.id}>{goal.title} — {goal.current}/{goal.target} {goal.metric}</p>) : <p className="empty">Aucun objectif enregistré.</p>}<Link className="text-link" href="/workouts/new">Enregistrer une séance →</Link></aside></div>
  </main>;
}
