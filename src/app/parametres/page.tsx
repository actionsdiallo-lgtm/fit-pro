"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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
    signInPrompt: string;
    signInAction: string;
    modalTitle: string;
    subjectPlaceholder: string;
    messagePlaceholder: string;
    cancel: string;
    send: string;
  }
> = {
  fr: {
    loading: "Chargement...",
    title: "Paramètres",
    saved: "Paramètres enregistrés",
    langUpdated: (l) => `Langue : ${l}`,
    qualityUpdated: (q) => `Qualité vidéo : ${q}`,
    avatarUpdated: "Photo de profil mise à jour",
    cloudSaved: "Préférences enregistrées localement",
    cloudRestored: "Préférences rechargées",
    ticketSent: "Message préparé pour le support FIT PRO",
    syncing: "Synchronisation...",
    errorPrefix: "Erreur",
    uploadPrefix: "Mise à jour",
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
    backup: "Sauvegarde des préférences",
    backupDesc: "Enregistrer l'état actuel",
    restore: "Réinitialiser les préférences",
    restoreDesc: "Revenir aux valeurs par défaut",
    deleteAccount: "Supprimer mon compte",
    deleteAccountDesc: "Contacter le support pour suppression",
    privacyPolicy: "Politique de confidentialité",
    privacyPolicyDesc: "Protection de votre compte et de vos données",
    terms: "Conditions d'utilisation",
    termsDesc: "Règles d'utilisation de FIT PRO",
    supportSection: "Aide et support",
    helpCenter: "Centre d'aide",
    helpCenterDesc: "Questions fréquentes et guides",
    contactSupport: "Contacter le support",
    contactSupportDesc: "Nous écrire",
    about: "À propos de FIT PRO",
    aboutDesc: "Version 1.0.0 • Session NextAuth active",
    signOut: "Se déconnecter",
    signInPrompt: "Aucune session active détectée.",
    signInAction: "Se connecter",
    modalTitle: "Contacter le support FIT PRO",
    subjectPlaceholder: "Sujet",
    messagePlaceholder: "Votre message...",
    cancel: "Annuler",
    send: "Envoyer",
  },
  en: {
    loading: "Loading...",
    title: "Settings",
    saved: "Settings saved",
    langUpdated: (l) => `Language: ${l}`,
    qualityUpdated: (q) => `Video quality: ${q}`,
    avatarUpdated: "Profile photo updated",
    cloudSaved: "Preferences saved locally",
    cloudRestored: "Preferences reloaded",
    ticketSent: "Message prepared for FIT PRO support",
    syncing: "Syncing...",
    errorPrefix: "Error",
    uploadPrefix: "Update",
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
    backup: "Save preferences",
    backupDesc: "Store current settings",
    restore: "Reset preferences",
    restoreDesc: "Restore default values",
    deleteAccount: "Delete my account",
    deleteAccountDesc: "Contact support for account deletion",
    privacyPolicy: "Privacy policy",
    privacyPolicyDesc: "Account and data protection",
    terms: "Terms of use",
    termsDesc: "FIT PRO terms of service",
    supportSection: "Help and support",
    helpCenter: "Help center",
    helpCenterDesc: "FAQs and guides",
    contactSupport: "Contact support",
    contactSupportDesc: "Write to us",
    about: "About FIT PRO",
    aboutDesc: "Version 1.0.0 • NextAuth session active",
    signOut: "Sign out",
    signInPrompt: "No active session detected.",
    signInAction: "Sign in",
    modalTitle: "Contact FIT PRO support",
    subjectPlaceholder: "Subject",
    messagePlaceholder: "Your message...",
    cancel: "Cancel",
    send: "Send",
  },
  es: {
    loading: "Cargando...",
    title: "Ajustes",
    saved: "Ajustes guardados",
    langUpdated: (l) => `Idioma: ${l}`,
    qualityUpdated: (q) => `Calidad de video: ${q}`,
    avatarUpdated: "Foto de perfil actualizada",
    cloudSaved: "Preferencias guardadas",
    cloudRestored: "Preferencias restablecidas",
    ticketSent: "Mensaje preparado para soporte FIT PRO",
    syncing: "Sincronizando...",
    errorPrefix: "Error",
    uploadPrefix: "Actualización",
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
    backup: "Guardar preferencias",
    backupDesc: "Guardar ajustes actuales",
    restore: "Restablecer ajustes",
    restoreDesc: "Volver a valores por defecto",
    deleteAccount: "Eliminar mi cuenta",
    deleteAccountDesc: "Contactar soporte para eliminar cuenta",
    privacyPolicy: "Política de privacidad",
    privacyPolicyDesc: "Protección de cuenta y datos",
    terms: "Términos de uso",
    termsDesc: "Condiciones de FIT PRO",
    supportSection: "Ayuda y soporte",
    helpCenter: "Centro de ayuda",
    helpCenterDesc: "Preguntas frecuentes y guías",
    contactSupport: "Contactar soporte",
    contactSupportDesc: "Escríbenos",
    about: "Acerca de FIT PRO",
    aboutDesc: "Versión 1.0.0 • Sesión NextAuth activa",
    signOut: "Cerrar sesión",
    signInPrompt: "No hay sesión activa.",
    signInAction: "Iniciar sesión",
    modalTitle: "Contactar soporte de FIT PRO",
    subjectPlaceholder: "Asunto",
    messagePlaceholder: "Tu mensaje...",
    cancel: "Cancelar",
    send: "Enviar",
  },
  pt: {
    loading: "Carregando...",
    title: "Configurações",
    saved: "Configurações salvas",
    langUpdated: (l) => `Idioma: ${l}`,
    qualityUpdated: (q) => `Qualidade do vídeo: ${q}`,
    avatarUpdated: "Foto de perfil atualizada",
    cloudSaved: "Preferências salvas",
    cloudRestored: "Preferências restauradas",
    ticketSent: "Mensagem preparada para o suporte FIT PRO",
    syncing: "Sincronizando...",
    errorPrefix: "Erro",
    uploadPrefix: "Atualização",
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
    backup: "Salvar preferências",
    backupDesc: "Guardar ajustes atuais",
    restore: "Redefinir ajustes",
    restoreDesc: "Voltar ao padrão",
    deleteAccount: "Excluir minha conta",
    deleteAccountDesc: "Falar com o suporte para excluir conta",
    privacyPolicy: "Política de privacidade",
    privacyPolicyDesc: "Proteção de conta e dados",
    terms: "Termos de uso",
    termsDesc: "Termos do FIT PRO",
    supportSection: "Ajuda e suporte",
    helpCenter: "Central de ajuda",
    helpCenterDesc: "Perguntas frequentes e guias",
    contactSupport: "Falar com o suporte",
    contactSupportDesc: "Escreva para nós",
    about: "Sobre o FIT PRO",
    aboutDesc: "Versão 1.0.0 • Sessão NextAuth ativa",
    signOut: "Sair",
    signInPrompt: "Nenhuma sessão ativa encontrada.",
    signInAction: "Entrar",
    modalTitle: "Falar com o suporte FIT PRO",
    subjectPlaceholder: "Assunto",
    messagePlaceholder: "Sua mensagem...",
    cancel: "Cancelar",
    send: "Enviar",
  },
  ar: {
    loading: "جارٍ التحميل...",
    title: "الإعدادات",
    saved: "تم حفظ الإعدادات",
    langUpdated: (l) => `اللغة: ${l}`,
    qualityUpdated: (q) => `جودة الفيديو: ${q}`,
    avatarUpdated: "تم تحديث صورة الملف الشخصي",
    cloudSaved: "تم حفظ التفضيلات",
    cloudRestored: "تمت استعادة التفضيلات",
    ticketSent: "تم تجهيز الرسالة لدعم FIT PRO",
    syncing: "جارٍ المزامنة...",
    errorPrefix: "خطأ",
    uploadPrefix: "تحديث",
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
    backup: "حفظ التفضيلات",
    backupDesc: "حفظ الإعدادات الحالية",
    restore: "إعادة ضبط الإعدادات",
    restoreDesc: "العودة إلى الافتراضي",
    deleteAccount: "حذف حسابي",
    deleteAccountDesc: "تواصل مع الدعم لحذف الحساب",
    privacyPolicy: "سياسة الخصوصية",
    privacyPolicyDesc: "حماية الحساب والبيانات",
    terms: "شروط الاستخدام",
    termsDesc: "شروط استخدام FIT PRO",
    supportSection: "المساعدة والدعم",
    helpCenter: "مركز المساعدة",
    helpCenterDesc: "الأسئلة الشائعة والأدلة",
    contactSupport: "تواصل مع الدعم",
    contactSupportDesc: "راسلنا",
    about: "حول FIT PRO",
    aboutDesc: "الإصدار 1.0.0 • جلسة NextAuth نشطة",
    signOut: "تسجيل الخروج",
    signInPrompt: "لا توجد جلسة نشطة.",
    signInAction: "تسجيل الدخول",
    modalTitle: "تواصل مع دعم FIT PRO",
    subjectPlaceholder: "الموضوع",
    messagePlaceholder: "رسالتك...",
    cancel: "إلغاء",
    send: "إرسال",
  },
  de: {
    loading: "Laden...",
    title: "Einstellungen",
    saved: "Einstellungen gespeichert",
    langUpdated: (l) => `Sprache: ${l}`,
    qualityUpdated: (q) => `Videoqualität: ${q}`,
    avatarUpdated: "Profilbild aktualisiert",
    cloudSaved: "Einstellungen gespeichert",
    cloudRestored: "Einstellungen zurückgesetzt",
    ticketSent: "Nachricht an FIT PRO Support vorbereitet",
    syncing: "Synchronisiere...",
    errorPrefix: "Fehler",
    uploadPrefix: "Aktualisierung",
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
    backup: "Einstellungen sichern",
    backupDesc: "Aktuelle Auswahl speichern",
    restore: "Standardwerte laden",
    restoreDesc: "Einstellungen zurücksetzen",
    deleteAccount: "Konto löschen",
    deleteAccountDesc: "Support für Kontolöschung kontaktieren",
    privacyPolicy: "Datenschutzerklärung",
    privacyPolicyDesc: "Konto- und Datenschutz",
    terms: "Nutzungsbedingungen",
    termsDesc: "Nutzungsbedingungen von FIT PRO",
    supportSection: "Hilfe und Support",
    helpCenter: "Hilfecenter",
    helpCenterDesc: "Häufige Fragen und Anleitungen",
    contactSupport: "Support kontaktieren",
    contactSupportDesc: "Schreibe uns",
    about: "Über FIT PRO",
    aboutDesc: "Version 1.0.0 • NextAuth-Sitzung aktiv",
    signOut: "Abmelden",
    signInPrompt: "Keine aktive Sitzung erkannt.",
    signInAction: "Anmelden",
    modalTitle: "FIT PRO Support kontaktieren",
    subjectPlaceholder: "Betreff",
    messagePlaceholder: "Deine Nachricht...",
    cancel: "Abbrechen",
    send: "Senden",
  },
  it: {
    loading: "Caricamento...",
    title: "Impostazioni",
    saved: "Impostazioni salvate",
    langUpdated: (l) => `Lingua: ${l}`,
    qualityUpdated: (q) => `Qualità video: ${q}`,
    avatarUpdated: "Foto profilo aggiornata",
    cloudSaved: "Preferenze salvate",
    cloudRestored: "Preferenze ripristinate",
    ticketSent: "Messaggio preparato per il supporto FIT PRO",
    syncing: "Sincronizzazione...",
    errorPrefix: "Errore",
    uploadPrefix: "Aggiornamento",
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
    backup: "Salva preferenze",
    backupDesc: "Salva impostazioni attuali",
    restore: "Ripristina predefiniti",
    restoreDesc: "Torna ai valori iniziali",
    deleteAccount: "Elimina il mio account",
    deleteAccountDesc: "Contatta il supporto per eliminare l'account",
    privacyPolicy: "Informativa sulla privacy",
    privacyPolicyDesc: "Protezione account e dati",
    terms: "Condizioni d'uso",
    termsDesc: "Condizioni di FIT PRO",
    supportSection: "Aiuto e supporto",
    helpCenter: "Centro assistenza",
    helpCenterDesc: "Domande frequentes e guide",
    contactSupport: "Contatta il supporto",
    contactSupportDesc: "Scrivici",
    about: "Informazioni su FIT PRO",
    aboutDesc: "Versione 1.0.0 • Sessione NextAuth attiva",
    signOut: "Esci",
    signInPrompt: "Nessuna sessione attiva rilevata.",
    signInAction: "Accedi",
    modalTitle: "Contatta il supporto FIT PRO",
    subjectPlaceholder: "Oggetto",
    messagePlaceholder: "Il tuo messaggio...",
    cancel: "Annulla",
    send: "Invia",
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
  const { data: session, status } = useSession();

  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [plan, setPlan] = useState("Premium");
  const [msg, setMsg] = useState<string | null>(null);
  const [supportOpen, setSupportOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [s, setS] = useState<S>(INIT);

  const t = I18N[s.lang];
  const userEmail = session?.user?.email || "";
  const userName =
    session?.user?.name ||
    s.display_name ||
    (userEmail ? userEmail.split("@")[0] : "") ||
    t.defaultMember;

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) return;

    setS((prev) => ({
      ...prev,
      display_name:
        session.user?.name ||
        prev.display_name ||
        session.user?.email?.split("@")[0] ||
        I18N[prev.lang].defaultMember,
      avatar_url: session.user?.image || prev.avatar_url,
    }));
  }, [session, status]);

  function flash(m: string) {
    setMsg(m);
    window.setTimeout(() => {
      setMsg((cur) => (cur === m ? null : cur));
    }, 2800);
  }

  function updatePref<K extends keyof S>(key: K, val: S[K], feedback?: string) {
    setSaving(true);
    setS((prev) => ({ ...prev, [key]: val }));
    window.setTimeout(() => {
      setSaving(false);
      flash(feedback || t.saved);
    }, 150);
  }

  function handleLangChange(nextLang: LangCode) {
    playClick();
    const nextQuality =
      nextLang === "en"
        ? I18N.en.qualityHigh
        : nextLang === "es"
        ? I18N.es.qualityHigh
        : nextLang === "pt"
        ? I18N.pt.qualityHigh
        : nextLang === "ar"
        ? I18N.ar.qualityHigh
        : nextLang === "de"
        ? I18N.de.qualityHigh
        : nextLang === "it"
        ? I18N.it.qualityHigh
        : I18N.fr.qualityHigh;

    setS((prev) => ({
      ...prev,
      lang: nextLang,
      video_quality: nextQuality,
    }));
    flash(I18N[nextLang].langUpdated(LANG_LABELS[nextLang]));
  }

  function handleQualityChange(nextQuality: string) {
    playClick();
    updatePref("video_quality", nextQuality, t.qualityUpdated(nextQuality));
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    playClick();
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updatePref("avatar_url", reader.result, t.avatarUpdated);
      }
    };
    reader.readAsDataURL(file);
  }

  async function handleSignOut() {
    playClick();
    setSigningOut(true);
    try {
      await signOut({ callbackUrl: "/login" });
    } catch {
      setSigningOut(false);
      router.push("/login");
    }
  }

  function handleSendSupport(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() && !body.trim()) return;
    playSuccess();
    setSupportOpen(false);
    setSubject("");
    setBody("");
    flash(t.ticketSent);
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#07090d] text-white flex items-center justify-center px-4">
        <div className="text-sm text-zinc-400">{I18N.fr.loading}</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#07090d] text-white flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-sm text-zinc-300">{t.signInPrompt}</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="rounded-xl bg-[#00e65b] px-5 py-2.5 text-sm font-bold text-black hover:opacity-90"
        >
          {t.signInAction}
        </button>
      </div>
    );
  }

  const initials = (userName || "FP")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      dir={s.lang === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#07090d] text-white pb-28"
    >
      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight">{t.title}</h1>
          {(saving || signingOut) && (
            <span className="text-xs font-medium text-[#00e65b]">
              {t.syncing}
            </span>
          )}
        </div>

        {msg && (
          <div className="rounded-xl border border-[#00e65b]/40 bg-[#00e65b]/10 px-4 py-3 text-sm text-[#00e65b]">
            {msg}
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-[#12161f] p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <label className="relative cursor-pointer shrink-0">
              {s.avatar_url ? (
                <img
                  src={s.avatar_url}
                  alt={userName}
                  className="w-14 h-14 rounded-full object-cover border border-[#00e65b]/50"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#1a2230] border border-[#00e65b]/40 flex items-center justify-center text-base font-bold text-[#00e65b]">
                  {initials}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
            <div className="min-w-0">
              <div className="font-bold text-base truncate">{userName}</div>
              {userEmail && (
                <div className="text-xs text-zinc-400 truncate">{userEmail}</div>
              )}
              <div className="mt-1 inline-block rounded-full bg-[#00e65b]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[#00e65b]">
                {plan}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={signingOut}
            onClick={handleSignOut}
            className="shrink-0 rounded-xl border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
          >
            {signingOut ? "..." : t.signOut}
          </button>
        </div>

        <section className="rounded-2xl border border-white/10 bg-[#12161f] p-4 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {t.appSettings}
          </h2>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{t.language}</span>
            <select
              value={s.lang}
              onChange={(e) => handleLangChange(e.target.value as LangCode)}
              className="rounded-xl border border-white/10 bg-[#0b0e14] px-3 py-2 text-sm text-white focus:border-[#00e65b] focus:outline-none"
            >
              {LANG_ORDER.map((code) => (
                <option key={code} value={code}>
                  {LANG_LABELS[code]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">{t.theme}</div>
              <div className="text-xs text-zinc-400">{t.themeDark}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                playClick();
                updatePref("dark_mode", !s.dark_mode);
              }}
              className={`w-12 h-7 rounded-full transition-colors p-1 ${
                s.dark_mode ? "bg-[#00e65b]" : "bg-zinc-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  s.dark_mode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">{t.autoplay}</div>
              <div className="text-xs text-zinc-400">{t.autoplayDesc}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                playClick();
                updatePref("autoplay_videos", !s.autoplay_videos);
              }}
              className={`w-12 h-7 rounded-full transition-colors p-1 ${
                s.autoplay_videos ? "bg-[#00e65b]" : "bg-zinc-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  s.autoplay_videos ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium">{t.quality}</span>
            <select
              value={s.video_quality}
              onChange={(e) => handleQualityChange(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0b0e14] px-3 py-2 text-sm text-white focus:border-[#00e65b] focus:outline-none"
            >
              <option value={t.qualityHigh}>{t.qualityHigh}</option>
              <option value={t.qualityMed}>{t.qualityMed}</option>
              <option value={t.qualityLow}>{t.qualityLow}</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">{t.notifications}</div>
              <div className="text-xs text-zinc-400">{t.notificationsDesc}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                playClick();
                updatePref("notifications_enabled", !s.notifications_enabled);
              }}
              className={`w-12 h-7 rounded-full transition-colors p-1 ${
                s.notifications_enabled ? "bg-[#00e65b]" : "bg-zinc-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  s.notifications_enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">{t.sound}</div>
              <div className="text-xs text-zinc-400">{t.soundDesc}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                playClick();
                updatePref("sound_enabled", !s.sound_enabled);
              }}
              className={`w-12 h-7 rounded-full transition-colors p-1 ${
                s.sound_enabled ? "bg-[#00e65b]" : "bg-zinc-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  s.sound_enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium">{t.powerSaver}</div>
              <div className="text-xs text-zinc-400">{t.powerSaverDesc}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                playClick();
                updatePref("power_saver", !s.power_saver);
              }}
              className={`w-12 h-7 rounded-full transition-colors p-1 ${
                s.power_saver ? "bg-[#00e65b]" : "bg-zinc-700"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-black transition-transform ${
                  s.power_saver ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#12161f] p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {t.privacySection}
          </h2>

          <button
            type="button"
            onClick={() => {
              playSuccess();
              flash(t.cloudSaved);
            }}
            className="w-full flex items-center justify-between rounded-xl bg-[#0b0e14] px-3.5 py-3 text-left hover:bg-white/5"
          >
            <div>
              <div className="text-sm font-medium">{t.backup}</div>
              <div className="text-xs text-zinc-400">{t.backupDesc}</div>
            </div>
            <span className="text-xs text-[#00e65b]">OK</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              setS((prev) => ({ ...INIT, lang: prev.lang }));
              flash(t.cloudRestored);
            }}
            className="w-full flex items-center justify-between rounded-xl bg-[#0b0e14] px-3.5 py-3 text-left hover:bg-white/5"
          >
            <div>
              <div className="text-sm font-medium">{t.restore}</div>
              <div className="text-xs text-zinc-400">{t.restoreDesc}</div>
            </div>
            <span className="text-xs text-zinc-400">↺</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClick();
              setSubject(t.deleteAccount);
              setSupportOpen(true);
            }}
            className="w-full flex items-center justify-between rounded-xl bg-[#0b0e14] px-3.5 py-3 text-left hover:bg-red-500/10"
          >
            <div>
              <div className="text-sm font-medium text-red-300">
                {t.deleteAccount}
              </div>
              <div className="text-xs text-zinc-400">{t.deleteAccountDesc}</div>
            </div>
            <span className="text-xs text-red-400">→</span>
          </button>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[#12161f] p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {t.supportSection}
          </h2>

          <button
            type="button"
            onClick={() => {
              playClick();
              setSupportOpen(true);
            }}
            className="w-full flex items-center justify-between rounded-xl bg-[#0b0e14] px-3.5 py-3 text-left hover:bg-white/5"
          >
            <div>
              <div className="text-sm font-medium">{t.contactSupport}</div>
              <div className="text-xs text-zinc-400">{t.contactSupportDesc}</div>
            </div>
            <span className="text-xs text-[#00e65b]">→</span>
          </button>

          <div className="rounded-xl bg-[#0b0e14] px-3.5 py-3">
            <div className="text-sm font-medium">{t.about}</div>
            <div className="text-xs text-zinc-400">{t.aboutDesc}</div>
          </div>
        </section>

        <button
          type="button"
          disabled={signingOut}
          onClick={handleSignOut}
          className="w-full rounded-2xl border border-red-500/40 bg-red-500/10 py-3.5 text-sm font-bold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
        >
          {signingOut ? t.syncing : t.signOut}
        </button>
      </div>

      {supportOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSendSupport}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#12161f] p-5 space-y-4"
          >
            <h3 className="text-base font-bold">{t.modalTitle}</h3>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={t.subjectPlaceholder}
              className="w-full rounded-xl border border-white/10 bg-[#0b0e14] px-3.5 py-2.5 text-sm text-white focus:border-[#00e65b] focus:outline-none"
            />
            <textarea
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={t.messagePlaceholder}
              className="w-full rounded-xl border border-white/10 bg-[#0b0e14] px-3.5 py-2.5 text-sm text-white focus:border-[#00e65b] focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSupportOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#00e65b] px-4 py-2 text-xs font-bold text-black"
              >
                {t.send}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
    }
      
