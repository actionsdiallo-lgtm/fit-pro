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
        voice_id: set        narration_lang: settings.narration_lang,
        narration_enabled: settings.narration_enabled,
        voice_volume: settings.voice_volume,
        narration_rate: settings.narration_rate,
        notif_workouts: settings.notif_workouts,
        notif_nutrition: settings.notif_nutrition,
        notif_water: settings.notif_water,
        notif_daily_goals: settings.notif_daily_goals,
        notif_motivation: settings.notif_motivation,
        notif_premium: settings.notif_premium,
        notif_important: settings.notif_important,
        private_profile: settings.private_profile,
        allow_photos: settings.allow_photos,
        allow_sport_analytics: settings.allow_sport_analytics,
        auto_backup: settings.auto_backup,
        theme_mode: settings.theme_mode,
        text_scale: settings.text_scale,
        reduce_motion: settings.reduce_motion,
        updated_at: new Date().toISOString(),
      };

      const { error: settingsError } = await supabase
        .from("user_settings")
        .upsert(payload, { onConflict: "user_id" });

      if (settingsError) {
        throw new Error(settingsError.message);
      }

      await supabase.from("user_player_preferences").upsert(
        {
          user_id: user.id,
          voice_id: settings.voice_id,
          narration_lang: settings.narration_lang,
          voice_volume: settings.voice_volume,
          narration_enabled: settings.narration_enabled,
          narration_rate: settings.narration_rate,
          subtitles_enabled: settings.video_subtitles,
          autoplay_enabled: settings.video_autoplay,
          loop_enabled: settings.video_loop,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      if (emailInput.trim() && emailInput.trim() !== user.email) {
        const { error: emailErr } = await supabase.auth.updateUser({
          email: emailInput.trim(),
        });
        if (emailErr) throw new Error(emailErr.message);
      }

      setBannerMsg(t.savedOk);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Échec de la sauvegarde sur le cloud."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleMediaUpload = async (
    kind: "avatar" | "cover",
    file: File | null
  ) => {
    if (!file || !supabase || !user) return;
    setUploadingMedia(kind);
    setErrorMsg(null);

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const filePath = `${user.id}/${kind}-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadErr) {
        throw new Error(
          `Upload impossible (${uploadErr.message}). Vérifiez le bucket Storage 'avatars'.`
        );
      }

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      setSettings((prev) =>
        kind === "avatar"
          ? { ...prev, avatar_url: data.publicUrl }
          : { ...prev, cover_url: data.publicUrl }
      );
      setBannerMsg(
        kind === "avatar"
          ? "Photo de profil téléversée. Cliquez sur Enregistrer pour valider."
          : "Photo de couverture téléversée. Cliquez sur Enregistrer pour valider."
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Erreur de téléversement."
      );
    } finally {
      setUploadingMedia(null);
    }
  };

  const handlePreviewVoice = async () => {
    setPreviewingVoice(true);
    setErrorMsg(null);
    try {
      const sampleTexts: Record<NarrationLanguage, string> = {
        fr: "Bonjour, voici votre coach vocal FIT PRO prêt pour votre séance.",
        en: "Hello, your FIT PRO voice coach is ready for your workout.",
        es: "Hola, tu entrenador de voz FIT PRO está listo para entrenar.",
        pt: "Olá, o seu treinador de voz FIT PRO está pronto para o treino.",
        ar: "مرحباً، مدربك الصوتي في فيت برو جاهز للتمرين.",
        de: "Hallo, dein FIT PRO Sprachcoach ist bereit für dein Training.",
        it: "Ciao, il tuo coach vocale FIT PRO è pronto per l'allenamento.",
      };

      const res = await fetch("/api/narration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sampleTexts[settings.narration_lang],
          voiceId: settings.voice_id,
          language: settings.narration_lang,
          rate: settings.narration_rate,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(
          payload?.error ||
            "Service vocal indisponible (vérifiez ELEVENLABS_API_KEY)."
        );
      }

      const blob = await res.blob();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;

      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.pause();
      audioRef.current.src = url;
      audioRef.current.volume = settings.voice_volume;
      audioRef.current.playbackRate = settings.narration_rate;
      await audioRef.current.play();
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Impossible de lire l'aperçu vocal."
      );
    } finally {
      setPreviewingVoice(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!supabase || !user) return;
    setErrorMsg(null);
    setBannerMsg(null);

    if (newPassword.length < 8) {
      setErrorMsg("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("Les deux mots de passe ne correspondent pas.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setErrorMsg(error.message);
    } else {
      setNewPassword("");
      setConfirmPassword("");
      setBannerMsg("Mot de passe mis à jour avec succès.");
    }
  };

  const handleSignOutOthers = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut({ scope: "others" });
    if (error) {
      setErrorMsg(error.message);
    } else {
      setBannerMsg("Toutes les autres sessions actives ont été déconnectées.");
    }
  };

  const handleSecureSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut({ scope: "local" });
    router.push("/login");
  };

  const handleCreateTicket = async () => {
    if (!supabase || !user) return;
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      setErrorMsg("Veuillez renseigner le sujet et le message de votre demande.");
      return;
    }

    setSendingTicket(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .insert({
          user_id: user.id,
          category: ticketCategory,
          subject: ticketSubject.trim(),
          message: ticketMessage.trim(),
        })
        .select(
          "id, category, subject, message, status, admin_reply, created_at"
        )
        .single();

      if (error) throw new Error(error.message);
      if (data) setTickets((prev) => [data as SupportTicket, ...prev]);
      setTicketSubject("");
      setTicketMessage("");
      setBannerMsg("Votre demande d'assistance a bien été envoyée.");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Erreur d'envoi du ticket."
      );
    } finally {
      setSendingTicket(false);
    }
  };

  const handleExportUserData = async () => {
    if (!supabase || !user) return;
    const [workoutsRes] = await Promise.all([
      supabase.from("workouts").select("*").eq("user_id", user.id),
    ]);

    const exportBundle = {
      exported_at: new Date().toISOString(),
      account: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      },
      settings,
      subscription,
      workouts: workoutsRes.data ?? [],
      support_tickets: tickets,
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fit-pro-export-${user.id.slice(0, 8)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    if (!supabase || !user) return;
    if (deleteConfirmText !== "SUPPRIMER") {
      setErrorMsg('Tapez exactement "SUPPRIMER" pour confirmer.');
      return;
    }

    setDeletingAccount(true);
    setErrorMsg(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          body?.error || "Impossible de supprimer définitivement le compte."
        );
      }

      await supabase.auth.signOut({ scope: "local" });
      router.push("/");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Erreur de suppression de compte."
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  const rootThemeClass =
    settings.theme_mode === "light"
      ? "bg-zinc-100 text-zinc-900"
      : "bg-[#0A0A0A] text-white";

  const cardThemeClass =
    settings.theme_mode === "light"
      ? "bg-white border-zinc-200"
      : "bg-[#141414] border-white/10";

  const textScaleClass =
    settings.text_scale === "large"
      ? "text-base"
      : settings.text_scale === "small"
      ? "text-xs"
      : "text-sm";

  const displayName =
    `${settings.first_name} ${settings.last_name}`.trim() ||
    user?.email ||
    "Compte FIT PRO";

  return (
    <div className={`min-h-screen pb-28 ${rootThemeClass} ${textScaleClass}`}>
      <div className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-gray-400 hover:text-lime-400">
            {t.back}
          </Link>
          <span className="font-black tracking-wider text-lime-400">
            FIT PRO
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black">{t.pageTitle}</h1>

        {bannerMsg && (
          <div className="rounded-2xl border border-lime-400/40 bg-lime-950/40 px-4 py-3 text-lime-300">
            {bannerMsg}
          </div>
        )}

        {errorMsg && (
          <div className="rounded-2xl border border-red-500/40 bg-red-950/50 px-4 py-3 text-red-200">
            {errorMsg}
          </div>
        )}

        {loading ? (
          <p className="text-gray-400">Chargement de votre compte...</p>
        ) : !user ? (
          <div
            className={`rounded-3xl border p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${cardThemeClass}`}
          >
            <p className="text-amber-300">{t.loginRequired}</p>
            <Link
              href="/login"
              className="rounded-full bg-lime-400 px-5 py-2.5 font-black text-black"
            >
              {t.loginBtn}
            </Link>
          </div>
        ) : (
          <>
            {/* 1. MON COMPTE — COUVERTURE + PHOTO DE PROFIL + CADRES */}
            <section
              className={`rounded-3xl border p-5 space-y-5 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">
                {t.secAccount}
              </h2>

              <div className="relative pb-12">
                <div
                  className={`h-40 sm:h-48 w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#132615] via-[#101812] to-[#0b0d0c] relative ${currentFrame.coverClass}`}
                >
                  {settings.cover_url ? (
                    <img
                      src={settings.cover_url}
                      alt="Couverture"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-end justify-end p-3">
                      <span
                        className={`text-[11px] font-black px-2.5 py-1 rounded-full ${currentFrame.badgeClass}`}
                      >
                        {currentFrame.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="absolute left-5 bottom-0 flex items-end gap-3">
                  {settings.avatar_url ? (
                    <img
                      src={settings.avatar_url}
                      alt="Photo de profil"
                      className={`h-24 w-24 rounded-full object-cover bg-[#0A0A0A] ${currentFrame.avatarClass}`}
                    />
                  ) : (
                    <div
                      className={`h-24 w-24 rounded-full bg-[#111812] flex items-center justify-center font-black text-lime-400 text-2xl ${currentFrame.avatarClass}`}
                    >
                      {(
                        settings.first_name[0] ||
                        user.email?.[0] ||
                        "U"
                      ).toUpperCase()}
                    </div>
                  )}
                  <div className="pb-1">
                    <p className="font-black text-base">{displayName}</p>
                    <p className="text-xs text-gray-400">{currentFrame.label}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <label className="cursor-pointer rounded-full bg-white/10 px-4 py-2 font-bold hover:bg-white/15">
                  {uploadingMedia === "avatar"
                    ? "Téléversement profil..."
                    : "Photo de profil"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleMediaUpload("avatar", e.target.files?.[0] ?? null)
                    }
                  />
                </label>

                <label className="cursor-pointer rounded-full bg-white/10 px-4 py-2 font-bold hover:bg-white/15">
                  {uploadingMedia === "cover"
                    ? "Téléversement couverture..."
                    : "Photo de couverture"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleMediaUpload("cover", e.target.files?.[0] ?? null)
                    }
                  />
                </label>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400 block">
                  Style du cadre (photo de profil et couverture)
                </span>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(FRAME_STYLES) as ProfileFrameId[]).map(
                    (frameKey) => (
                      <button
                        key={frameKey}
                        type="button"
                        onClick={() =>
                          setSettings({ ...settings, profile_frame: frameKey })
                        }
                        className={`px-3.5 py-2 rounded-full text-xs font-black transition ${
                          settings.profile_frame === frameKey
                            ? "bg-lime-400 text-black"
                            : "bg-white/10 text-gray-200 hover:bg-white/15"
                        }`}
                      >
                        {FRAME_STYLES[frameKey].label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="text-gray-400">Prénom</span>
                  <input
                    type="text"
                    value={settings.first_name}
                    onChange={(e) =>
                      setSettings({ ...settings, first_name: e.target.value })
                    }
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-gray-400">Nom</span>
                  <input
                    type="text"
                    value={settings.last_name}
                    onChange={(e) =>
                      setSettings({ ...settings, last_name: e.target.value })
                    }
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-gray-400">Adresse e-mail</span>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-gray-400">Téléphone</span>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-gray-400">Date de naissance</span>
                  <input
                    type="date"
                    value={settings.birth_date}
                    onChange={(e) =>
                      setSettings({ ...settings, birth_date: e.target.value })
                    }
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-gray-400">Pays</span>
                  <input
                    type="text"
                    value={settings.country}
                    onChange={(e) =>
                      setSettings({ ...settings, country: e.target.value })
                    }
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                  />
                </label>
              </div>

              <div className="rounded-xl bg-black/30 p-3 text-xs text-gray-400 space-y-1">
                <p>Identifiant compte : {user.id}</p>
                <p>
                  Créé le :{" "}
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </section>

            {/* 2. LANGUE DE L'APPLICATION */}
            <section
              className={`rounded-3xl border p-5 space-y-3 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">{t.secLang}</h2>
              <div className="flex flex-wrap gap-2">
                         {APP_LANGUAGES.map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, app_lang: lang.id })
                    }
                    className={`px-4 py-2 rounded-full font-bold ${
                      settings.app_lang === lang.id
                        ? "bg-lime-400 text-black"
                        : "bg-white/10"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </section>

            {/* 3. PARAMÈTRES VIDÉO */}
            <section
              className={`rounded-3xl border p-5 space-y-4 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">{t.secVideo}</h2>

              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { key: "video_autoplay", label: "Lecture automatique" },
                  { key: "video_loop", label: "Lecture en boucle" },
                  {
                    key: "video_wifi_only",
                    label: "Lecture en Wi-Fi uniquement",
                  },
                  {
                    key: "video_data_saver",
                    label: "Économie de données mobiles",
                  },
                  { key: "video_subtitles", label: "Affichage des sous-titres" },
                  {
                    key: "video_muted",
                    label: "Mode silencieux par défaut",
                  },
                ].map((item) => {
                  const k = item.key as keyof UserSettingsState;
                  return (
                    <label
                      key={item.key}
                      className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3 cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(settings[k])}
                        onChange={(e) =>
                          setSettings({ ...settings, [k]: e.target.checked })
                        }
                        className="h-4 w-4 accent-lime-400"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="space-y-1 flex-1 min-w-[200px]">
                  <span className="text-gray-400">Qualité vidéo</span>
                  <select
                    value={settings.video_quality}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        video_quality: e.target.value as VideoQuality,
                      })
                    }
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                  >
                    <option value="auto">Automatique</option>
                    <option value="360p">360p</option>
                    <option value="480p">480p</option>
                    <option value="720p">720p</option>
                    <option value="1080p">1080p (si disponible)</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    document.documentElement
                      .requestFullscreen?.()
                      .catch(() => null)
                  }
                  disabled={!fullscreenTestSupported}
                  className="rounded-xl bg-white/10 px-4 py-2.5 font-bold disabled:opacity-50"
                >
                  {fullscreenTestSupported
                    ? "Tester le mode plein écran"
                    : "Plein écran non supporté"}
                </button>
              </div>
            </section>

            {/* 4. PARAMÈTRES DE VOIX ET NARRATION IA */}
            <section
              className={`rounded-3xl border p-5 space-y-4 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">{t.secVoice}</h2>

              <label className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3 cursor-pointer">
                <span>Activer la narration vocale IA</span>
                <input
                  type="checkbox"
                  checked={settings.narration_enabled}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      narration_enabled: e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-lime-400"
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="space-y-1">
                  <span className="text-gray-400">Choix de la voix</span>
                  <select
                    value={settings.voice_id}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        voice_id: e.target.value as VoiceProfileId,
                      })
                    }
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                  >
                    {VOICE_OPTIONS.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-gray-400">
                    Langue de narration (indépendante)
                  </span>
                  <select
                    value={settings.narration_lang}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        narration_lang: e.target.value as NarrationLanguage,
                      })
                    }
                    className="w-full rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                  >
                    {NARRATION_LANGUAGES.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="text-gray-400">
                    Volume de la voix ({Math.round(settings.voice_volume * 100)}
                    %)
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.voice_volume}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        voice_volume: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-lime-400"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-gray-400">
                    Vitesse de narration ({settings.narration_rate.toFixed(2)}x)
                  </span>
                  <input
                    type="range"
                    min="0.75"
                    max="1.5"
                    step="0.05"
                    value={settings.narration_rate}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        narration_rate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-lime-400"
                  />
                </label>
              </div>

              <button
                type="button"
                disabled={previewingVoice}
                onClick={handlePreviewVoice}
                className="rounded-full bg-lime-400/20 border border-lime-400/50 px-5 py-2.5 font-bold text-lime-300"
              >
                {previewingVoice ? "Lecture en cours..." : t.previewVoice}
              </button>
            </section>

            {/* 5. NOTIFICATIONS */}
            <section
              className={`rounded-3xl border p-5 space-y-3 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">{t.secNotif}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { key: "notif_workouts", label: "Rappels d'entraînement" },
                  { key: "notif_nutrition", label: "Rappels de nutrition" },
                  {
                    key: "notif_water",
                    label: "Rappels de consommation d'eau",
                  },
                  { key: "notif_daily_goals", label: "Objectifs quotidiens" },
                  { key: "notif_motivation", label: "Motivation" },
                  { key: "notif_premium", label: "Notifications Premium" },
                  { key: "notif_important", label: "Notifications importantes" },
                ].map((n) => {
                  const k = n.key as keyof UserSettingsState;
                  return (
                    <label
                      key={n.key}
                      className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3 cursor-pointer"
                    >
                      <span>{n.label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean(settings[k])}
                        onChange={(e) =>
                          setSettings({ ...settings, [k]: e.target.checked })
                        }
                        className="h-4 w-4 accent-lime-400"
                      />
                    </label>
                  );
                })}
              </div>
            </section>

            {/* 6. CONFIDENTIALITÉ */}
            <section
              className={`rounded-3xl border p-5 space-y-3 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">
                {t.secPrivacy}
              </h2>
              {[
                {
                  key: "private_profile",
                  label: "Profil privé (isolation stricte RLS)",
                },
                {
                  key: "allow_photos",
                  label: "Autoriser le stockage de photos de profil et couverture",
                },
                {
                  key: "allow_sport_analytics",
                  label: "Analyse personnelle des données sportives",
                },
              ].map((p) => {
                const k = p.key as keyof UserSettingsState;
                return (
                  <label
                    key={p.key}
                    className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3 cursor-pointer"
                  >
                    <span>{p.label}</span>
                    <input
                      type="checkbox"
                      checked={Boolean(settings[k])}
                      onChange={(e) =>
                        setSettings({ ...settings, [k]: e.target.checked })
                      }
                      className="h-4 w-4 accent-lime-400"
                    />
                  </label>
                );
              })}
            </section>

            {/* 7. SÉCURITÉ */}
            <section
              className={`rounded-3xl border p-5 space-y-4 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">
                {t.secSecurity}
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="password"
                  placeholder="Nouveau mot de passe (min. 8 car.)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                />
                <input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handlePasswordUpdate}
                  className="rounded-full bg-white/10 px-4 py-2 font-bold"
                >
                  Modifier le mot de passe
                </button>
                <button
                  type="button"
                  onClick={handleSignOutOthers}
                  className="rounded-full bg-white/10 px-4 py-2 font-bold"
                >
                  {t.signOutOthers}
                </button>
                <button
                  type="button"
                  onClick={handleSecureSignOut}
                  className="rounded-full bg-red-500/20 border border-red-500/40 px-4 py-2 font-bold text-red-200"
                >
                  {t.signOut}
                </button>
              </div>

              <div className="rounded-xl bg-black/30 p-3 text-xs text-gray-300 space-y-1">
                <p>
                  Authentification à deux facteurs (2FA) :{" "}
                  {mfaFactorsCount > 0
                    ? `${mfaFactorsCount} facteur(s) vérifié(s)`
                    : "Aucun facteur 2FA actif"}
                </p>
                <p>
                  Dernière connexion :{" "}
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "Inconnue"}
                </p>
                <p>
                  Récupération du compte :{" "}
                  <Link
                    href="/forgot-password"
                    className="text-lime-400 underline"
                  >
                    Réinitialiser via e-mail
                  </Link>
                </p>
              </div>
            </section>

            {/* 8. ABONNEMENT PREMIUM */}
            <section
              className={`rounded-3xl border p-5 space-y-3 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">
                {t.secPremium}
              </h2>
              {subscription ? (
                <div className="space-y-1 text-sm">
                  <p>
                    Formule actuelle :{" "}
                    <strong className="uppercase">{subscription.plan_name}</strong>
                  </p>
                  <p>Statut : {subscription.status}</p>
                  <p>
                    Renouvellement :{" "}
                    {subscription.current_period_end
                      ? new Date(
                          subscription.current_period_end
                        ).toLocaleDateString()
                      : "Non applicable"}
                  </p>
                </div>
              ) : (
                <p className="text-gray-400">
                  Aucun abonnement payant actif trouvé dans le système de
                  paiement pour ce compte (Formule Gratuite).
                </p>
              )}
            </section>

            {/* 9. APPARENCE */}
            <section
              className={`rounded-3xl border p-5 space-y-4 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">
                {t.secAppearance}
              </h2>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "dark", label: "Mode sombre" },
                    { id: "light", label: "Mode clair" },
                    { id: "auto", label: "Mode automatique" },
                  ] as const
                ).map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, theme_mode: mode.id })
                    }
                    className={`px-4 py-2 rounded-full font-bold ${
                      settings.theme_mode === mode.id
                        ? "bg-lime-400 text-black"
                        : "bg-white/10"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { id: "small", label: "Texte compact" },
                    { id: "normal", label: "Texte normal" },
                    { id: "large", label: "Grand texte" },
                  ] as const
                ).map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() =>
                      setSettings({ ...settings, text_scale: sz.id })
                    }
                    className={`px-4 py-2 rounded-full font-bold ${
                      settings.text_scale === sz.id
                        ? "bg-lime-400 text-black"
                        : "bg-white/10"
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>

              <label className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3 cursor-pointer">
                <span>Réduction des animations</span>
                <input
                  type="checkbox"
                  checked={settings.reduce_motion}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      reduce_motion: e.target.checked,
                    })
                  }
                  className="h-4 w-4 accent-lime-400"
                />
              </label>
            </section>

            {/* 10. ASSISTANCE */}
            <section
              className={`rounded-3xl border p-5 space-y-4 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">
                {t.secSupport}
              </h2>

              <div className="grid gap-3">
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                >
                  <option value="technique">
                    Rapport de problème technique
                  </option>
                  <option value="compte">Compte & sécurité</option>
                  <option value="abonnement">Abonnement & facturation</option>
                  <option value="question">Question générale / FAQ</option>
                </select>

                <input
                  type="text"
                  placeholder="Sujet de la demande"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="rounded-xl bg-black/40 border border-white/15 px-3 py-2.5"
                />

                <textarea
                  rows={3}
                  placeholder="Décrivez précisément votre demande ou problème..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="rounde                />

                <button
                  type="button"
                  disabled={sendingTicket}
                  onClick={handleCreateTicket}
                  className="rounded-full bg-white/10 px-5 py-2.5 font-bold"
                >
                  {sendingTicket
                    ? "Envoi en cours..."
                    : "Envoyer la demande à l'assistance"}
                </button>
              </div>

              {tickets.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="font-bold text-gray-300">Vos demandes suivies :</p>
                  {tickets.map((tk) => (
                    <div
                      key={tk.id}
                      className="rounded-xl bg-black/30 p-3 text-xs space-y-1"
                    >
                      <div className="flex justify-between">
                        <strong>{tk.subject}</strong>
                        <span className="text-lime-400 uppercase">
                          {tk.status}
                        </span>
                      </div>
                      <p className="text-gray-400">{tk.message}</p>
                      {tk.admin_reply && (
                        <p className="text-lime-300 pt-1">
                          Réponse support : {tk.admin_reply}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 11. GESTION DES DONNÉES */}
            <section
              className={`rounded-3xl border p-5 space-y-4 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">{t.secData}</h2>

              <label className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3 cursor-pointer">
                <span>Sauvegarde automatique et synchronisation cloud</span>
                <input
                  type="checkbox"
                  checked={settings.auto_backup}
                  onChange={(e) =>
                    setSettings({ ...settings, auto_backup: e.target.checked })
                  }
                  className="h-4 w-4 accent-lime-400"
                />
              </label>

              <button
                type="button"
                onClick={handleExportUserData}
                className="rounded-full bg-white/10 px-5 py-2.5 font-bold"
              >
                {t.exportData}
              </button>

              <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-4 space-y-3">
                <p className="text-xs text-red-200">
                  Zone irréversible : tapez <strong>SUPPRIMER</strong> pour
                  effacer définitivement votre compte et toutes vos données.
                </p>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Tapez SUPPRIMER"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="rounded-xl bg-black/50 border border-red-500/40 px-3 py-2"
                  />
                  <button
                    type="button"
                    disabled={deletingAccount}
                    onClick={handleDeleteAccount}
                    className="rounded-full bg-red-600 px-4 py-2 font-black text-white"
                  >
                    {deletingAccount ? "Suppression..." : t.deleteAccount}
                  </button>
                </div>
              </div>
            </section>

            {/* 12. INFORMATIONS */}
            <section
              className={`rounded-3xl border p-5 space-y-2 ${cardThemeClass}`}
            >
              <h2 className="text-lg font-black text-lime-400">{t.secAbout}</h2>
              <p>Application : FIT PRO — Plateforme d&apos;entraînement personnel</p>
              <p>Version : 1.0.0</p>
              <p className="text-xs text-gray-400">
                Confidentialité : vos données sont isolées par identifiant
                utilisateur et protégées par politiques RLS Supabase.
              </p>
            </section>

            {/* BOUTON PRINCIPAL D'ENREGISTREMENT */}
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveAll}
              className="w-full py-4 rounded-full font-black text-base bg-lime-400 text-black shadow-lg shadow-lime-400/20 disabled:opacity-60"
            >
              {saving ? t.saving : t.saveAll}
            </button>
          </>
        )}
      </div>
    </div>
  );
                  }
