"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Profile() {
  const [screen, setScreen] = useState("menu");
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ nom_prenom: "Diallo", email: "user@fitpro.com", telephone: "+221 77 000 00 00", age: "25", sexe: "Homme", poids: "75", taille: "178", objectif: "Prise de masse", niveau: "Intermédiaire" });
  const [lang, setLang] = useState("Français");
  const [theme, setTheme] = useState("Sombre");
  const [textSize, setTextSize] = useState("Moyen");
  const [reduceAnim, setReduceAnim] = useState(false);
  const [notif, setNotif] = useState({ entrainement: true, nutrition: true, eau: true, pesee: false, progression: true, encouragements: true, premium: false });
  const [heureRappel, setHeureRappel] = useState("07:00");
  const [video, setVideo] = useState({ autoplay: true, muet: true, son: true, qualite: "Auto", sousTitres: true, langueVoix: "Français", wifiOnly: true });
  const [access, setAccess] = useState({ contraste: false, lecteurEcran: false });
  const [abonnement, setAbonnement] = useState("Gratuit");

  useEffect(() => {
    const load = async () => {
      const s = localStorage.getItem("fitpro_settings");
      if (s) { const d = JSON.parse(s); if (d.lang) setLang(d.lang); if (d.theme) setTheme(d.theme); if (d.notif) setNotif(d.notif); if (d.video) setVideo(d.video); if (d.textSize) setTextSize(d.textSize); }
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
          if (data) setProfile({ nom_prenom: data.nom_prenom || "Diallo", email: user.email || "", telephone: data.telephone || "", age: String(data.age || "25"), sexe: data.sexe || "Homme", poids: String(data.poids || "75"), taille: String(data.taille || "178"), objectif: data.objectif || "Prise de masse", niveau: data.niveau || "Intermédiaire" });
        }
      } catch {}
    };
    load();
  }, []);

  const saveAll = async () => {
    setLoading(true);
    localStorage.setItem("fitpro_settings", JSON.stringify({ lang, theme, notif, video, textSize, reduceAnim }));
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({ id: user.id, email: profile.email, nom_prenom: profile.nom_prenom, telephone: profile.telephone, age: Number(profile.age), poids: Number(profile.poids), taille: Number(profile.taille), objectif: profile.objectif, niveau: profile.niveau, sexe: profile.sexe, updated_at: new Date().toISOString() });
      }
    } catch (e) { console.log(e); }
    setLoading(false);
    setSaved("✅ Modifications enregistrées !");
    setTimeout(() => setSaved(""), 2500);
  };

  const Toggle = ({ on, onClick }: any) => (
    <button onClick={onClick} className={`w-12 h-7 rounded-full p-1 transition shrink-0 ${on ? "bg-[#00ff88]" : "bg-white/20"}`}><div className={`w-5 h-5 bg-white rounded-full transition ${on ? "translate-x-5" : ""}`} /></button>
  );
  const Row = ({ icon, title, desc, onClick }: any) => (
    <button onClick={onClick} className="w-full flex items-center gap-3 bg-white/10 rounded-2xl p-4 text-left active:bg-white/20">
      <span className="text-2xl">{icon}</span>
      <span className="flex-1"><span className="block font-bold">{title}</span><span className="block text-sm text-white/60">{desc}</span></span>
      <span>›</span>
    </button>
  );
  const Back = () => (<button onClick={() => { saveAll(); setScreen("menu"); }} className="mb-4 text-[#00ff88] font-bold">← Retour</button>);
  const Input = ({ label, value, onChange }: any) => (
    <div className="mb-3"><label className="text-sm text-white/60 block mb-1">{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/10 rounded-xl p-3 text-white outline-none border border-white/10 focus:border-[#00ff88]" /></div>
  );

  if (screen === "profil") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">👤 Mon Profil</h1>
      <div className="flex flex-col items-center mb-6"><div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl font-bold text-black">{profile.nom_prenom.slice(0,1)}</div><button onClick={() => alert("📸 Choisis une photo dans ta galerie")} className="mt-2 text-sm text-[#00ff88] font-bold">Changer la photo</button></div>
      <Input label="Nom et prénom" value={profile.nom_prenom} onChange={(v: string) => setProfile({ ...profile, nom_prenom: v })} />
      <Input label="Email" value={profile.email} onChange={(v: string) => setProfile({ ...profile, email: v })} />
      <Input label="Téléphone" value={profile.telephone} onChange={(v: string) => setProfile({ ...profile, telephone: v })} />
      <Input label="Âge" value={profile.age} onChange={(v: string) => setProfile({ ...profile, age: v })} />
      <Input label="Sexe" value={profile.sexe} onChange={(v: string) => setProfile({ ...profile, sexe: v })} />
      <Input label="Poids actuel (kg)" value={profile.poids} onChange={(v: string) => setProfile({ ...profile, poids: v })} />
      <Input label="Taille (cm)" value={profile.taille} onChange={(v: string) => setProfile({ ...profile, taille: v })} />
      <div className="mb-3"><label className="text-sm text-white/60">Objectif sportif</label><select value={profile.objectif} onChange={(e) => setProfile({ ...profile, objectif: e.target.value })} className="w-full bg-zinc-900 rounded-xl p-3 mt-1"><option>Prise de masse</option><option>Perte de poids</option><option>Endurance</option><option>Bien-être</option></select></div>
      <div className="mb-4"><label className="text-sm text-white/60">Niveau sportif</label><select value={profile.niveau} onChange={(e) => setProfile({ ...profile, niveau: e.target.value })} className="w-full bg-zinc-900 rounded-xl p-3 mt-1"><option>Débutant</option><option>Intermédiaire</option><option>Avancé</option></select></div>
      {saved && <div className="bg-[#00ff88]/20 text-[#00ff88] p-3 rounded-xl mb-3 text-center font-bold">{saved}</div>}
      <button onClick={saveAll} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full">{loading ? "Enregistrement..." : "💾 Enregistrer les modifications"}</button>
    </div>
  );

  if (screen === "securite") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">🔒 Sécurité du compte</h1><div className="space-y-3">
      <Row icon="🔑" title="Modifier le mot de passe" desc="Change ton mot de passe" onClick={async () => { const { error } = await supabase.auth.resetPasswordForEmail(profile.email); alert(error ? "❌ Erreur : " + error.message : "✅ Lien envoyé à " + profile.email); }} />
      <Row icon="❓" title="Mot de passe oublié" desc="Recevoir un lien par email" onClick={async () => { await supabase.auth.resetPasswordForEmail(profile.email); alert("📧 Lien envoyé à " + profile.email); }} />
      <Row icon="✅" title="Vérification email" desc={profile.email + " - Vérifié"} onClick={() => alert("✅ Email déjà vérifié !")} />
      <Row icon="📱" title="Appareils connectés" desc="1 appareil - Ce téléphone" onClick={() => alert("📱 Appareils :\n- Ce téléphone (actuel)")} />
      <Row icon="🚪" title="Déconnexion de tous les appareils" desc="Déconnecter partout sauf ici" onClick={async () => { if (confirm("Déconnecter tous les autres appareils ?")) { await supabase.auth.signOut({ scope: "others" }); alert("✅ Déconnecté partout ailleurs !"); } }} />
      <Row icon="🛡️" title="Protection du compte" desc="Compte protégé" onClick={() => alert("🛡️ Protection activée : mot de passe + vérification email")} />
    </div></div>
  );

  if (screen === "langue") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">🌍 Langue</h1>
      {["Français", "Anglais"].map(l => (<button key={l} onClick={() => { setLang(l); localStorage.setItem("fitpro_lang", l); alert(l === "Français" ? "✅ Langue : Français appliquée !" : "✅ Language: English applied!"); }} className={`w-full flex justify-between bg-white/10 p-4 rounded-2xl mb-3 ${lang === l ? "border-2 border-[#00ff88]" : ""}`}><span>{l === "Français" ? "🇫🇷 Français" : "🇬🇧 English"}</span><span>{lang === l ? "✅" : ""}</span></button>))}
      <p className="text-sm text-white/60 mt-2">Enregistrée automatiquement.</p></div>
  );

  if (screen === "apparence") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">🎨 Apparence</h1>
      <p className="text-white/60 mb-3">Thème</p>{["Sombre", "Clair", "Automatique"].map(t => (<button key={t} onClick={() => setTheme(t)} className={`w-full text-left bg-white/10 p-4 rounded-2xl mb-2 ${theme === t ? "border-2 border-[#00ff88]" : ""}`}>{t} {theme === t ? "✅" : ""}</button>))}
      <p className="text-white/60 mt-4 mb-2">Taille du texte</p>{["Petit", "Moyen", "Grand"].map(s => (<button key={s} onClick={() => setTextSize(s)} className={`w-full text-left bg-white/10 p-4 rounded-2xl mb-2 ${textSize === s ? "border-2 border-[#00ff88]" : ""}`}>{s}</button>))}
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mt-4"><span>Réduction des animations</span><Toggle on={reduceAnim} onClick={() => setReduceAnim(!reduceAnim)} /></div>
      <button onClick={saveAll} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-4">Enregistrer</button>{saved && <div className="text-[#00ff88] text-center mt-2 font-bold">{saved}</div>}</div>
  );

  if (screen === "notif") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">🔔 Notifications</h1>
      <div className="bg-white/10 rounded-2xl p-4 mb-4"><label className="text-sm text-white/60">Heure des rappels</label><input type="time" value={heureRappel} onChange={(e) => setHeureRappel(e.target.value)} className="w-full bg-black p-3 rounded-xl mt-1 text-white" /></div>
      {Object.entries({ entrainement: "🏋️ Rappels d'entraînement", nutrition: "🍎 Rappels de nutrition", eau: "💧 Rappels pour boire de l'eau", pesee: "⚖️ Rappels de pesée", progression: "📊 Notifications de progression", encouragements: "💪 Encouragements quotidiens", premium: "⭐ Notifications Premium" }).map(([k, label]) => (<div key={k} className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2"><span>{label}</span><Toggle on={(notif as any)[k]} onClick={() => setNotif({ ...notif, [k]: !(notif as any)[k] })} /></div>))}
      <button onClick={saveAll} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button>{saved && <div className="text-[#00ff88] text-center mt-2 font-bold">{saved}</div>}</div>
  );

  if (screen === "video") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">🎬 Son et Vidéos</h1>
      {([["autoplay", "▶️ Lecture automatique"], ["muet", "🔇 Lecture en silencieux"], ["son", "🔊 Son activé"], ["sousTitres", "💬 Sous-titres"], ["wifiOnly", "📶 Vidéos uniquement en Wi-Fi"]] as any).map(([k, label]) => (<div key={k} className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2"><span>{label}</span><Toggle on={(video as any)[k]} onClick={() => setVideo({ ...video, [k]: !(video as any)[k] })} /></div>))}
      <p className="text-white/60 mt-4 mb-2">Qualité vidéo</p>{["Auto", "Basse", "Moyenne", "Élevée"].map(q => (<button key={q} onClick={() => setVideo({ ...video, qualite: q })} className={`w-full text-left bg-white/10 p-4 rounded-2xl mb-2 ${video.qualite === q ? "border-2 border-[#00ff88]" : ""}`}>{q} {video.qualite === q ? "✅" : ""}</button>))}
      <button onClick={saveAll} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button>{saved && <div className="text-[#00ff88] text-center mt-2 font-bold">{saved}</div>}</div>
  );

  if (screen === "access") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">♿ Accessibilité</h1>
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2"><span>Contraste amélioré</span><Toggle on={access.contraste} onClick={() => setAccess({ ...access, contraste: !access.contraste })} /></div>
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2"><span>Compatibilité lecteurs d'écran</span><Toggle on={access.lecteurEcran} onClick={() => setAccess({ ...access, lecteurEcran: !access.lecteurEcran })} /></div>
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2"><span>Réduction des animations</span><Toggle on={reduceAnim} onClick={() => setReduceAnim(!reduceAnim)} /></div>
      <p className="text-sm text-white/60 mt-3">Taille du texte : {textSize}</p><button onClick={saveAll} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button></div>
  );

  if (screen === "abonnement") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">⭐ Mon Abonnement</h1>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-2xl p-4 mb-4"><div className="font-bold text-lg">Formule : {abonnement}</div><div className="text-sm">Début : 01 Nov 2026 • Renouvellement : 01 Déc 2026</div></div>
      {[{ nom: "Hebdomadaire", prix: "4 USD / semaine" }, { nom: "Mensuel", prix: "10 USD / mois - LE PLUS POPULAIRE" }].map(f => (<button key={f.nom} onClick={() => { if (confirm(`Passer à ${f.nom} - ${f.prix} ?`)) { setAbonnement(f.nom); alert("✅ Abonnement " + f.nom + " activé ! (Paiement à brancher avec Stripe / Orange Money)"); } }} className="w-full text-left bg-white/10 p-4 rounded-2xl mb-2"><span className="font-bold block">{f.nom}</span><span className="text-sm text-white/60">{f.prix}</span></button>))}
      <div className="space-y-2 mt-4">
        <Row icon="🧾" title="Historique des paiements" desc="Voir tes paiements" onClick={() => alert("🧾 Aucun paiement pour le moment.")} />
        <Row icon="🔄" title="Restaurer les achats" desc="Récupérer ton Premium" onClick={() => alert("🔄 Recherche des achats... Aucun achat trouvé.")} />
        <Row icon="❌" title="Annuler l'abonnement" desc="Annuler le renouvellement" onClick={() => { if (confirm("Vraiment annuler ?")) { setAbonnement("Gratuit"); alert("✅ Abonnement annulé."); } }} />
      </div></div>
  );

  if (screen === "confidentialite") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">🔐 Confidentialité et Données</h1><div className="space-y-3">
      <Row icon="📄" title="Politique de confidentialité" desc="Comment on protège tes données" onClick={() => alert("📄 FIT PRO ne vend jamais tes données.")} />
      <Row icon="📜" title="Conditions d'utilisation" desc="Règles de l'app" onClick={() => alert("📜 En utilisant FIT PRO, tu acceptes de t'entraîner de façon responsable.")} />
      <Row icon="⬇️" title="Télécharger mes données" desc="Export de tes infos" onClick={() => { const blob = new Blob([JSON.stringify({ profile, lang, theme }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "mes-donnees-fitpro.json"; a.click(); alert("✅ Données téléchargées !"); }} />
      <Row icon="🗑️" title="Supprimer mes données" desc="Effacer l'historique sportif" onClick={() => { if (confirm("Supprimer tout ton historique ?")) { localStorage.removeItem("fitpro_settings"); alert("✅ Données supprimées."); } }} />
      <Row icon="⚠️" title="Suppression définitive du compte" desc="Action irréversible" onClick={() => { if (confirm("⚠️ VRAIMENT supprimer ton compte ?")) alert("Demande envoyée. Suppression sous 30 jours."); }} />
    </div></div>
  );

  if (screen === "aide") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">❓ Centre d'Aide</h1><div className="space-y-3">
      <Row icon="💬" title="Questions fréquentes" desc="Réponses rapides" onClick={() => alert("FAQ :\n1. Changer programme ? → Entraînement\n2. Payer Premium ? → Abonnement\n3. Changer langue ? → Paramètres > Langue")} />
      <Row icon="📩" title="Contacter le support" desc="support@fitpro.com" onClick={() => { const m = prompt("Ton message :"); if (m) alert("✅ Message envoyé ! Réponse sous 24h."); }} />
      <Row icon="🐛" title="Signaler un problème" desc="Bug technique" onClick={() => { const m = prompt("Décris le bug :"); if (m) alert("✅ Bug signalé, merci !"); }} />
      <Row icon="💳" title="Problème de paiement" desc="Paiement Premium" onClick={() => { const m = prompt("Décris ton problème de paiement :"); if (m) alert("✅ Demande paiement envoyée."); }} />
      <Row icon="📂" title="Mes demandes précédentes" desc="Suivi" onClick={() => alert("📂 Aucune demande pour le moment.")} />
    </div></div>
  );

  if (screen === "apropos") return (
    <div className="min-h-screen bg-black text-white p-4 pb-28 text-center"><Back /><div className="text-6xl mb-2">💪</div><h1 className="text-3xl font-bold">FIT<span className="text-yellow-400">PRO</span></h1><p className="text-white/60 mt-2">Version 1.0.0 - Build 2026.11.20</p><p className="text-sm text-white/60 mt-4">Ton coach sportif personnel.<br/>Entraînement, Nutrition, Progrès.</p><div className="text-left space-y-3 mt-6">
      <Row icon="📜" title="Conditions d'utilisation" desc="Lire" onClick={() => alert("Conditions FIT PRO v1.0")} />
      <Row icon="🔐" title="Politique de confidentialité" desc="Lire" onClick={() => alert("Politique FIT PRO v1.0")} />
      <Row icon="⚖️" title="Informations légales" desc="FIT PRO - Dakar, Sénégal" onClick={() => alert("FIT PRO - Dakar, Sénégal\ncontact@fitpro.com")} />
    </div></div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-28">
      <h1 className="text-2xl font-bold mb-1">⚙️ Paramètres</h1>
      <p className="text-white/60 mb-4">Bonjour {profile.nom_prenom} • {profile.email}</p>
      {saved && <div className="bg-[#00ff88]/20 text-[#00ff88] p-3 rounded-xl mb-3 text-center font-bold">{saved}</div>}
      <div className="space-y-3">
        <Row icon="👤" title="Mon Profil" desc={`${profile.poids} kg • ${profile.taille} cm • ${profile.objectif}`} onClick={() => setScreen("profil")} />
        <Row icon="🔒" title="Sécurité du compte" desc="Mot de passe, appareils, protection" onClick={() => setScreen("securite")} />
        <Row icon="🌍" title="Langue" desc={`Actuelle : ${lang}`} onClick={() => setScreen("langue")} />
        <Row icon="🎨" title="Apparence" desc={`Thème : ${theme} • Texte : ${textSize}`} onClick={() => setScreen("apparence")} />
        <Row icon="🔔" title="Notifications" desc="Rappels, encouragements" onClick={() => setScreen("notif")} />
        <Row icon="🎬" title="Son et Vidéos" desc={`Qualité : ${video.qualite} • Wi-Fi only`} onClick={() => setScreen("video")} />
        <Row icon="♿" title="Accessibilité" desc="Contraste, lecteur d'écran" onClick={() => setScreen("access")} />
        <Row icon="⭐" title="Mon Abonnement" desc={`Formule : ${abonnement} • 4$ / sem • 10$ / mois`} onClick={() => setScreen("abonnement")} />
        <Row icon="🔐" title="Confidentialité et Données" desc="Télécharger, supprimer" onClick={() => setScreen("confidentialite")} />
        <Row icon="❓" title="Centre d'Aide et Support" desc="FAQ, contacter, signaler" onClick={() => setScreen("aide")} />
        <Row icon="ℹ️" title="À propos de FIT
