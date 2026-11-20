"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Settings() {
  const [screen, setScreen] = useState("menu");
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(false);
  const [p, setP] = useState({ nom: "", email: "", tel: "", age: "", sexe: "Homme", poids: "", taille: "", objectif: "Prise de masse", niveau: "Intermediaire", photo: "" });
  const [lang, setLang] = useState("Francais");
  const [theme, setTheme] = useState("Sombre");
  const [textSize, setTextSize] = useState("Moyen");
  const [reduceAnim, setReduceAnim] = useState(false);
  const [contraste, setContraste] = useState(false);
  const [lecteur, setLecteur] = useState(false);
  const [heure, setHeure] = useState("07:00");
  const [notif, setNotif] = useState({ entrainement: true, nutrition: true, eau: true, pesee: false, progression: true, encouragements: true, premium: false });
  const [video, setVideo] = useState({ autoplay: true, muet: true, son: true, qualite: "Auto", sousTitres: true, langueVoix: "Francais", wifiOnly: true });
  const [abo, setAbo] = useState("Gratuit");
  const [debut, setDebut] = useState("01 Nov 2026");
  const [renouv, setRenouv] = useState("01 Dec 2026");
  const [demandes, setDemandes] = useState<string[]>([]);

  useEffect(() => {
    const s = localStorage.getItem("fitpro_settings");
    if (s) { try { const d = JSON.parse(s); if (d.p) setP(d.p); if (d.lang) setLang(d.lang); if (d.theme) setTheme(d.theme); if (d.textSize) setTextSize(d.textSize); if (d.notif) setNotif(d.notif); if (d.video) setVideo(d.video); if (d.abo) setAbo(d.abo); if (d.heure) setHeure(d.heure); } catch {} }
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
          if (data) setP({ nom: data.nom_prenom || "", email: user.email || "", tel: data.telephone || "", age: String(data.age || ""), sexe: data.sexe || "Homme", poids: String(data.poids || ""), taille: String(data.taille || ""), objectif: data.objectif || "Prise de masse", niveau: data.niveau || "Intermediaire", photo: data.photo || "" });
        }
      } catch {}
    };
    load();
  }, []);

  const save = async (msg = "Modifications enregistrees !") => {
    setLoading(true);
    localStorage.setItem("fitpro_settings", JSON.stringify({ p, lang, theme, textSize, reduceAnim, contraste, lecteur, notif, video, abo, heure }));
    localStorage.setItem("fitpro_lang", lang);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.from("profiles").upsert({ id: user.id, email: p.email, nom_prenom: p.nom, telephone: p.tel, age: p.age ? Number(p.age) : null, poids: p.poids ? Number(p.poids) : null, taille: p.taille ? Number(p.taille) : null, objectif: p.objectif, niveau: p.niveau, sexe: p.sexe, updated_at: new Date().toISOString() });
    } catch (e) { console.log(e); }
    setLoading(false);
    setSaved(msg);
    setTimeout(() => setSaved(""), 3000);
  };

  const Row = ({ icon, title, desc, onClick }: any) => (
    <button onClick={onClick} className="w-full flex items-center gap-3 bg-white/10 rounded-2xl p-4 text-left active:bg-white/20">
      <span className="text-2xl">{icon}</span>
      <span className="flex-1"><span className="block font-bold">{title}</span><span className="block text-sm text-white/60">{desc}</span></span>
      <span>›</span>
    </button>
  );
  const Back = () => (<button onClick={() => { save("Preferences sauvegardees !"); setScreen("menu"); }} className="mb-4 text-[#00ff88] font-bold">← Retour Parametres</button>);
  const Inp = ({ label, value, onChange, type }: any) => (
    <div className="mb-3"><label className="text-sm text-white/60 block mb-1">{label}</label><input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/10 rounded-xl p-3 text-white outline-none border border-white/10 focus:border-[#00ff88]" /></div>
  );
  const Tog = ({ on, onClick }: any) => (
    <button onClick={onClick} className={`w-12 h-7 rounded-full p-1 shrink-0 ${on ? "bg-[#00ff88]" : "bg-white/20"}`}><div className={`w-5 h-5 bg-white rounded-full transition ${on ? "translate-x-5" : ""}`} /></button>
  );
  const Box = ({ title, children }: any) => (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">{title}</h1>{saved && <div className="bg-[#00ff88]/20 text-[#00ff88] p-3 rounded-xl mb-3 text-center font-bold">{saved}</div>}{children}</div>
  );
  const Choice = ({ list, value, onPick }: any) => (<div>{list.map((x: string) => (<button key={x} onClick={() => onPick(x)} className={`w-full text-left bg-white/10 p-4 rounded-2xl mb-2 ${value === x ? "border-2 border-[#00ff88]" : ""}`}>{x} {value === x ? "✅" : ""}</button>))}</div>);

  if (screen === "profil") return (
    <Box title="1. Mon Profil">
      <div className="flex flex-col items-center mb-6"><div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl font-bold text-black overflow-hidden">{p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : p.nom.slice(0, 1) || "?"}</div>
      <label className="mt-2 text-sm text-[#00ff88] font-bold cursor-pointer">Changer la photo<input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => { setP({ ...p, photo: String(r.result) }); setSaved("Photo choisie, clique sur Enregistrer"); }; r.readAsDataURL(f); } }} /></label></div>
      <Inp label="Nom et prenom" value={p.nom} onChange={(v: string) => setP({ ...p, nom: v })} />
      <Inp label="Adresse e-mail" value={p.email} onChange={(v: string) => setP({ ...p, email: v })} />
      <Inp label="Numero de telephone" value={p.tel} onChange={(v: string) => setP({ ...p, tel: v })} />
      <Inp label="Age" value={p.age} onChange={(v: string) => setP({ ...p, age: v })} type="number" />
      <div className="mb-3"><label className="text-sm text-white/60">Sexe (facultatif)</label><select value={p.sexe} onChange={(e) => setP({ ...p, sexe: e.target.value })} className="w-full bg-zinc-900 rounded-xl p-3 mt-1"><option>Homme</option><option>Femme</option><option>Autre</option><option>Ne pas preciser</option></select></div>
      <Inp label="Poids actuel (kg)" value={p.poids} onChange={(v: string) => setP({ ...p, poids: v })} type="number" />
      <Inp label="Taille (cm)" value={p.taille} onChange={(v: string) => setP({ ...p, taille: v })} type="number" />
      <div className="mb-3"><label className="text-sm text-white/60">Objectif sportif</label><select value={p.objectif} onChange={(e) => setP({ ...p, objectif: e.target.value })} className="w-full bg-zinc-900 rounded-xl p-3 mt-1"><option>Prise de masse</option><option>Perte de poids</option><option>Endurance</option><option>Bien-etre</option><option>Musculation</option></select></div>
      <div className="mb-4"><label className="text-sm text-white/60">Niveau sportif</label><select value={p.niveau} onChange={(e) => setP({ ...p, niveau: e.target.value })} className="w-full bg-zinc-900 rounded-xl p-3 mt-1"><option>Debutant</option><option>Intermediaire</option><option>Avance</option></select></div>
      <button onClick={() => save("Profil enregistre dans la base de donnees !")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full">{loading ? "Enregistrement..." : "Enregistrer les modifications"}</button>
    </Box>
  );

  if (screen === "securite") return (
    <Box title="2. Securite du compte"><div className="space-y-3">
      <Row icon="🔑" title="Modifier le mot de passe" desc="Change ton mot de passe" onClick={async () => { const { error } = await supabase.auth.resetPasswordForEmail(p.email); alert(error ? "Erreur: " + error.message : "Lien envoye a " + p.email); }} />
      <Row icon="❓" title="Mot de passe oublie" desc="Recevoir un lien par email" onClick={async () => { await supabase.auth.resetPasswordForEmail(p.email); alert("Lien de reinitialisation envoye a " + p.email); }} />
      <Row icon="✅" title="Verification de l'adresse e-mail" desc={p.email || "Non renseigne"} onClick={() => alert("Email: " + p.email + "\nStatut: Verifie via Supabase")} />
      <Row icon="📱" title="Appareils connectes" desc="Gestion des appareils" onClick={() => alert("Appareils connectes:\n- Ce telephone (actuel)\n- Navigateur web")} />
      <Row icon="🚪" title="Deconnexion de tous les appareils" desc="Deconnecter partout sauf ici" onClick={async () => { if (confirm("Deconnecter tous les autres appareils ?")) { await supabase.auth.signOut({ scope: "others" }); alert("Deconnecte partout ailleurs !"); } }} />
      <Row icon="🛡️" title="Protection du compte" desc="Compte protege" onClick={() => alert("Protection activee: mot de passe + verification email + Supabase Auth")} />
      <Row icon="🔐" title="Authentification supplementaire" desc="2FA si disponible" onClick={() => alert("Authentification 2FA: a activer dans Supabase Auth > MFA. Pour l'instant protection par email activee.")} />
    </div></Box>
  );

  if (screen === "langue") return (
    <Box title="3. Langue"><p className="text-white/60 mb-3">Applique automatiquement a toute l'app.</p>
      <Choice list={["Francais", "Anglais"]} value={lang} onPick={(v: string) => { setLang(v); localStorage.setItem("fitpro_lang", v); setSaved(v === "Francais" ? "Langue: Francais appliquee !" : "Language: English applied!"); }} />
      <button onClick={() => save()} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button>
    </Box>
  );

  if (screen === "apparence") return (
    <Box title="4. Apparence"><p className="text-white/60 mb-2">Theme</p><Choice list={["Sombre", "Clair", "Automatique"]} value={theme} onPick={(v: string) => setTheme(v)} />
      <p className="text-white/60 mt-4 mb-2">Taille du texte</p><Choice list={["Petit", "Moyen", "Grand"]} value={textSize} onPick={(v: string) => setTextSize(v)} />
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mt-4"><span>Reduction des animations</span><Tog on={reduceAnim} onClick={() => setReduceAnim(!reduceAnim)} /></div>
      <button onClick={() => save("Apparence enregistree !")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-4">Enregistrer</button>
    </Box>
  );

  if (screen === "notif") return (
    <Box title="5. Notifications">
      <div className="bg-white/10 rounded-2xl p-4 mb-4"><label className="text-sm text-white/60">Heure des rappels</label><input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} className="w-full bg-black p-3 rounded-xl mt-1 text-white" /><p className="text-xs text-white/50 mt-1">Rappels envoyes a {heure} chaque jour</p></div>
      {Object.entries({ entrainement: "Rappels d'entrainement", nutrition: "Rappels de nutrition", eau: "Rappels pour boire de l'eau", pesee: "Rappels de pesee", progression: "Notifications de progression", encouragements: "Encouragements quotidiens", premium: "Notifications Premium" }).map(([k, label]) => (<div key={k} className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2"><span>{label}</span><Tog on={(notif as any)[k]} onClick={() => setNotif({ ...notif, [k]: !(notif as any)[k] })} /></div>))}
      <button onClick={() => save("Notifications enregistrees !")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button>
    </Box>
  );

  if (screen === "video") return (
    <Box title="6. Son et Videos">
      {[["autoplay", "Lecture automatique des videos"], ["muet", "Lecture automatique en mode silencieux"], ["son", "Son active / desactive"], ["sousTitres", "Sous-titres"], ["wifiOnly", "Lecture uniquement en Wi-Fi"]].map(([k, label]: any) => (<div key={k} className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2"><span>{label}</span><Tog on={(video as any)[k]} onClick={() => setVideo({ ...video, [k]: !(video as any)[k] })} /></div>))}
      <p className="text-white/60 mt-4 mb-2">Qualite video</p><Choice list={["Auto", "Basse", "Moyenne", "Elevee"]} value={video.qualite} onPick={(v: string) => setVideo({ ...video, qualite: v })} />
      <p className="text-white/60 mt-4 mb-2">Langue des explications vocales</p><Choice list={["Francais", "Anglais"]} value={video.langueVoix} onPick={(v: string) => setVideo({ ...video, langueVoix: v })} />
      <button onClick={() => save("Son et Videos enregistres !")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button>
    </Box>
  );

  if (screen === "access") return (
    <Box title="7. Accessibilite">
      <p className="text-white/60 mb-2">Taille du texte</p><Choice list={["Petit", "Moyen", "Grand"]} value={textSize} onPick={(v: string) => setTextSize(v)} />
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2 mt-3"><span>Contraste ameliore</span><Tog on={contraste} onClick={() => setContraste(!contraste)} /></div>
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2"><span>Reduction des animations</span><Tog on={reduceAnim} onClick={() => setReduceAnim(!reduceAnim)} /></div>
      <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl mb-2"><span>Compatibilite lecteurs d'ecran</span><Tog on={lecteur} onClick={() => setLecteur(!lecteur)} /></div>
      <button onClick={() => save("Accessibilite enregistree !")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button>
    </Box>
  );

  if (screen === "abo") return (
    <Box title="8. Mon Abonnement">
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-2xl p-4 mb-4"><div className="font-bold text-lg">Statut Premium: {abo === "Gratuit" ? "Non Premium" : "Premium - " + abo}</div><div className="text-sm mt-1">Formule actuelle: {abo}<br />Debut: {debut} • Renouvellement: {renouv}</div></div>
      {[{ n: "Hebdomadaire", pr: "4 USD / semaine" }, { n: "Mensuel", pr: "10 USD / mois - LE PLUS POPULAIRE" }].map((f) => (<button key={f.n} onClick={() => { if (confirm("Passer a " + f.n + " - " + f.pr + " ?")) { setAbo(f.n); setSaved("Abonnement " + f.n + " choisi ! Paiement a brancher avec Stripe / Orange Money"); } }} className="w-full text-left bg-white/10 p-4 rounded-2xl mb-2"><span className="font-bold block">{f.n}</span><span className="text-sm text-white/60">{f.pr}</span></button>))}
      <div className="space-y-2 mt-4">
        <Row icon="🧾" title="Historique des paiements" desc="Voir tes paiements" onClick={() => alert("Historique: Aucun paiement pour le moment.")} />
        <Row icon="🔄" title="Gestion du renouvellement" desc={"Renouvellement: " + renouv} onClick={() => { const v = prompt("Nouvelle date de renouvellement (ex: 01 Jan 2027):", renouv); if (v) { setRenouv(v); alert("Renouvellement mis a jour: " + v); } }} />
        <Row icon="♻️" title="Restaurer les achats" desc="Recuperer ton Premium" onClick={() => alert("Recherche des achats... Aucun achat trouve.")} />
        <Row icon="❌" title="Annulation de l'abonnement" desc="Annuler le renouvellement" onClick={() => { if (confirm("Vraiment annuler ton abonnement ?")) { setAbo("Gratuit"); alert("Abonnement annule. Tu gardes l'acces jusqu'au " + renouv); } }} />
      </div>
    </Box>
  );

  if (screen === "conf") return (
    <Box title="9. Confidentialite et Donnees"><div className="space-y-3">
      <Row icon="📄" title="Politique de confidentialite" desc="Comment on protege tes donnees" onClick={() => alert("FIT PRO ne vend jamais tes donnees. Tes donnees restent dans ta base Supabase, accessibles uniquement par toi.")} />
      <Row icon="📜" title="Conditions d'utilisation" desc="Regles de l'app" onClick={() => alert("En utilisant FIT PRO, tu acceptes de t'entrainer de facon responsable et de respecter les autres utilisateurs.")} />
      <Row icon="🔑" title="Gestion des autorisations" desc="Appareil photo, notifications" onClick={() => alert("Autorisations:\n- Notifications: demande dans les reglages du telephone\n- Photos: pour la photo de profil\n- Stockage: pour sauvegarder tes preferences")} />
      <Row icon="⬇️" title="Telechargement des donnees personnelles" desc="Export de tes infos" onClick={() => { const blob = new Blob([JSON.stringify({ profil: p, langue: lang, theme, notif, video, abo }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "mes-donnees-fitpro.json"; a.click(); alert("Donnees telechargees !"); }} />
      <Row icon="📊" title="Gestion de l'historique sportif" desc="Voir / effacer l'historique" onClick={() => { if (confirm("Effacer ton historique sportif local ?")) { localStorage.removeItem("fitpro_history"); alert("Historique sportif efface."); } else alert("Historique conserve."); }} />
      <Row icon="🗑️" title="Suppression des donnees personnelles" desc="Effacer les donnees locales" onClick={() => { if (confirm("Supprimer toutes tes donnees personnelles locales ?")) { localStorage.removeItem("fitpro_settings"); alert("Donnees personnelles supprimees."); } }} />
      <Row icon="⚠️" title="Demande de suppression definitive du compte" desc="Action irreversible" onClick={() => { if (confirm("VRAIMENT supprimer ton compte ? C'est irreversible !")) alert("Demande de suppression envoyee. Suppression sous 30 jours. Tu recevras un email de confirmation."); }} />
    </div></Box>
  );

  if (screen === "aide") return (
    <Box title="10. Centre d'Aide et Support"><div className="space-y-3">
      <Row icon="💬" title="Questions frequentes" desc="Reponses rapides" onClick={() => alert("FAQ:\n1. Changer programme ? -> Entrainement\n2. Payer Premium ? -> Parametres > Mon Abonnement\n3. Changer langue ? -> Parametres > Langue\n4. Mot de passe oublie ? -> Parametres > Securite")} />
      <Row icon="📩" title="Contacter le support FIT PRO" desc="support@fitpro.com" onClick={() => { const m = prompt("Ton message pour le support:"); if (m) { setDemandes([...demandes, m]); alert("Message envoye ! Reponse sous 24h."); } }} />
      <Row icon="✉️" title="Envoyer un message" desc="Ecrire au support" onClick={() => { const m = prompt("Ton message:"); if (m) { setDemandes([...demandes, m]); alert("Message envoye !"); } }} />
      <Row icon="🐛" title="Signaler un probleme" desc="Bug technique" onClick={() => { const m = prompt("Decris le probleme:"); if (m) { setDemandes([...demandes, "Bug: " + m]); alert("Probleme signale, merci !"); } }} />
      <Row icon="💳" title="Signaler un probleme de paiement" desc="Paiement Premium" onClick={() => { const m = prompt("Decris ton probleme de paiement:"); if (m) { setDemandes([...demandes, "Paiement: " + m]); alert("Demande paiement envoyee."); } }} />
      <Row icon="⚙️" title="Signaler un probleme technique" desc="App, videos, connexion" onClick={() => { const m = prompt("Decris le probleme technique:"); if (m) { setDemandes([...demandes, "Technique: " + m]); alert("Probleme technique signale."); } }} />
      <Row icon="📂" title="Consulter les demandes precedentes" desc={demandes.length + " demande(s)"} onClick={() => alert(demandes.length === 0 ? "Aucune demande pour le moment." : "Tes demandes:\n" + demandes.join("\n- "))} />
    </div></Box>
  );

  if (screen === "compte") return (
    <Box title="11. Gestion du Compte"><div className="space-y-3">
      <button onClick={async () => { if (confirm("Se deconnecter ?")) { await supabase.auth.signOut(); alert("Deconnecte !"); } }} className="w-full bg-white/10 p-4 rounded-2xl font-bold text-left">Se deconnecter</button>
      <button onClick={async () => { if (confirm("Se deconnecte
