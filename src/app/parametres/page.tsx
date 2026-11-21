"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createClient,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js";
import type {
  NarrationLanguage,
  VoiceProfileId,
} from "@/app/api/narration/route";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

type AppLanguage = "fr" | "en" | "es" | "pt" | "ar" | "de" | "it";
type VideoQuality = "auto" | "360p" | "480p" | "720p" | "1080p";
type ThemeMode = "dark" | "light" | "auto";
type TextScale = "small" | "normal" | "large";
type ProfileFrameId = "neon_lime" | "gold_pro" | "cyan_pulse" | "clean_dark";

interface UserSettingsState {
  first_name: string;
  last_name: string;
  avatar_url: string;
  cover_url: string;
  profile_frame: ProfileFrameId;
  birth_date: string;
  country: string;
  phone: string;
  app_lang: AppLanguage;
  video_autoplay: boolean;
  video_loop: boolean;
  video_quality: VideoQuality;
  video_wifi_only: boolean;
  video_data_saver: boolean;
  video_subtitles: boolean;
  video_muted: boolean;
  voice_id: VoiceProfileId;
  narration_lang: NarrationLanguage;
  narration_enabled: boolean;
  voice_volume: number;
  narration_rate: number;
  notif_workouts: boolean;
  notif_nutrition: boolean;
  notif_water: boolean;
  notif_daily_goals: boolean;
  notif_motivation: boolean;
  notif_premium: boolean;
  notif_important: boolean;
  private_profile: boolean;
  allow_photos: boolean;
  allow_sport_analytics: boolean;
  auto_backup: boolean;
  theme_mode: ThemeMode;
  text_scale: TextScale;
  reduce_motion: boolean;
}

interface SubscriptionInfo {
  plan_name: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  created_at: string;
}

const DEFAULT_SETTINGS: UserSettingsState = {
  first_name: "",
  last_name: "",
  avatar_url: "",
  cover_url: "",
  profile_frame: "neon_lime",
  birth_date: "",
  country: "",
  phone: "",
  app_lang: "fr",
  video_autoplay: true,
  video_loop: false,
  video_quality: "auto",
  video_wifi_only: false,
  video_data_saver: false,
  video_subtitles: true,
  video_muted: false,
  voice_id: "coach_pro",
  narration_lang: "fr",
  narration_enabled: true,
  voice_volume: 1.0,
  narration_rate: 1.0,
  notif_workouts: true,
  notif_nutrition: true,
  notif_water: true,
  notif_daily_goals: true,
  notif_motivation: true,
  notif_premium: false,
  notif_important: true,
  private_profile: true,
  allow_photos: true,
  allow_sport_analytics: true,
  auto_backup: true,
  theme_mode: "dark",
  text_scale: "normal",
  reduce_motion: false,
};

const FRAME_STYLES: Record<
  ProfileFrameId,
  { label: string; avatarClass: string; coverClass: string; badgeClass: string }
> = {
  neon_lime: {
    label: "Cadre Néon FIT PRO",
    avatarClass:
      "border-[3px] border-lime-400 ring-4 ring-lime-400/20 shadow-[0_0_24px_rgba(163,230,53,0.45)]",
    coverClass:
      "border-2 border-lime-400/70 shadow-[0_0_28px_rgba(163,230,53,0.18)]",
    badgeClass: "bg-lime-400 text-black",
  },
  gold_pro: {
    label: "Cadre Or Athlète",
    avatarClass:
      "border-[3px] border-amber-400 ring-4 ring-amber-400/20 shadow-[0_0_24px_rgba(251,191,36,0.4)]",
    coverClass:
      "border-2 border-amber-400/70 shadow-[0_0_28px_rgba(251,191,36,0.18)]",
    badgeClass: "bg-amber-400 text-black",
  },
  cyan_pulse: {
    label: "Cadre Cyan Cyber",
    avatarClass:
      "border-[3px] border-cyan-400 ring-4 ring-cyan-400/20 shadow-[0_0_24px_rgba(34,211,238,0.4)]",
    coverClass:
      "border-2 border-cyan-400/70 shadow-[0_0_28px_rgba(34,211,238,0.18)]",
    badgeClass: "bg-cyan-400 text-black",
  },
  clean_dark: {
    label: "Cadre Épuré",
    avatarClass: "border-2 border-white/30 ring-2 ring-white/10",
    coverClass: "border border-white/15",
    badgeClass: "bg-white/15 text-white",
  },
};

const APP_LANGUAGES: { id: AppLanguage; label: string }[] = [
  { id: "fr", label: "Français" },
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
  { id: "pt", label: "Português" },
  { id: "ar", label: "العربية" },
  { id: "de", label: "Deutsch" },
  { id: "it", label: "Italiano" },
];

const NARRATION_LANGUAGES: { id: NarrationLanguage; label: string }[] = [
  { id: "fr", label: "Français" },
  { id: "en", label: "Anglais" },
  { id: "es", label: "Espagnol" },
  { id: "pt", label: "Portugais" },
  { id: "ar", label: "Arabe" },
  { id: "de", label: "Allemand" },
  { id: "it", label: "Italien" },
];

const VOICE_OPTIONS: { id: VoiceProfileId; label: string }[] = [
  { id: "male_natural", label: "Masculine naturelle" },
  { id: "female_natural", label: "Féminine naturelle" },
  { id: "male_energetic", label: "Masculine énergique" },
  { id: "female_soft", label: "Féminine douce" },
  { id: "coach_pro", label: "Voix de coach sportif" },
];

const UI_TEXT: Record<
  AppLanguage,
  {
    pageTitle: string;
    back: string;
    saveAll: string;
    saving: string;
    savedOk: string;
    loginRequired: string;
    loginBtn: string;
    secAccount: string;
    secLang: string;
    secVideo: string;
    secVoice: string;
    secNotif: string;
    secPrivacy: string;
    secSecurity: string;
    secPremium: string;
    secAppearance: string;
    secSupport: string;
    secData: string;
    secAbout: string;
    previewVoice: string;
    exportData: string;
    deleteAccount: string;
    signOut: string;
    signOutOthers: string;
  }
> = {
  fr: {
    pageTitle: "PARAMÈTRES",
    back: "← Retour",
    saveAll: "Enregistrer les modifications",
    saving: "Synchronisation...",
    savedOk: "Paramètres synchronisés avec votre compte.",
    loginRequired:
      "Connectez-vous pour charger, modifier et synchroniser vos paramètres personnels.",
    loginBtn: "Se connecter",
    secAccount: "1. Mon compte",
    secLang: "2. Langue de l'application",
    secVideo: "3. Paramètres vidéo",
    secVoice: "4. Paramètres de voix et narration IA",
    secNotif: "5. Notifications",
    secPrivacy: "6. Confidentialité",
    secSecurity: "7. Sécurité",
    secPremium: "8. Abonnement Premium",
    secAppearance: "9. Apparence",
    secSupport: "10. Assistance",
    secData: "11. Gestion des données",
    secAbout: "12. Informations",
    previewVoice: "Écouter un aperçu de la voix",
    exportData: "Exporter mes données (JSON)",
    deleteAccount: "Supprimer définitivement le compte",
    signOut: "Déconnexion sécurisée",
    signOutOthers: "Déconnecter les autres sessions",
  },
  en: {
    pageTitle: "SETTINGS",
    back: "← Back",
    saveAll: "Save changes",
    saving: "Syncing...",
    savedOk: "Settings synced to your account.",
    loginRequired:
      "Sign in to load, edit, and sync your personal account settings.",
    loginBtn: "Sign in",
    secAccount: "1. My Account",
    secLang: "2. App Language",
    secVideo: "3. Video Settings",
    secVoice: "4. AI Voice & Narration",
    secNotif: "5. Notifications",
    secPrivacy: "6. Privacy",
    secSecurity: "7. Security",
    secPremium: "8. Premium Subscription",
    secAppearance: "9. Appearance",
    secSupport: "10. Support",
    secData: "11. Data Management",
    secAbout: "12. Information",
    previewVoice: "Listen to voice preview",
    exportData: "Export my data (JSON)",
    deleteAccount: "Permanently delete account",
    signOut: "Secure sign out",
    signOutOthers: "Sign out other sessions",
  },
  es: {
    pageTitle: "AJUSTES",
    back: "← Volver",
    saveAll: "Guardar cambios",
    saving: "Sincronizando...",
    savedOk: "Ajustes sincronizados con tu cuenta.",
    loginRequired:
      "Inicia sesión para cargar, editar y sincronizar tus ajustes personales.",
    loginBtn: "Iniciar sesión",
    secAccount: "1. Mi cuenta",
    secLang: "2. Idioma de la aplicación",
    secVideo: "3. Ajustes de vídeo",
    secVoice: "4. Voz y narración IA",
    secNotif: "5. Notificaciones",
    secPrivacy: "6. Privacidad",
    secSecurity: "7. Seguridad",
    secPremium: "8. Suscripción Premium",
    secAppearance: "9. Apariencia",
    secSupport: "10. Asistencia",
    secData: "11. Gestión de datos",
    secAbout: "12. Información",
    previewVoice: "Escuchar vista previa de voz",
    exportData: "Exportar mis datos (JSON)",
    deleteAccount: "Eliminar cuenta permanentemente",
    signOut: "Cerrar sesión de forma segura",
    signOutOthers: "Cerrar otras sesiones",
  },
  pt: {
    pageTitle: "DEFINIÇÕES",
    back: "← Voltar",
    saveAll: "Guardar alterações",
    saving: "A sincronizar...",
    savedOk: "Definições sincronizadas com a sua conta.",
    loginRequired:
      "Inicie sessão para carregar, editar e sincronizar as suas definições.",
    loginBtn: "Iniciar sessão",
    secAccount: "1. A minha conta",
    secLang: "2. Idioma da aplicação",
    secVideo: "3. Definições de vídeo",
    secVoice: "4. Voz e narração IA",
    secNotif: "5. Notificações",
    secPrivacy: "6. Privacidade",
    secSecurity: "7. Segurança",
    secPremium: "8. Subscrição Premium",
    secAppearance: "9. Aparência",
    secSupport: "10. Assistência",
    secData: "11. Gestão de dados",
    secAbout: "12. Informações",
    previewVoice: "Ouvir pré-visualização da voz",
    exportData: "Exportar os meus dados (JSON)",
    deleteAccount: "Eliminar conta permanentemente",
    signOut: "Terminar sessão com segurança",
    signOutOthers: "Terminar outras sessões",
  },
  ar: {
    pageTitle: "الإعدادات",
    back: "رجوع →",
    saveAll: "حفظ التغييرات",
    saving: "جاري المزامنة...",
    savedOk: "تمت مزامنة الإعدادات مع حسابك.",
    loginRequired: "سجّل الدخول لتحميل إعداداتك الشخصية وتعديلها ومزامنتها.",
    loginBtn: "تسجيل الدخول",
    secAccount: "1. حسابي",
    secLang: "2. لغة التطبيق",
    secVideo: "3. إعدادات الفيديو",
    secVoice: "4. الصوت والسرد بالذكاء الاصطناعي",
    secNotif: "5. الإشعارات",
    secPrivacy: "6. الخصوصية",
    secSecurity: "7. الأمان",
    secPremium: "8. الاشتراك المميز",
    secAppearance: "9. المظهر",
    secSupport: "10. المساعدة والدعم",
    secData: "11. إدارة البيانات",
    secAbout: "12. معلومات التطبيق",
    previewVoice: "الاستماع إلى معاينة الصوت",
    exportData: "تصدير بياناتي (JSON)",
    deleteAccount: "حذف الحساب نهائياً",
    signOut: "تسجيل خروج آمن",
    signOutOthers: "تسجيل الخروج من الجلسات الأخرى",
  },
  de: {
    pageTitle: "EINSTELLUNGEN",
    back: "← Zurück",
    saveAll: "Änderungen speichern",
    saving: "Synchronisieren...",
    savedOk: "Einstellungen mit Ihrem Konto synchronisiert.",
    loginRequired:
      "Melden Sie sich an, um Ihre persönlichen Einstellungen zu verwalten.",
    loginBtn: "Anmelden",
    secAccount: "1. Mein Konto",
    secLang: "2. App-Sprache",
    secVideo: "3. Videoeinstellungen",
    secVoice: "4. KI-Stimme & Sprachausgabe",
    secNotif: "5. Benachrichtigungen",
    secPrivacy: "6. Datenschutz",
    secSecurity: "7. Sicherheit",
    secPremium: "8. Premium-Abonnement",
    secAppearance: "9. Erscheinungsbild",
    secSupport: "10. Hilfe & Support",
    secData: "11. Datenverwaltung",
    secAbout: "12. Informationen",
    previewVoice: "Stimmvorschau anhören",
    exportData: "Meine Daten exportieren (JSON)",
    deleteAccount: "Konto dauerhaft löschen",
    signOut: "Sicher abmelden",
    signOutOthers: "Andere Sitzungen abmelden",
  },
  it: {
    pageTitle: "IMPOSTAZIONI",
    back: "← Indietro",
    saveAll: "Salva modifiche",
    saving: "Sincronizzazione...",
    savedOk: "Impostazioni sincronizzate con il tuo account.",
    loginRequired:
      "Accedi per caricare, modificare e sincronizzare le tue impostazioni.",
    loginBtn: "Accedi",
    secAccount: "1. Il mio account",
    secLang: "2. Lingua dell'app",
    secVideo: "3. Impostazioni video",
    secVoice: "4. Voce e narrazione IA",
    secNotif: "5. Notifiche",
    secPrivacy: "6. Privacy",
    secSecurity: "7. Sicurezza",
    secPremium: "8. Abbonamento Premium",
    secAppearance: "9. Aspetto",
    secSupport: "10. Assistenza",
    secData: "11. Gestione dati",
    secAbout: "12. Informazioni",
    previewVoice: "Ascolta anteprima voce",
    exportData: "Esporta i miei dati (JSON)",
    deleteAccount: "Elimina definitivamente l'account",
    signOut: "Disconnessione sicura",
    signOutOthers: "Disconnetti altre sessioni",
  },
};

export default function ParametresPage() {
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettingsState>(DEFAULT_SETTINGS);
  const [emailInput, setEmailInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mfaFactorsCount, setMfaFactorsCount] = useState<number>(0);

  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null
  );
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [ticketCategory, setTicketCategory] = useState("technique");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState<"avatar" | "cover" | null>(
    null
  );
  const [previewingVoice, setPreviewingVoice] = useState(false);
  const [sendingTicket, setSendingTicket] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [fullscreenTestSupported, setFullscreenTestSupported] = useState(false);

  const [bannerMsg, setBannerMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const t = useMemo(
    () => UI_TEXT[settings.app_lang] || UI_TEXT.fr,
    [settings.app_lang]
  );

  const currentFrame = useMemo(
    () => FRAME_STYLES[settings.profile_frame] || FRAME_STYLES.neon_lime,
    [settings.profile_frame]
  );

  useEffect(() => {
    setFullscreenTestSupported(
      typeof document !== "undefined" && Boolean(document.fullscreenEnabled)
    );
    return () => {
      audioRef.current?.pause();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = settings.app_lang;
    document.documentElement.dir = settings.app_lang === "ar" ? "rtl" : "ltr";
  }, [settings.app_lang]);

  const loadAllUserData = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);

    if (!supabase) {
      setErrorMsg(
        "Configuration Supabase manquante (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)."
      );
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user: authUser },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(authUser);
      setEmailInput(authUser.email ?? "");

      const [settingsRes, subRes, ticketsRes, mfaRes] = await Promise.all([
        supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", authUser.id)
          .maybeSingle(),
        supabase
          .from("user_subscriptions")
          .select(
            "plan_name, status, current_period_end, cancel_at_period_end"
          )
          .eq("user_id", authUser.id)
          .maybeSingle(),
        supabase
          .from("support_tickets")
          .select(
            "id, category, subject, message, status, admin_reply, created_at"
          )
          .eq("user_id", authUser.id)
          .order("created_at", { ascending: false }),
        supabase.auth.mfa.listFactors(),
      ]);

      if (settingsRes.data) {
        const d = settingsRes.data;
        setSettings({
          first_name: d.first_name ?? "",
          last_name: d.last_name ?? "",
          avatar_url: d.avatar_url ?? "",
          cover_url: d.cover_url ?? "",
          profile_frame: (d.profile_frame as ProfileFrameId) || "neon_lime",
          birth_date: d.birth_date ?? "",
          country: d.country ?? "",
          phone: d.phone ?? "",
          app_lang: (d.app_lang as AppLanguage) || "fr",
          video_autoplay: d.video_autoplay ?? true,
          video_loop: d.video_loop ?? false,
          video_quality: (d.video_quality as VideoQuality) || "auto",
          video_wifi_only: d.video_wifi_only ?? false,
          video_data_saver: d.video_data_saver ?? false,
          video_subtitles: d.video_subtitles ?? true,
          video_muted: d.video_muted ?? false,
          voice_id: (d.voice_id as VoiceProfileId) || "coach_pro",
          narration_lang: (d.narration_lang as NarrationLanguage) || "fr",
          narration_enabled: d.narration_enabled ?? true,
          voice_volume:
            typeof d.voice_volume === "number" ? d.voice_volume : 1.0,
          narration_rate:
            typeof d.narration_rate === "number" ? d.narration_rate : 1.0,
          notif_workouts: d.notif_workouts ?? true,
          notif_nutrition: d.notif_nutrition ?? true,
          notif_water: d.notif_water ?? true,
          notif_daily_goals: d.notif_daily_goals ?? true,
          notif_motivation: d.notif_motivation ?? true,
          notif_premium: d.notif_premium ?? false,
          notif_important: d.notif_important ?? true,
          private_profile: d.private_profile ?? true,
          allow_photos: d.allow_photos ?? true,
          allow_sport_analytics: d.allow_sport_analytics ?? true,
          auto_backup: d.auto_backup ?? true,
          theme_mode: (d.theme_mode as ThemeMode) || "dark",
          text_scale: (d.text_scale as TextScale) || "normal",
          reduce_motion: d.reduce_motion ?? false,
        });
      }

      if (subRes.data) {
        setSubscription(subRes.data as SubscriptionInfo);
      } else {
        setSubscription(null);
      }

      if (ticketsRes.data) {
        setTickets(ticketsRes.data as SupportTicket[]);
      }

      const verifiedFactors =
        mfaRes.data?.totp?.filter((f) => f.status === "verified") ?? [];
      setMfaFactorsCount(verifiedFactors.length);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement de vos paramètres."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllUserData();
  }, [loadAllUserData]);

  const handleSaveAll = async () => {
    if (!supabase || !user) return;
    setSaving(true);
    setBannerMsg(null);
    setErrorMsg(null);

    try {
      const payload = {
        user_id: user.id,
        first_name: settings.first_name.trim(),
        last_name: settings.last_name.trim(),
        avatar_url: settings.avatar_url.trim(),
        cover_url: settings.cover_url.trim(),
        profile_frame: settings.profile_frame,
        birth_date: settings.birth_date || null,
        country: settings.country.trim(),
        phone: settings.phone.trim(),
        app_lang: settings.app_lang,
        video_autoplay: settings.video_autoplay,
        video_loop: settings.video_loop,
        video_quality: settings.video_quality,
        video_wifi_only: settings.video_wifi_only,
        video_data_saver: settings.video_data_saver,
        video_subtitles: settings.video_subtitles,
        video_muted: settings.video_muted,
        voice_id: set
