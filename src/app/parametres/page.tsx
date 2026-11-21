"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { playClick, playSuccess } from "../../lib/sound";

type LangCode = "fr" | "en" | "es" | "pt" | "ar" | "de" | "it";

const LANG_LABELS: Record<LangCode, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  pt: "Português",
  ar: "العربية",
  de: "Deutsch",
  it: "Italiano",
};

const LANG_ORDER: LangCode[] = ["fr", "en", "es", "pt", "ar", "de", "it"];

function resolveLang(raw?: string | null): LangCode {
  if (!raw) return "fr";
  const v = raw.trim().toLowerCase();
  if (v === "fr" || v.startsWith("fran")) return "fr";
  if (v === "en" || v.startsWith("eng")) return "en";
  if (v === "es" || v.startsWith("esp")) return "es";
  if (v === "pt" || v.startsWith("port")) return "pt";
  if (v === "ar" || raw.includes("العربية") || v.startsWith("arab")) return "ar";
  if (v === "de" || v.startsWith("deut") || v.startsWith("all")) return "de";
  if (v === "it" || v.startsWith("ital")) return "it";
  return "fr";
}

const I18N: Record<
  LangCode,
  {
    loading: string;
    title: string;
    saved: string;
    langUpdated: (label: string) => string;
    qualityUpdated: (label: string) => string;
    avatarUpdated: string;
    cloudSaved: string;
    cloudRestored: string;
    ticketSent: string;
    syncing: string;
    errorPrefix: string;
    uploadPrefix: string;
    defaultMember: string;
    appSettings: string;
    language: string;
    theme: string;
    themeDark: string;
    autoplay: string;
    autoplayDesc: string;
    quality: string;
    qualityHigh: string;
    qualityMed: string;
    qualityLow: string;
    notifications: string;
    notificationsDesc: string;
    sound: string;
    soundDesc: string;
    powerSaver: string;
    powerSaverDesc: string;
    privacySection: string;
    backup: string;
    backupDesc: string;
    restore: string;
    restoreDesc: string;
    deleteAccount: string;
    deleteAccountDesc: string;
    privacyPolicy: string;
    privacyPolicyDesc: string;
    terms: string;
    termsDesc: string;
    supportSection: string;
    helpCenter: string;
    helpCenterDesc: string;
    contactSupport: string;
    contactSupportDesc: string;
    about: string;
    aboutDesc: string;
    signOut: string;
    modalTitle: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    cancel: string;
    send: string;
    navHome: string;
    navWorkout: string;
    navProgress: string;
    navPremium: string;
    navSettings: string;
  }
> = {
  fr: {
    loading: "Chargement...",
    title: "Paramètres",
    saved: "Paramètres enregistrés",
    langUpdated: (l) => `Langue : ${l}`,
    qualityUpdated: (q) => `Qualité vidéo : ${q}`,
    avatarUpdated: "Photo de profil mise à jour",
    cloudSaved: "Sauvegarde cloud synchronisée",
    cloudRestored: "Données cloud restaurées",
    ticketSent: "Message envoyé au support FIT PRO",
    syncing: "Synchronisation...",
    errorPrefix: "Erreur",
    uploadPrefix: "Upload",
    defaultMember: "Membre FIT PRO",
    appSettings: "Paramètres de l'application",
    language: "Langue",
    theme: "Thème",
    themeDark: "Sombre (Mode Nuit)",
    autoplay: "Lecture automatique des vidéos",
    autoplayDesc: "Wi-Fi et données mobiles",
    quality: "Qualité vidéo",
    qualityHigh: "Haute qualité",
    qualityMed: "Moyenne (1080p)",
    qualityLow: "Économie (720p)",
    notifications: "Notifications",
    notificationsDesc: "Gérer vos notifications",
    sound: "Sons et vibrations",
    soundDesc: "Activer les sons",
    powerSaver: "Mode économie d'énergie",
    powerSaverDesc: "Réduire la consommation",
    privacySection: "Données et confidentialité",
    backup: "Sauvegarde des données",
    backupDesc: "Sauvegarder sur le cloud",
    restore: "Restaurer mes données",
    restoreDesc: "Récupérer mes données",
    deleteAccount: "Supprimer mon compte",
    deleteAccountDesc: "Supprimer définitivement mon compte",
    privacyPolicy: "Politique de confidentialité",
    privacyPolicyDesc: "Lire notre politique",
    terms: "Conditions d'utilisation",
    termsDesc: "Lire les conditions",
    supportSection: "Aide et support",
    helpCenter: "Centre d'aide",
    helpCenterDesc: "Questions fréquentes et guides",
    contactSupport: "Contacter le support",
    contactSupportDesc: "Nous écrire",
    about: "À propos de FIT PRO",
    aboutDesc: "Version 1.0.0 • Mis à jour le 21/11/2026",
    signOut: "Se déconnecter",
    modalTitle: "Contacter le support FIT PRO",
    subjectPlaceholder: "Sujet",
    messagePlaceholder: "Votre message...",
    cancel: "Annuler",
    send: "Envoyer",
    navHome: "Accueil",
    navWorkout: "Entraînement",
    navProgress: "Progrès",
    navPremium: "Premium",
    navSettings: "Paramètres",
  },
  en: {
    loading: "Loading...",
    title: "Settings",
    saved: "Settings saved",
    langUpdated: (l) => `Language: ${l}`,
    qualityUpdated: (q) => `Video quality: ${q}`,
    avatarUpdated: "Profile photo updated",
    cloudSaved: "Cloud backup synced",
    cloudRestored: "Cloud data restored",
    ticketSent: "Message sent to FIT PRO support",
    syncing: "Syncing...",
    errorPrefix: "Error",
    uploadPrefix: "Upload",
    defaultMember: "FIT PRO Member",
    appSettings: "App settings",
    language: "Language",
    theme: "Theme",
    themeDark: "Dark (Night Mode)",
    autoplay: "Autoplay videos",
    autoplayDesc: "Wi-Fi and mobile data",
    quality: "Video quality",
    qualityHigh: "High quality",
    qualityMed: "Medium (1080p)",
    qualityLow: "Data saver (720p)",
    notifications: "Notifications",
    notificationsDesc: "Manage your notifications",
    sound: "Sound and haptics",
    soundDesc: "Enable sounds",
    powerSaver: "Power saving mode",
    powerSaverDesc: "Reduce battery usage",
    privacySection: "Data and privacy",
    backup: "Backup data",
    backupDesc: "Save to the cloud",
    restore: "Restore my data",
    restoreDesc: "Recover my data",
    deleteAccount: "Delete my account",
    deleteAccountDesc: "Permanently delete my account",
    privacyPolicy: "Privacy policy",
    privacyPolicyDesc: "Read our policy",
    terms: "Terms of use",
    termsDesc: "Read the terms",
    supportSection: "Help and support",
    helpCenter: "Help center",
    helpCenterDesc: "FAQs and guides",
    contactSupport: "Contact support",
    contactSupportDesc: "Write to us",
    about: "About FIT PRO",
    aboutDesc: "Version 1.0.0 • Updated 21/11/2026",
    signOut: "Sign out",
    modalTitle: "Contact FIT PRO support",
    subjectPlaceholder: "Subject",
    messagePlaceholder: "Your message...",
    cancel: "Cancel",
    send: "Send",
    navHome: "Home",
    navWorkout: "Workout",
    navProgress: "Progress",
    navPremium: "Premium",
    navSettings: "Settings",
  },
  es: {
    loading: "Cargando...",
    title: "Ajustes",
    saved: "Ajustes guardados",
    langUpdated: (l) => `Idioma: ${l}`,
    qualityUpdated: (q) => `Calidad de video: ${q}`,
    avatarUpdated: "Foto de perfil actualizada",
    cloudSaved: "Respaldo en la nube sincronizado",
    cloudRestored: "Datos de la nube restaurados",
    ticketSent: "Mensaje enviado al soporte de FIT PRO",
    syncing: "Sincronizando...",
    errorPrefix: "Error",
    uploadPrefix: "Subida",
    defaultMember: "Miembro FIT PRO",
    appSettings: "Ajustes de la aplicación",
    language: "Idioma",
    theme: "Tema",
    themeDark: "Oscuro (Modo Noche)",
    autoplay: "Reproducción automática de videos",
    autoplayDesc: "Wi-Fi y datos móviles",
    quality: "Calidad de video",
    qualityHigh: "Alta calidad",
    qualityMed: "Media (1080p)",
    qualityLow: "Ahorro (720p)",
    notifications: "Notificaciones",
    notificationsDesc: "Gestionar notificaciones",
    sound: "Sonidos y vibración",
    soundDesc: "Activar sonidos",
    powerSaver: "Modo ahorro de energía",
    powerSaverDesc: "Reducir el consumo",
    privacySection: "Datos y privacidad",
    backup: "Copia de seguridad",
    backupDesc: "Guardar en la nube",
    restore: "Restaurar mis datos",
    restoreDesc: "Recuperar mis datos",
    deleteAccount: "Eliminar mi cuenta",
    deleteAccountDesc: "Eliminar permanentemente mi cuenta",
    privacyPolicy: "Política de privacidad",
    privacyPolicyDesc: "Leer nuestra política",
    terms: "Términos de uso",
    termsDesc: "Leer los términos",
    supportSection: "Ayuda y soporte",
    helpCenter: "Centro de ayuda",
    helpCenterDesc: "Preguntas frecuentes y guías",
    contactSupport: "Contactar soporte",
    contactSupportDesc: "Escríbenos",
    about: "Acerca de FIT PRO",
    aboutDesc: "Versión 1.0.0 • Actualizado el 21/11/2026",
    signOut: "Cerrar sesión",
    modalTitle: "Contactar soporte de FIT PRO",
    subjectPlaceholder: "Asunto",
    messagePlaceholder: "Tu mensaje...",
    cancel: "Cancelar",
    send: "Enviar",
    navHome: "Inicio",
    navWorkout: "Entreno",
    navProgress: "Progreso",
    navPremium: "Premium",
    navSettings: "Ajustes",
  },
  pt: {
    loading: "Carregando...",
    title: "Configurações",
    saved: "Configurações salvas",
    langUpdated: (l) => `Idioma: ${l}`,
    qualityUpdated: (q) => `Qualidade do vídeo: ${q}`,
    avatarUpdated: "Foto de perfil atualizada",
    cloudSaved: "Backup na nuvem sincronizado",
    cloudRestored: "Dados da nuvem restaurados",
    ticketSent: "Mensagem enviada ao suporte FIT PRO",
    syncing: "Sincronizando...",
    errorPrefix: "Erro",
    uploadPrefix: "Envio",
    defaultMember: "Membro FIT PRO",
    appSettings: "Configurações do app",
    language: "Idioma",
    theme: "Tema",
    themeDark: "Escuro (Modo Noturno)",
    autoplay: "Reprodução automática de vídeos",
    autoplayDesc: "Wi-Fi e dados móveis",
    quality: "Qualidade do vídeo",
    qualityHigh: "Alta qualidade",
    qualityMed: "Média (1080p)",
    qualityLow: "Economia (720p)",
    notifications: "Notificações",
    notificationsDesc: "Gerenciar notificações",
    sound: "Sons e vibrações",
    soundDesc: "Ativar sons",
    powerSaver: "Modo economia de energia",
    powerSaverDesc: "Reduzir o consumo",
    privacySection: "Dados e privacidade",
    backup: "Backup de dados",
    backupDesc: "Salvar na nuvem",
    restore: "Restaurar meus dados",
    restoreDesc: "Recuperar meus dados",
    deleteAccount: "Excluir minha conta",
    deleteAccountDesc: "Excluir permanentemente minha conta",
    privacyPolicy: "Política de privacidade",
    privacyPolicyDesc: "Ler nossa política",
    terms: "Termos de uso",
    termsDesc: "Ler os termos",
    supportSection: "Ajuda e suporte",
    helpCenter: "Central de ajuda",
    helpCenterDesc: "Perguntas frequentes e guias",
    contactSupport: "Falar com o suporte",
    contactSupportDesc: "Escreva para nós",
    about: "Sobre o FIT PRO",
    aboutDesc: "Versão 1.0.0 • Atualizado em 21/11/2026",
    signOut: "Sair",
    modalTitle: "Falar com o suporte FIT PRO",
    subjectPlaceholder: "Assunto",
    messagePlaceholder: "Sua mensagem...",
    cancel: "Cancelar",
    send: "Enviar",
    navHome: "Início",
    navWorkout: "Treino",
    navProgress: "Progresso",
    navPremium: "Premium",
    navSettings: "Ajustes",
  },
  ar: {
    loading: "جارٍ التحميل...",
    title: "الإعدادات",
    saved: "تم حفظ الإعدادات",
    langUpdated: (l) => `اللغة: ${l}`,
    qualityUpdated: (q) => `جودة الفيديو: ${q}`,
    avatarUpdated: "تم تحديث صورة الملف الشخصي",
    cloudSaved: "تمت مزامنة النسخ الاحتياطي السحابي",
    cloudRestored: "تمت استعادة البيانات السحابية",
    ticketSent: "تم إرسال الرسالة إلى دعم FIT PRO",
    syncing: "جارٍ المزامنة...",
    errorPrefix: "خطأ",
    uploadPrefix: "رفع",
    defaultMember: "عضو FIT PRO",
    appSettings: "إعدادات التطبيق",
    language: "اللغة",
    theme: "المظهر",
    themeDark: "داكن (الوضع الليلي)",
    autoplay: "تشغيل الفيديو تلقائيًا",
    autoplayDesc: "واي فاي وبيانات الهاتف",
    quality: "جودة الفيديو",
    qualityHigh: "جودة عالية",
    qualityMed: "متوسطة (1080p)",
    qualityLow: "توفير البيانات (720p)",
    notifications: "الإشعارات",
    notificationsDesc: "إدارة الإشعارات",
    sound: "الأصوات والاهتزاز",
    soundDesc: "تفعيل الأصوات",
    powerSaver: "وضع توفير الطاقة",
    powerSaverDesc: "تقليل الاستهلاك",
    privacySection: "البيانات والخصوصية",
    backup: "نسخ البيانات احتياطيًا",
    backupDesc: "حفظ في السحابة",
    restore: "استعادة بياناتي",
    restoreDesc: "استرجاع بياناتي",
    deleteAccount: "حذف حسابي",
    deleteAccountDesc: "حذف حسابي نهائيًا",
    privacyPolicy: "سياسة الخصوصية",
    privacyPolicyDesc: "اقرأ سياستنا",
    terms: "شروط الاستخدام",
    termsDesc: "اقرأ الشروط",
    supportSection: "المساعدة والدعم",
    helpCenter: "مركز المساعدة",
    helpCenterDesc: "الأسئلة الشائعة والأدلة",
    contactSupport: "تواصل مع الدعم",
    contactSupportDesc: "راسلنا",
    about: "حول FIT PRO",
    aboutDesc: "الإصدار 1.0.0 • حُدّث في 21/11/2026",
    signOut: "تسجيل الخروج",
    modalTitle: "تواصل مع دعم FIT PRO",
    subjectPlaceholder: "الموضوع",
    messagePlaceholder: "رسالتك...",
    cancel: "إلغاء",
    send: "إرسال",
    navHome: "الرئيسية",
    navWorkout: "التمرين",
    navProgress: "التقدم",
    navPremium: "بريميوم",
    navSettings: "الإعدادات",
  },
  de: {
    loading: "Laden...",
    title: "Einstellungen",
    saved: "Einstellungen gespeichert",
    langUpdated: (l) => `Sprache: ${l}`,
    qualityUpdated: (q) => `Videoqualität: ${q}`,
    avatarUpdated: "Profilbild aktualisiert",
    cloudSaved: "Cloud-Backup synchronisiert",
    cloudRestored: "Cloud-Daten wiederhergestellt",
    ticketSent: "Nachricht an den FIT PRO Support gesendet",
    syncing: "Synchronisiere...",
    errorPrefix: "Fehler",
    uploadPrefix: "Upload",
    defaultMember: "FIT PRO Mitglied",
    appSettings: "App-Einstellungen",
    language: "Sprache",
    theme: "Design",
    themeDark: "Dunkel (Nachtmodus)",
    autoplay: "Videos automatisch abspielen",
    autoplayDesc: "WLAN und mobile Daten",
    quality: "Videoqualität",
    qualityHigh: "Hohe Qualität",
    qualityMed: "Mittel (1080p)",
    qualityLow: "Datensparmodus (720p)",
    notifications: "Benachrichtigungen",
    notificationsDesc: "Benachrichtigungen verwalten",
    sound: "Ton und Vibration",
    soundDesc: "Töne aktivieren",
    powerSaver: "Energiesparmodus",
    powerSaverDesc: "Verbrauch reduzieren",
    privacySection: "Daten und Datenschutz",
    backup: "Datensicherung",
    backupDesc: "In der Cloud speichern",
    restore: "Meine Daten wiederherstellen",
    restoreDesc: "Daten abrufen",
    deleteAccount: "Konto löschen",
    deleteAccountDesc: "Mein Konto dauerhaft löschen",
    privacyPolicy: "Datenschutzerklärung",
    privacyPolicyDesc: "Richtlinie lesen",
    terms: "Nutzungsbedingungen",
    termsDesc: "Bedingungen lesen",
    supportSection: "Hilfe und Support",
    helpCenter: "Hilfecenter",
    helpCenterDesc: "Häufige Fragen und Anleitungen",
    contactSupport: "Support kontaktieren",
    contactSupportDesc: "Schreibe uns",
    about: "Über FIT PRO",
    aboutDesc: "Version 1.0.0 • Aktualisiert am 21.11.2026",
    signOut: "Abmelden",
    modalTitle: "FIT PRO Support kontaktieren",
    subjectPlaceholder: "Betreff",
    messagePlaceholder: "Deine Nachricht...",
    cancel: "Abbrechen",
    send: "Senden",
    navHome: "Start",
    navWorkout: "Training",
    navProgress: "Fortschritt",
    navPremium: "Premium",
    navSettings: "Einstellungen",
  },
  it: {
    loading: "Caricamento...",
    title: "Impostazioni",
    saved: "Impostazioni salvate",
    langUpdated: (l) => `Lingua: ${l}`,
    qualityUpdated: (q) => `Qualità video: ${q}`,
    avatarUpdated: "Foto profilo aggiornata",
    cloudSaved: "Backup cloud sincronizzato",
    cloudRestored: "Dati cloud ripristinati",
    ticketSent: "Messaggio inviato al supporto FIT PRO",
    syncing: "Sincronizzazione...",
    errorPrefix: "Errore",
    uploadPrefix: "Caricamento",
    defaultMember: "Membro FIT PRO",
    appSettings: "Impostazioni dell'app",
    language: "Lingua",
    theme: "Tema",
    themeDark: "Scuro (Modalità Notte)",
    autoplay: "Riproduzione automatica video",
    autoplayDesc: "Wi-Fi e dati mobili",
    quality: "Qualità video",
    qualityHigh: "Alta qualità",
    qualityMed: "Media (1080p)",
    qualityLow: "Risparmio (720p)",
    notifications: "Notifiche",
    notificationsDesc: "Gestisci notifiche",
    sound: "Suoni e vibrazioni",
    soundDesc: "Attiva suoni",
    powerSaver: "Risparmio energetico",
    powerSaverDesc: "Riduci il consumo",
    privacySection: "Dati e privacy",
    backup: "Backup dati",
    backupDesc: "Salva sul cloud",
    restore: "Ripristina i miei dati",
    restoreDesc: "Recupera i miei dati",
    deleteAccount: "Elimina il mio account",
    deleteAccountDesc: "Elimina definitivamente il mio account",
    privacyPolicy: "Informativa sulla privacy",
    privacyPolicyDesc: "Leggi la nostra politica",
    terms: "Condizioni d'uso",
    termsDesc: "Leggi le condizioni",
    supportSection: "Aiuto e supporto",
    helpCenter: "Centro assistenza",
    helpCenterDesc: "Domande frequenti e guide",
    contactSupport: "Contatta il supporto",
    contactSupportDesc: "Scrivici",
    about: "Informazioni su FIT PRO",
    aboutDesc: "Versione 1.0.0 • Aggiornato il 21/11/2026",
    signOut: "Esci",
    modalTitle: "Contatta il supporto FIT PRO",
    subjectPlaceholder: "Oggetto",
    messagePlaceholder: "Il tuo messaggio...",
    cancel: "Annulla",
    send: "Invia",
    navHome: "Home",
    navWorkout: "Allenamento",
    navProgress: "Progressi",
    navPremium: "Premium",
    navSettings: "Impostazioni",
  },
};

type S = {
  display_name: string;
  avatar_url: string;
  lang: LangCode;
  dark_mode: boolean;
  autoplay_videos: boolean;
  video_quality: string;
  notifications_enabled: boolean;
  sound_enabled: boolean;
  power_saver: boolean;
};

const INIT: S = {
  display_name: "",
  avatar_url: "",
  lang: "fr",
  dark_mode: true,
  autoplay_videos: true,
  video_quality: "Haute qualité",
  notifications_enabled: true,
  sound_enabled: true,
  power_saver: false,
};

export default function ParametresPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState("Premium");
  const [msg, setMsg] = useState<string | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [s, setS] = useState<S>(INIT);

  const t = I18N[s.lang];

  useEffect(() => {
    let ok = true;
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!ok) return;
      if (!u) { setLoading(false); router.replace("/login"); return; }
      setUser(u);

      const [r1, r2, r3] = await Promise.all([
        supabase.from("user_settings").select("*").eq("user_id", u.id).maybeSingle(),
        supabase.from("user_player_preferences").select("*").eq("user_id", u.id).maybeSingle(),
        supabase.from("user_subscriptions").select("plan_name").eq("user_id", u.id).maybeSingle(),
      ]);
      if (!ok) return;
      if (r3.data?.plan_name) setPlan(r3.data.plan_name);

      const resolvedLang = resolveLang(r1.data?.language);
      setS({
        display_name: r1.data?.display_name || u.user_metadata?.full_name || u.email?.split("@")[0] || I18N[resolvedLang].defaultMember,
        avatar_url: r1.data?.avatar_url || "",
        lang: resolvedLang,
        dark_mode: r1.data?.dark_mode ?? true,
        autoplay_videos: r2.data?.autoplay_videos ?? true,
        video_quality: r2.data?.video_quality || I18N[resolvedLang].qualityHigh,
        notifications_enabled: r1.data?.notifications_enabled ?? true,
        sound_enabled: r2.data?.sound_enabled ?? true,
        power_saver: r1.data?.power_saver ?? false,
      });
      setLoading(false);
    })();
    return () => { ok = false; };
  }, [router]);

  const saveAll = async (next: S, info?: string) => {
    const tr = I18N[next.lang];
    setSaving(true);
    setMsg(null);
    const { data: { user: activeUser }, error: authErr } = await supabase.auth.getUser();
    const uid = activeUser?.id || user?.id;
    if (authErr || !uid) {
      setSaving(false);
      setMsg(`${tr.errorPrefix} : ${authErr?.message || "Session introuvable"}`);
      return;
    }

    const now = new Date().toISOString();
    const basePayload = {
      user_id: uid,
      display_name: next.display_name,
      avatar_url: next.avatar_url,
      language: LANG_LABELS[next.lang],
      notifications_enabled: next.notifications_enabled,
      power_saver: next.power_saver,
      updated_at: now,
    };

    let res1 = await supabase
      .from("user_settings")
      .upsert({ ...basePayload, dark_mode: next.dark_mode }, { onConflict: "user_id" });

    if (res1.error && res1.error.message.toLowerCase().includes("dark_mode")) {
      res1 = await supabase
        .from("user_settings")
        .upsert(basePayload, { onConflict: "user_id" });
    }

    const res2 = await supabase
      .from("user_player_preferences")
      .upsert({
        user_id: uid,
        autoplay_videos: next.autoplay_videos,
        video_quality: next.video_quality,
        sound_enabled: next.sound_enabled,
        updated_at: now,
      }, { onConflict: "user_id" });

    setSaving(false);
    if (res1.error || res2.error) {
      setMsg(`${tr.errorPrefix} : ${res1.error?.message || res2.error?.message}`);
      return;
    }
    if (next.sound_enabled) playSuccess();
    setMsg(info ?? tr.saved);
  };

  const toggle = async (k: "dark_mode" | "autoplay_videos" | "notifications_enabled" | "sound_enabled" | "power_saver") => {
    if (s.sound_enabled) playClick();
    const next = { ...s, [k]: !s[k] };
    setS(next);
    await saveAll(next);
  };

  const cycleLang = async () => {
    if (s.sound_enabled) playClick();
    const nextLang = LANG_ORDER[(LANG_ORDER.indexOf(s.lang) + 1) % LANG_ORDER.length];
    const next = { ...s, lang: nextLang };
    setS(next);
    await saveAll(next, I18N[nextLang].langUpdated(LANG_LABELS[nextLang]));
  };

  const cycleQuality = async () => {
    if (s.sound_enabled) playClick();
    const list = [t.qualityHigh, t.qualityMed, t.qualityLow];
    const video_quality = list[(list.indexOf(s.video_quality) + 1) % list.length];
    const next = { ...s, video_quality };
    setS(next);
    await saveAll(next, t.qualityUpdated(video_quality));
  };

  const onAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (s.sound_enabled) playClick();
    setSaving(true);
    const { data: { user: activeUser } } = await supabase.auth.getUser();
    const uid = activeUser?.id || user?.id;
    if (!uid) { setSaving(false); setMsg(`${t.errorPrefix} : Session introuvable`); return; }

    const ext = file.name.split(".").pop() || "png";
    const path = `${uid}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setSaving(false); setMsg(`${t.uploadPrefix} : ${error.message}`); return; }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const next = { ...s, avatar_url: `${data.publicUrl}?t=${Date.now()}` };
    setS(next);
    await saveAll(next, t.avatarUpdated);
  };

  const sendTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) {
      setMsg(`${t.errorPrefix} : ${t.subjectPlaceholder} / ${t.messagePlaceholder}`);
      return;
    }
    if (s.sound_enabled) playClick();
    setSaving(true);
    setMsg(null);

    const { data: { user: activeUser }, error: authErr } = await supabase.auth.getUser();
    const uid = activeUser?.id || user?.id;
    if (authErr || !uid) {
      setSaving(false);
      setMsg(`${t.errorPrefix} : ${authErr?.message || "Session introuvable"}`);
      return;
    }

    const { error } = await supabase.from("support_tickets").insert({
      user_id: uid,
      subject: subject.trim(),
      message: body.trim(),
      status: "open",
    });

    setSaving(false);
    if (error) {
      setMsg(`${t.errorPrefix} : ${error.message}`);
      return;
    }
    if (s.sound_enabled) playSuccess();
    setSubject("");
    setBody("");
    setSupportOpen(false);
    setMsg(t.ticketSent);
  };

  const signOut = async () => {
    if (s.sound_enabled) playClick();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  };

      
