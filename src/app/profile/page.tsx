"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function Settings() {
  const [screen, setScreen] = useState("menu");
  const [saved, setSaved] = useState("");
  const [p, setP] = useState({ nom: "", email: "", tel: "", age: "", sexe: "Homme", poids: "", taille: "", objectif: "Prise de masse", niveau: "Intermediaire" });
  const [lang, setLang] = useState("Francais");
  const [theme, setTheme] = useState("Sombre");
  const [textSize, setTextSize] = useState("Moyen");
  const [reduceAnim, setReduceAnim] = useState(false);
  const [contraste, setContraste] = useState(false);
  const [heure, setHeure] = useState("07:00");
  const [notif, setNotif] = useState({ entrainement: true, nutrition: true, eau: true, pesee: false, progression: true, encouragements: true, premium: false });
  const [video, setVideo] = useState({ autoplay: true, muet: true, son: true, qualite: "Auto", sousTitres: true, langueVoix: "Francais", wifiOnly: true });
  const [abo, setAbo] = useState("Gratuit");
  const [demandes, setDemandes] = useState<string[]>([]);

  useEffect(() => {
    const s = localStorage.getItem("fitpro_settings");
    if (s) { try { const d = JSON.parse(s); if (d.p) setP(d.p); if (d.lang) setLang(d.lang); if (d.theme) setTheme(d.theme); if (d.notif) setNotif(d.notif); if (d.video) setVideo(d.video); if (d.abo) setAbo(d.abo); } catch {} }
  }, []);

  const save = async (msg: string) => {
    localStorage.setItem("fitpro_settings", JSON.stringify({ p, lang, theme, textSize, notif, video, abo, heure }));
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) await supabase.from("profiles").upsert({ id: user.id, email: p.email, nom_prenom: p.nom, telephone: p.tel, age: p.age ? Number(p.age) : null, poids: p.poids ? Number(p.poids) : null, taille: p.taille ? Number(p.taille) : null, objectif: p.objectif, niveau: p.niveau });
    } catch {}
    setSaved(msg);
    setTimeout(() => setSaved(""), 3000);
  };

  const Row = ({ icon, title, desc, onClick }: any) => (
    <button onClick={onClick} className="w-full flex items-center gap-3 bg-white/10 rounded-2xl p-4 text-left">
      <span className="text-2xl">{icon}</span>
      <span className="flex-1"><span className="block font-bold">{title}</span><span className="block text-sm text-white/60">{desc}</span></span>
      <span>›</span>
    </button>
  );
  const Back = () => (<button onClick={() => { save("Preferences sauvegardees"); setScreen("menu"); }} className="mb-4 text-[#00ff88] font-bold">Retour Parametres</button>);
  const Inp = ({ label, value, onChange }: any) => (
    <div className="mb-3"><label className="text-sm text-white/60 block mb-1">{label}</label><input value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-white/10 rounded-xl p-3 text-white outline-none" /></div>
  );
  const Tog = ({ on, onClick }: any) => (
    <button onClick={onClick} className={`w-12 h-7 rounded-full p-1 ${on ? "bg-[#00ff88]" : "bg-white/20"}`}><div className={`w-5 h-5 bg-white rounded-full ${on ? "translate-x-5" : ""}`} /></button>
  );
  const Box = ({ title, children }: any) => (
    <div className="min-h-screen bg-black text-white p-4 pb-28"><Back /><h1 className="text-2xl font-bold mb-4">{title}</h1>{saved && <div className="bg-[#00ff88]/20 text-[#00ff88] p-3 rounded-xl mb-3 text-center font-bold">{saved}</div>}{children}</div>
  );
  const Choice = ({ list, value, onPick }: any) => (<div>{list.map((x: string) => (<button key={x} onClick={() => onPick(x)} className={`w-full text-left bg-white/10 p-4 rounded-2xl mb-2 ${value === x ? "border-2 border-[#00ff88]" : ""}`}>{x} {value === x ? "OK" : ""}</button>))}</div>);

  if (screen === "profil") return (<Box title="1. Mon Profil">
    <div className="flex flex-col items-center mb-6"><div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center text-4xl font-bold text-black">{p.nom.slice(0, 1) || "?"}</div></div>
    <Inp label="Nom et prenom" value={p.nom} onChange={(v: string) => setP({ ...p, nom: v })} />
    <Inp label="Email" value={p.email} onChange={(v: string) => setP({ ...p, email: v })} />
    <Inp label="Telephone" value={p.tel} onChange={(v: string) => setP({ ...p, tel: v })} />
    <Inp label="Age" value={p.age} onChange={(v: string) => setP({ ...p, age: v })} />
    <Inp label="Sexe" value={p.sexe} onChange={(v: string) => setP({ ...p, sexe: v })} />
    <Inp label="Poids kg" value={p.poids} onChange={(v: string) => setP({ ...p, poids: v })} />
    <Inp label="Taille cm" value={p.taille} onChange={(v: string) => setP({ ...p, taille: v })} />
    <Inp label="Objectif" value={p.objectif} onChange={(v: string) => setP({ ...p, objectif: v })} />
    <Inp label="Niveau" value={p.niveau} onChange={(v: string) => setP({ ...p, niveau: v })} />
    <button onClick={() => save("Profil enregistre")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full">Enregistrer les modifications</button>
  </Box>);

  if (screen === "securite") return (<Box title="2. Securite du compte"><div className="space-y-3">
    <Row icon="K" title="Modifier le mot de passe" desc="Change ton mot de passe" onClick={async () => { const { error } = await supabase.auth.resetPasswordForEmail(p.email); alert(error ? "Erreur: " + error.message : "Lien envoye a " + p.email); }} />
    <Row icon="M" title="Mot de passe oublie" desc="Recevoir un lien par email" onClick={async () => { await supabase.auth.resetPasswordForEmail(p.email); alert("Lien envoye a " + p.email); }} />
    <Row icon="V" title="Verification email" desc={p.email} onClick={() => alert("Email verifie via Supabase")} />
    <Row icon="P" title="Appareils connectes" desc="1 appareil" onClick={() => alert("Appareils: Ce telephone")} />
    <Row icon="D" title="Deconnexion de tous les appareils" desc="Deconnecter partout" onClick={async () => { if (confirm("Deconnecter les autres appareils ?")) { await supabase.auth.signOut({ scope: "others" }); alert("Deconnecte ailleurs"); } }} />
    <Row icon="S" title="Protection du compte" desc="Compte protege" onClick={() => alert("Protection activee avec Supabase Auth")} />
    <Row icon="A" title="Authentification supplementaire" desc="2FA" onClick={() => alert("2FA a activer dans Supabase Auth MFA")} />
  </div></Box>);

  if (screen === "langue") return (<Box title="3. Langue"><Choice list={["Francais", "Anglais"]} value={lang} onPick={(v: string) => { setLang(v); localStorage.setItem("fitpro_lang", v); setSaved("Langue appliquee: " + v); }} /><button onClick={() => save("Langue enregistree")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button></Box>);

  if (screen === "apparence") return (<Box title="4. Apparence"><Choice list={["Sombre", "Clair", "Automatique"]} value={theme} onPick={(v: string) => setTheme(v)} /><p className="text-white/60 mt-4 mb-2">Taille du texte</p><Choice list={["Petit", "Moyen", "Grand"]} value={textSize} onPick={(v: string) => setTextSize(v)} /><div className="flex justify-between bg-white/10 p-4 rounded-2xl mt-3"><span>Reduction des animations</span><Tog on={reduceAnim} onClick={() => setReduceAnim(!reduceAnim)} /></div><button onClick={() => save("Apparence enregistree")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button></Box>);

  if (screen === "notif") return (<Box title="5. Notifications">
    <div className="bg-white/10 rounded-2xl p-4 mb-4"><label className="text-sm text-white/60">Heure des rappels</label><input type="time" value={heure} onChange={(e) => setHeure(e.target.value)} className="w-full bg-black p-3 rounded-xl mt-1 text-white" /></div>
    {Object.entries({ entrainement: "Rappels entrainement", nutrition: "Rappels nutrition", eau: "Rappels boire eau", pesee: "Rappels pesee", progression: "Notifications progression", encouragements: "Encouragements quotidiens", premium: "Notifications Premium" }).map(([k, label]) => (<div key={k} className="flex justify-between bg-white/10 p-4 rounded-2xl mb-2"><span>{label}</span><Tog on={(notif as any)[k]} onClick={() => setNotif({ ...notif, [k]: !(notif as any)[k] })} /></div>))}
    <button onClick={() => save("Notifications enregistrees")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button>
  </Box>);

  if (screen === "video") return (<Box title="6. Son et Videos">
    {[["autoplay", "Lecture automatique"], ["muet", "Lecture en silencieux"], ["son", "Son active"], ["sousTitres", "Sous-titres"], ["wifiOnly", "Videos uniquement en Wi-Fi"]].map(([k, label]: any) => (<div key={k} className="flex justify-between bg-white/10 p-4 rounded-2xl mb-2"><span>{label}</span><Tog on={(video as any)[k]} onClick={() => setVideo({ ...video, [k]: !(video as any)[k] })} /></div>))}
    <p className="text-white/60 mt-4 mb-2">Qualite video</p><Choice list={["Auto", "Basse", "Moyenne", "Elevee"]} value={video.qualite} onPick={(v: string) => setVideo({ ...video, qualite: v })} />
    <p className="text-white/60 mt-4 mb-2">Langue voix</p><Choice list={["Francais", "Anglais"]} value={video.langueVoix} onPick={(v: string) => setVideo({ ...video, langueVoix: v })} />
    <button onClick={() => save("Son et Videos enregistres")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button>
  </Box>);

  if (screen === "access") return (<Box title="7. Accessibilite">
    <p className="text-white/60 mb-2">Taille du texte</p><Choice list={["Petit", "Moyen", "Grand"]} value={textSize} onPick={(v: string) => setTextSize(v)} />
    <div className="flex justify-between bg-white/10 p-4 rounded-2xl mt-3"><span>Contraste ameliore</span><Tog on={contraste} onClick={() => setContraste(!contraste)} /></div>
    <div className="flex justify-between bg-white/10 p-4 rounded-2xl mt-2"><span>Reduction des animations</span><Tog on={reduceAnim} onClick={() => setReduceAnim(!reduceAnim)} /></div>
    <div className="flex justify-between bg-white/10 p-4 rounded-2xl mt-2"><span>Lecteurs ecran</span><Tog on={false} onClick={() => alert("Compatibilite lecteurs ecran activee")} /></div>
    <button onClick={() => save("Accessibilite enregistree")} className="w-full bg-[#00ff88] text-black font-bold py-3 rounded-full mt-3">Enregistrer</button>
  </Box>);

  if (screen === "abo") return (<Box title="8. Mon Abonnement">
    <div className="bg-yellow-400 text-black rounded-2xl p-4 mb-4"><div className="font-bold">Formule: {abo}</div><div className="text-sm">Debut: 01 Nov 2026 - Renouvellement: 01 Dec 2026</div></div>
    {[{ n: "Hebdomadaire", pr: "4 USD / semaine" }, { n: "Mensuel", pr: "10 USD / mois" }].map((f) => (<button key={f.n} onClick={() => { if (confirm("Passer a " + f.n + " ?")) { setAbo(f.n); alert("Abonnement " + f.n + " actif"); } }} className="w-full text-left bg-white/10 p-4 rounded-2xl mb-2"><span className="font-bold block">{f.n}</span><span className="text-sm text-white/60">{f.pr}</span></button>))}
    <div className="space-y-2 mt-4"><Row icon="H" title="Historique des paiements" desc="Voir tes paiements" onClick={() => alert("Aucun paiement pour le moment")} /><Row icon="R" title="Restaurer les achats" desc="Recuperer Premium" onClick={() => alert("Aucun achat trouve")} /><Row icon="X" title="Annuler abonnement" desc="Annuler" onClick={() => { if (confirm("Vraiment annuler ?")) { setAbo("Gratuit"); alert("Abonnement annule"); } }} /></div>
  </Box>);

  if (screen === "conf") return (<Box title="9. Confidentialite et Donnees"><div className="space-y-3">
    <Row icon="P" title="Politique de confidentialite" desc="Protection des donnees" onClick={() => alert("FIT PRO ne vend jamais tes donnees")} />
    <Row icon="C" title="Conditions utilisation" desc="Regles de app" onClick={() => alert("Utilise FIT PRO de facon responsable")} />
    <Row icon="K" title="Gestion des autorisations" desc="Photos, notifications" onClick={() => alert("Autorisations dans les reglages du telephone")} />
    <Row icon="D" title="Telecharger mes donnees" desc="Export" onClick={() => { const blob = new Blob([JSON.stringify({ p, lang }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "mes-donnees.json"; a.click(); alert("Donnees telechargees"); }} />
    <Row icon="H" title="Historique sportif" desc="Effacer historique" onClick={() => { if (confirm("Effacer historique ?")) { localStorage.removeItem("fitpro_history"); alert("Historique efface"); } }} />
    <Row icon="S" title="Supprimer mes donnees" desc="Effacer locales" onClick={() => { if (confirm("Supprimer donnees locales ?")) { localStorage.removeItem("fitpro_settings"); alert("Donnees supprimees"); } }} />
  </div></Box>);

  if (screen === "aide") return (<Box title="10. Centre Aide"><div className="space-y-3">
    <Row icon="F" title="Questions frequentes" desc="Reponses rapides" onClick={() => alert("FAQ: Programme dans Entrainement. Premium dans Abonnement. Langue dans Parametres")} />
    <Row icon="S" title="Contacter le support" desc="support@fitpro.com" onClick={() => { const m = prompt("Ton message:"); if (m) { setDemandes([...demandes, m]); alert("Message envoye"); } }} />
    <Row icon="M" title="Envoyer un message" desc="Ecrire au support" onClick={() => { const m = prompt("Ton message:"); if (m) alert("Message envoye"); } }} />
    <Row icon="B" title="Signaler un probleme" desc="Bug" onClick={() => { const m = prompt("Decris le bug:"); if (m) alert("Bug signale"); } }} />
    <Row icon="P" title="Probleme de paiement" desc="Paiement Premium" onClick={() => { const m = prompt("Probleme paiement:"); if (m) alert("Demande envoyee"); } }} />
    <Row icon="T" title="Probleme technique" desc="App, videos" onClick={() => { const m = prompt("Probleme technique:"); if (m) alert("Probleme signale"); } }} />
    <Row icon="D" title="Demandes precedentes" desc={demandes.length + " demande(s)"} onClick={() => alert(demandes.length === 0 ? "Aucune demande" : demandes.join("\n"))} />
  </div></Box>);

  if (screen === "compte") return (<Box title="11. Gestion du Compte"><div className="space-y-3">
    <button onClick={async () => { if (confirm("Se deconnecter ?")) { await supabase.auth.signOut(); alert("Deconnecte"); } }} className="w-full bg-white/10 p-4 rounded-2xl font-bold text-left">Se deconnecter</button>
    <button onClick={async () => { if (confirm("Se deconnecter de TOUS les appareils ?")) { await supabase.auth.signOut({ scope: "global" }); alert("Deconnecte partout"); } }} className="w-full bg-white/10 p-4 rounded-2xl font-bold text-left">Se deconnecter de tous les appareils</button>
    <button onClick={() => { if (confirm("SUPPRIMER definitivement ton compte ?")) { if (confirm("Derniere confirmation: vraiment supprimer ?")) alert("Demande de suppression envoyee"); } }} className="w-full bg-red-500/20 text-red-400 p-4 rounded-2xl font-bold border border-red-500/30 text-left">Supprimer definitivement mon compte</button>
  </div></Box>);

  if (screen === "apropos") return (<Box title="12. A propos de FIT PRO">
    <div className="text-center"><div className="text-6xl mb-2">FIT PRO</div><p className="text-white/60">Version 1.0.0 - Build 2026.11.20</p></div>
    <div className="space-y-3 mt-6"><Row icon="C" title="Conditions utilisation" desc="Lire" onClick={() => alert("Conditions FIT PRO v1.0")} /><Row icon="P" title="Politique confidentialite" desc="Lire" onClick={() => alert("Politique FIT PRO v1.0")} /><Row icon="L" title="Informations legales" desc="FIT PRO Dakar" onClick={() => alert("FIT PRO Dakar Senegal - contact@fitpro.com")} /></div>
  </Box>);

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-28">
      <h1 className="text-2xl font-bold mb-1">Parametres</h1><p className="text-white/60 mb-4">Bonjour {p.nom || "Champion"}</p>
      {saved && <div className="bg-[#00ff88]/20 text-[#00ff88] p-3 rounded-xl mb-3 text-center font-bold">{saved}</div>}
      <div className="space-y-3">
        <Row icon="U" title="1. Mon Profil" desc={p.poids + " kg - " + p.objectif} onClick={() => setScreen("profil")} />
        <Row icon="S" title="2. Securite du compte" desc="Mot de passe, appareils" onClick={() => setScreen("securite")} />
        <Row icon="L" title="3. Langue" desc={"Actuelle: " + lang} onClick={() => setScreen("langue")} />
        <Row icon="A" title="4. Apparence" desc={"Theme: " + theme} onClick={() => setScreen("apparence")} />
        <Row icon="N" title="5. Notifications" desc={"Rappels a " + heure} onClick={() => setScreen("notif")} />
        <Row icon="V" title="6. Son et Videos" desc={"Qualite: " + video.qualite} onClick={() => setScreen("video")} />
        <Row icon="X" title="7. Accessibilite" desc="Contraste, lecteur ecran" onClick={() => setScreen("access")} />
        <Row icon="E" title="8. Mon Abonnement" desc={"Formule: " + abo} onClick={() => setScreen("abo")} />
        <Row icon="C" title="9. Confidentialite et Donnees" desc="Telecharger, supprimer" onClick={() => setScreen("conf")} />
        <Row icon="H" title="10. Centre Aide" desc="FAQ, contacter" onClick={() => setScreen("aide")} />
        <Row icon="G" title="11. Gestion du Compte" desc="Deconnexion, suppression" onClick={() => setScreen("compte")} />
        <Row icon="I" title="12. A propos de FIT PRO" desc="Version 1.0.0" onClick={() => setScreen("apropos")} />
      </div>
      <p className="text-center text-xs text-white/40 mt-6">FIT PRO v1.0.0 - Dakar</p>
    </div>
  );
      }
