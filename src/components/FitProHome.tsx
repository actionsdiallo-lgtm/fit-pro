"use client";

import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";

const LANGS = ["fr", "en", "es", "ar", "pt", "de", "it", "wo"] as const;
type LangCode = (typeof LANGS)[number];
type MotionKind = "squat" | "push" | "jack" | "core" | "stretch" | "hinge";
type TabKey = "home" | "workouts" | "progress" | "settings";

interface ExerciseSpec {
  id: string;
  name: string;
  muscle: string;
  motion: MotionKind;
  sets: number;
  repsOrSec: string;
  durationSec: number;
  restSec: number;
  hasJump: boolean;
  instructions: string;
}

interface WorkoutSpec {
  id: string;
  title: string;
  description: string;
  photoUrl: string;
  photoFallback: string;
  durationMin: number;
  level: "Débutant" | "Intermédiaire" | "Tous niveaux";
  equipment: "Aucun" | "Tapis" | "Chaise / Mur";
  bodyZone: "Full Body" | "Haut du corps" | "Jambes & Fessiers" | "Abdos" | "Cardio" | "Mobilité & Dos";
  caloriesEst: number;
  hasJump: boolean;
  safetyNotes: string[];
  exercises: ExerciseSpec[];
}

interface UserPreferenceData {
  id: number;
  langue: string;
  bipActif: boolean;
  vibrationActive: boolean;
  garderEcranAllume: boolean;
  avertissementSanteAccepte: boolean;
}

interface SessionLog {
  id: string;
  workoutTitle: string;
  exerciseName: string;
  completedAt: string;
  durationSec: number;
}

const UI_TEXT: Record<
  LangCode,
  {
    greeting: string;
    heroTitle: string;
    heroSub: string;
    weeklyGoal: string;
    weeklyDesc: string;
    todayPlan: string;
    popularTitle: string;
    progressTitle: string;
    workoutsPageTitle: string;
    searchPlaceholder: string;
    allOption: string;
    durationLabel: string;
    levelLabel: string;
    equipmentLabel: string;
    zoneLabel: string;
    jumpFilterLabel: string;
    withJump: string;
    withoutJump: string;
    seeProgram: string;
    startBtn: string;
    backToList: string;
    exercisesCount: string;
    setsLabel: string;
    restLabel: string;
    safetyTitle: string;
    tabHome: string;
    tabWorkouts: string;
    tabProgress: string;
    tabSettings: string;
  }
> = {
  fr: {
    greeting: "Bonjour, Athlète",
    heroTitle: "Forge ta discipline. Dépasse tes limites.",
    heroSub: "Entraînements complets, suivi intelligent et mode hors ligne sur tous vos écrans.",
    weeklyGoal: "OBJECTIF HEBDOMADAIRE",
    weeklyDesc: "Restez régulier pour progresser durablement.",
    todayPlan: "Programme du jour",
    popularTitle: "Programmes populaires",
    progressTitle: "Statistiques & Progression",
    workoutsPageTitle: "Entraînement • 10 Programmes",
    searchPlaceholder: "Rechercher un programme ou un exercice...",
    allOption: "Tous",
    durationLabel: "Durée",
    levelLabel: "Niveau",
    equipmentLabel: "Matériel",
    zoneLabel: "Zone du corps",
    jumpFilterLabel: "Sauts",
    withJump: "Avec saut",
    withoutJump: "Sans saut",
    seeProgram: "Voir le programme",
    startBtn: "Commencer",
    backToList: "Retour aux programmes",
    exercisesCount: "exercices",
    setsLabel: "Séries",
    restLabel: "Repos",
    safetyTitle: "Consignes de sécurité",
    tabHome: "Accueil",
    tabWorkouts: "Entraînement",
    tabProgress: "Progression",
    tabSettings: "Réglages",
  },
  en: {
    greeting: "Hello, Athlete",
    heroTitle: "Build Discipline. Be Unstoppable.",
    heroSub: "Structured workouts, live tracking, and offline support across every screen.",
    weeklyGoal: "WEEKLY GOAL",
    weeklyDesc: "Stay consistent to achieve lasting progress.",
    todayPlan: "Today's Plan",
    popularTitle: "Popular Workouts",
    progressTitle: "Stats & Progress",
    workoutsPageTitle: "Workouts • 10 Programs",
    searchPlaceholder: "Search a program or exercise...",
    allOption: "All",
    durationLabel: "Duration",
    levelLabel: "Level",
    equipmentLabel: "Equipment",
    zoneLabel: "Body zone",
    jumpFilterLabel: "Jumps",
    withJump: "With jump",
    withoutJump: "No jump",
    seeProgram: "View program",
    startBtn: "Start",
    backToList: "Back to programs",
    exercisesCount: "exercises",
    setsLabel: "Sets",
    restLabel: "Rest",
    safetyTitle: "Safety guidelines",
    tabHome: "Home",
    tabWorkouts: "Workouts",
    tabProgress: "Progress",
    tabSettings: "Settings",
  },
  es: {
    greeting: "Hola, Atleta",
    heroTitle: "Crea disciplina. Sé imparable.",
    heroSub: "Rutinas completas, progreso real y modo sin conexión en todos tus dispositivos.",
    weeklyGoal: "OBJETIVO SEMANAL",
    weeklyDesc: "Mantén la constancia para avanzar cada semana.",
    todayPlan: "Plan de hoy",
    popularTitle: "Programas populares",
    progressTitle: "Estadísticas y progreso",
    workoutsPageTitle: "Entrenamiento • 10 Programas",
    searchPlaceholder: "Buscar programa o ejercicio...",
    allOption: "Todos",
    durationLabel: "Duración",
    levelLabel: "Nivel",
    equipmentLabel: "Material",
    zoneLabel: "Zona corporal",
    jumpFilterLabel: "Saltos",
    withJump: "Con salto",
    withoutJump: "Sin salto",
    seeProgram: "Ver programa",
    startBtn: "Empezar",
    backToList: "Volver a programas",
    exercisesCount: "ejercicios",
    setsLabel: "Series",
    restLabel: "Descanso",
    safetyTitle: "Pautas de seguridad",
    tabHome: "Inicio",
    tabWorkouts: "Entrenar",
    tabProgress: "Progreso",
    tabSettings: "Ajustes",
  },
  ar: {
    greeting: "مرحباً، أيها الرياضي",
    heroTitle: "اصنع انضباطك. كن لا يُقهر.",
    heroSub: "حصص تدريبية متكاملة وتتبع مباشر وعمل دون إنترنت على جميع الأجهزة.",
    weeklyGoal: "الهدف الأسبوعي",
    weeklyDesc: "حافظ على الاستمرارية لتحقيق تقدم مستمر.",
    todayPlan: "برنامج اليوم",
    popularTitle: "البرامج الشائعة",
    progressTitle: "الإحصائيات والتقدم",
    workoutsPageTitle: "التدريب • 10 برامج",
    searchPlaceholder: "ابحث عن برنامج أو تمرين...",
    allOption: "الكل",
    durationLabel: "المدة",
    levelLabel: "المستوى",
    equipmentLabel: "المعدات",
    zoneLabel: "منطقة الجسم",
    jumpFilterLabel: "القفز",
    withJump: "مع قفز",
    withoutJump: "بدون قفز",
    seeProgram: "عرض البرنامج",
    startBtn: "ابدأ",
    backToList: "العودة إلى البرامج",
    exercisesCount: "تمارين",
    setsLabel: "المجموعات",
    restLabel: "الراحة",
    safetyTitle: "إرشادات السلامة",
    tabHome: "الرئيسية",
    tabWorkouts: "التدريب",
    tabProgress: "التقدم",
    tabSettings: "الإعدادات",
  },
  pt: {
    greeting: "Olá, Atleta",
    heroTitle: "Crie disciplina. Seja imparável.",
    heroSub: "Treinos completos, acompanhamento e modo offline em qualquer tela.",
    weeklyGoal: "META SEMANAL",
    weeklyDesc: "Mantenha a constância para evoluir sempre.",
    todayPlan: "Plano de hoje",
    popularTitle: "Treinos populares",
    progressTitle: "Estatísticas e progresso",
    workoutsPageTitle: "Treinos • 10 Programas",
    searchPlaceholder: "Buscar programa ou exercício...",
    allOption: "Todos",
    durationLabel: "Duração",
    levelLabel: "Nível",
    equipmentLabel: "Equipamento",
    zoneLabel: "Zona do corpo",
    jumpFilterLabel: "Saltos",
    withJump: "Com salto",
    withoutJump: "Sem salto",
    seeProgram: "Ver programa",
    startBtn: "Começar",
    backToList: "Voltar aos programas",
    exercisesCount: "exercícios",
    setsLabel: "Séries",
    restLabel: "Descanso",
    safetyTitle: "Orientações de segurança",
    tabHome: "Início",
    tabWorkouts: "Treinos",
    tabProgress: "Progresso",
    tabSettings: "Ajustes",
  },
  de: {
    greeting: "Hallo, Athlet",
    heroTitle: "Aufbaue Disziplin. Sei unaufhaltsam.",
    heroSub: "Strukturiertes Training, Fortschritt und Offline-Modus auf jedem Gerät.",
    weeklyGoal: "WOCHENZIEL",
    weeklyDesc: "Bleib konsequent für nachhaltigen Fortschritt.",
    todayPlan: "Heutiger Plan",
    popularTitle: "Beliebte Programme",
    progressTitle: "Statistiken & Fortschritt",
    workoutsPageTitle: "Training • 10 Programme",
    searchPlaceholder: "Programm oder Übung suchen...",
    allOption: "Alle",
    durationLabel: "Dauer",
    levelLabel: "Niveau",
    equipmentLabel: "Ausrüstung",
    zoneLabel: "Körperzone",
    jumpFilterLabel: "Sprünge",
    withJump: "Mit Sprung",
    withoutJump: "Ohne Sprung",
    seeProgram: "Programm ansehen",
    startBtn: "Starten",
    backToList: "Zurück zu Programmen",
    exercisesCount: "Übungen",
    setsLabel: "Sätze",
    restLabel: "Pause",
    safetyTitle: "Sicherheitshinweise",
    tabHome: "Start",
    tabWorkouts: "Training",
    tabProgress: "Fortschritt",
    tabSettings: "Einstellungen",
  },
  it: {
    greeting: "Ciao, Atleta",
    heroTitle: "Crea disciplina. Sii inarrestabile.",
    heroSub: "Allenamenti completi, monitoraggio e modalità offline su ogni schermo.",
    weeklyGoal: "OBIETTIVO SETTIMANALE",
    weeklyDesc: "Mantieni la costanza per crescere ogni settimana.",
    todayPlan: "Piano di oggi",
    popularTitle: "Allenamenti popolari",
    progressTitle: "Statistiche e progressi",
    workoutsPageTitle: "Allenamenti • 10 Programmi",
    searchPlaceholder: "Cerca programma o esercizio...",
    allOption: "Tutti",
    durationLabel: "Durata",
    levelLabel: "Livello",
    equipmentLabel: "Attrezzatura",
    zoneLabel: "Zona del corpo",
    jumpFilterLabel: "Salti",
    withJump: "Con salto",
    withoutJump: "Senza salto",
    seeProgram: "Vedi programma",
    startBtn: "Inizia",
    backToList: "Torna ai programmi",
    exercisesCount: "esercizi",
    setsLabel: "Serie",
    restLabel: "Recupero",
    safetyTitle: "Norme di sicurezza",
    tabHome: "Home",
    tabWorkouts: "Allenamenti",
    tabProgress: "Progressi",
    tabSettings: "Impostazioni",
  },
  wo: {
    greeting: "Salaamaalekum, Taawkat",
    heroTitle: "Dëgëral sag jikko. Bul taxaw.",
    heroSub: "Tàggat yu mat, topato bu wóor ak jëfandikoo te amul internet ci bépp ekran.",
    weeklyGoal: "MBEGGALUM AYU-BES",
    weeklyDesc: "Wéyal tàggat bi ngir gëna jëm kanam.",
    todayPlan: "Porogaramu tay",
    popularTitle: "Porogaram yu siiw",
    progressTitle: "Lim ak jëm kanam",
    workoutsPageTitle: "Tàggat • 10 Porogaram",
    searchPlaceholder: "Seet porogaram walla tàggat...",
    allOption: "Yépp",
    durationLabel: "Waxtu",
    levelLabel: "Tolluwaay",
    equipmentLabel: "Jumtukaay",
    zoneLabel: "Wàllu yaram",
    jumpFilterLabel: "Tàbb",
    withJump: "Am na tàbb",
    withoutJump: "Amul tàbb",
    seeProgram: "Xool porogaram bi",
    startBtn: "Tàmbali",
    backToList: "Dellu ci porogaram yi",
    exercisesCount: "tàggat",
    setsLabel: "Wàll",
    restLabel: "Noflaay",
    safetyTitle: "Aarukaayu wér gi yaram",
    tabHome: "Kër",
    tabWorkouts: "Tàggat",
    tabProgress: "Jëm kanam",
    tabSettings: "Jubbanti",
  },
};

function buildTenPrograms(lang: LangCode): WorkoutSpec[] {
  const tr = (fr: string, en: string, ar: string, wo: string, es?: string, pt?: string, de?: string, it?: string) => {
    if (lang === "fr") return fr;
    if (lang === "en") return en;
    if (lang === "ar") return ar;
    if (lang === "wo") return wo;
    if (lang === "es") return es ?? en;
    if (lang === "pt") return pt ?? en;
    if (lang === "de") return de ?? en;
    if (lang === "it") return it ?? en;
    return en;
  };

  return [
    {
      id: "wk-01",
      title: tr("Full Body débutant", "Beginner Full Body", "الجسم كامل للمبتدئين", "Yaram wépp bu njàlbéen", "Cuerpo completo principiante", "Corpo inteiro iniciante", "Ganzkörper Anfänger", "Total body principianti"),
      description: tr(
        "Routine douce et complète à la maison pour bâtir l'endurance et la coordination sans matériel.",
        "Gentle, complete home routine to build endurance and coordination with zero equipment.",
        "حصة منزلية متكاملة وسهلة لبناء التحمل والتناسق بدون معدات.",
        "Tàggat bu neex ci biir kër ngir yokk kàttan ak àndandoo yaram te soxlaul dara."
      ),
      photoUrl: "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=900",
      photoFallback: "https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg?auto=compress&cs=tinysrgb&w=900",
      durationMin: 18,
      level: "Débutant",
      equipment: "Aucun",
      bodyZone: "Full Body",
      caloriesEst: 145,
      hasJump: false,
      safetyNotes: [
        tr("Garde les genoux alignés avec les pointes de pieds.", "Keep knees aligned with your toes.", "حافظ على استقامة الركبتين مع أطراف القدمين.", "Wàccal sa ñàkk te mu ànd ak sa baaraami tànk."),
      ],
      exercises: [
        { id: "e-01-1", name: tr("Squat à la maison", "Home Bodyweight Squat", "قرفصاء في المنزل", "Squat ci biir kër"), muscle: "Quadriceps & Fessiers", motion: "squat", sets: 3, repsOrSec: "12 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Descends les hanches vers l'arrière et pousse sur les talons.", "Push hips back and drive through heels to stand up.", "ادفع الوركين للخلف وانهض بالارتكاز على الكعبين.", "Wàccal sa létt ginnaaw te jël kàttan ci tànk yi.") },
        { id: "e-01-2", name: tr("Pompes sur genoux", "Knee Push-Ups", "ضغط على الركبتين", "Pompe ci ñàkk"), muscle: "Pectoraux & Triceps", motion: "push", sets: 3, repsOrSec: "10 reps", durationSec: 30, restSec: 20, hasJump: false, instructions: tr("Garde le bassin gainé et abaisse la poitrine près du sol.", "Keep core braced and lower chest smoothly.", "حافظ على شد البطن وانزل بالصدر بهدوء.", "Dëgëral sa biir te wàccal sa dënk ci suuf.") },
        { id: "e-01-3", name: tr("Marche sur place haute", "High March in Place", "مشي عالٍ في المكان", "Dox ci boppam bu kawe"), muscle: "Hanches & Cardio doux", motion: "jack", sets: 3, repsOrSec: "40s", durationSec: 40, restSec: 20, hasJump: false, instructions: tr("Monte alternativement les genoux et balance les bras.", "Lift knees alternately while swinging arms.", "ارفع الركبتين بالتناوب مع تحريك الذراعين.", "Yékkatil ñàkk yi te yëngal loxo yi.") },
        { id: "e-01-4", name: tr("Crunch abdominal doux", "Gentle Abdominal Crunch", "تمرين كرانش خفيف", "Crunch bu woyof"), muscle: "Abdominaux", motion: "core", sets: 3, repsOrSec: "12 reps", durationSec: 30, restSec: 20, hasJump: false, instructions: tr("Décolle légèrement les omoplates en expirant.", "Lift shoulder blades slightly while exhaling.", "ارفع لوحي الكتف قليلاً مع الزفير.", "Yékkatil sa mbaam ci kaw te di génne ngelaw.") },
        { id: "e-01-5", name: tr("Étirement dos et bras", "Back & Arm Stretch", "إطالة الظهر والذراعين", "Talal gannaaw ak loxo"), muscle: "Dos & Épaules", motion: "stretch", sets: 2, repsOrSec: "30s", durationSec: 30, restSec: 15, hasJump: false, instructions: tr("Allonge la colonne et étire doucement les épaules.", "Lengthen spine and stretch shoulders gently.", "اطل العمود الفقري ومدد الكتفين برفق.", "Talal sa gannaaw te yàggal sa mbaam ndànk.") },
      ],
    },
    {
      id: "wk-02",
      title: tr("Full Body intermédiaire", "Intermediate Full Body", "الجسم كامل للمتوسطين", "Yaram wépp bu diggu", "Cuerpo completo intermedio", "Corpo inteiro intermediário", "Ganzkörper Fortgeschrittene", "Total body intermedio"),
      description: tr(
        "Séance dynamique combinant puissance musculaire, rythme cardio et gainage complet.",
        "Dynamic workout combining muscular power, cardio pace, and full-body core stability.",
        "حصة ديناميكية تجمع بين القوة العضلية والكارديو وثبات الجذع.",
        "Tàggat bu woyof te am kàttan ngir yokk doole yaram ak wér gu yaram."
      ),
      photoUrl: "https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=900",
      photoFallback: "https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=900",
      durationMin: 25,
      level: "Intermédiaire",
      equipment: "Tapis",
      bodyZone: "Full Body",
      caloriesEst: 230,
      hasJump: true,
      safetyNotes: [
        tr("Amortis chaque réception souplement sur l'avant du pied.", "Land softly on the balls of your feet.", "اهبط بخفة على مقدمة القدمين.", "Wàccal ndànk ci kanamu tànk yi."),
      ],
      exercises: [
        { id: "e-02-1", name: tr("Burpee contrôlé", "Controlled Burpee", "بيربي متحكم به", "Burpee bu ànd ak sàkku"), muscle: "Full Body & Cardio", motion: "jack", sets: 4, repsOrSec: "10 reps", durationSec: 40, restSec: 25, hasJump: true, instructions: tr("Passe en planche, ramène les pieds et réalise une extension dynamique.", "Step or jump to plank, return feet, and extend cleanly.", "انتقل إلى البلانك ثم عد وانهض بثبات.", "Démb ci planche, delloo tànk yi te jóg bu baax.") },
        { id: "e-02-2", name: tr("Squat sauté léger", "Light Jump Squat", "قرفصاء مع قفز خفيف", "Squat ak tàbb bu néew"), muscle: "Quadriceps & Fessiers", motion: "squat", sets: 4, repsOrSec: "12 reps", durationSec: 35, restSec: 25, hasJump: true, instructions: tr("Descends en squat puis pousse vers le haut sans à-coup brutal.", "Lower into squat then drive up smoothly.", "انزل في القرفصاء ثم ادفع للأعلى بسلاسة.", "Wàccal ci squat te yékkatu ndànk.") },
        { id: "e-02-3", name: tr("Pompes complètes", "Standard Push-Ups", "تمارين الضغط الكاملة", "Pompe bu mat"), muscle: "Pectoraux, Bras & Core", motion: "push", sets: 4, repsOrSec: "12 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Corps gainé de la tête aux talons, pousse fort sur les mains.", "Body in a straight plank line, press through palms.", "الجسم مستقيم من الرأس إلى القدمين مع الدفع باليدين.", "Yaram bi jub na ba ci tànk yi, jëfandikoo loxo yi.") },
        { id: "e-02-4", name: tr("Gainage dynamique", "Dynamic Plank Tap", "بلانك حركي", "Planche bu yëngu"), muscle: "Sangle abdominale", motion: "core", sets: 3, repsOrSec: "40s", durationSec: 40, restSec: 20, hasJump: false, instructions: tr("Stabilise le bassin tout en touchant l'épaule opposée.", "Keep hips still while tapping opposite shoulder.", "ثبت الحوض مع لمس الكتف المقابل.", "Dëgëral létt bi te laal mbaam mi ci loxo bi.") },
        { id: "e-02-5", name: tr("Good morning buste", "Hip Hinge Good Morning", "انحناء الجذع للأمام", "Wàccal wàll gi kanam"), muscle: "Ischios & Lombaires", motion: "hinge", sets: 3, repsOrSec: "14 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Pousse les fessiers vers l'arrière avec le dos bien plat.", "Push glutes back with a flat back.", "ادفع المؤخرة للخلف مع الحفاظ على الظهر مسطحاً.", "Wàccal létt gi ginnaaw te gannaaw gi jub.") },
      ],
    },
    {
      id: "wk-03",
      title: tr("Haut du corps", "Upper Body", "الجزء العلوي من الجسم", "Wàllu kawu yaram", "Tren superior", "Parte superior", "Oberkörper", "Parte superiore"),
      description: tr(
        "Renforce les pectoraux, le dos et les épaules pour une posture ferme et tonique.",
        "Strengthens chest, upper back, and shoulders for a strong, upright posture.",
        "يقوي الصدر وأعلى الظهر والكتفين لقوام مشدود.",
        "Dëgëral dënk bi, gannaaw gi ak mbaam yi ngir yaram bi taxaw bu baax."
      ),
      photoUrl: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=900",
      photoFallback: "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=900",
      durationMin: 20,
      level: "Tous niveaux",
      equipment: "Tapis",
      bodyZone: "Haut du corps",
      caloriesEst: 165,
      hasJump: false,
      safetyNotes: [
        tr("Évite de hausser les épaules vers les oreilles.", "Avoid shrugging shoulders up toward your ears.", "تجنب رفع الكتفين نحو الأذنين.", "Bul yékkati mbaam yi ba ci nopp yi."),
      ],
      exercises: [
        function buildMorePrograms(lang: LangCode): WorkoutSpec[] {
  const tr = (fr: string, en: string, ar: string, wo: string, es?: string, pt?: string, de?: string, it?: string) => {
    if (lang === "fr") return fr;
    if (lang === "en") return en;
    if (lang === "ar") return ar;
    if (lang === "wo") return wo;
    if (lang === "es") return es ?? en;
    if (lang === "pt") return pt ?? en;
    if (lang === "de") return de ?? en;
    if (lang === "it") return it ?? en;
    return en;
  };
    
    if (lang === "wo") return wo;
    if (lang === "es") return es ?? en;
    if (lang === "pt") return pt ?? en;
    if (lang === "de") return de ?? en;
    if (lang === "it") return it ?? en;
    return en;
  };
function buildMorePrograms(lang: LangCode): WorkoutSpec[] {
  const tr = (fr: string, en: string, ar: string, wo: string, es?: string, pt?: string, de?: string, it?: string) => {
      
  return [
    {
      id: "wk-06",
      title: tr("Cardio HIIT", "Cardio HIIT", "كارديو HIIT عالي الكثافة", "Cardio HIIT bu gaaw", "Cardio HIIT", "Cardio HIIT", "Cardio HIIT", "Cardio HIIT"),
      description: tr(
        "Intervalles dynamiques pour stimuler le cardio et brûler des calories.",
        "Dynamic intervals to boost heart rate and burn calories.",
        "فترات ديناميكية لتنشيط القلب وحرق السعرات.",
        "Tàggat bu gaaw ngir yëngal xol bi te wàññi kalorii."
      ),
      photoUrl: "https://images.pexels.com/photos/4761792/pexels-photo-4761792.jpeg?auto=compress&cs=tinysrgb&w=900",
      photoFallback: "https://images.pexels.com/photos/4753986/pexels-photo-4753986.jpeg?auto=compress&cs=tinysrgb&w=900",
      durationMin: 15,
      level: "Intermédiaire",
      equipment: "Aucun",
      bodyZone: "Cardio",
      caloriesEst: 210,
      hasJump: true,
      safetyNotes: [
        tr("Ajuste le rythme si l'essoufflement devient trop fort.", "Slow down if breathing becomes too heavy.", "خفف السرعة إذا أصبح التنفس ثقيلاً جداً.", "Wàññil dox bi su noyi bi gëna metti."),
      ],
      exercises: [
        { id: "e-06-1", name: tr("Jumping jacks", "Jumping Jacks", "قفزات النجمة", "Jumping jacks"), muscle: "Cardio & Épaules", motion: "jack", sets: 4, repsOrSec: "40s", durationSec: 40, restSec: 20, hasJump: true, instructions: tr("Ouvre pieds et bras en rythme puis reviens au centre.", "Jump feet wide and raise arms overhead, then return.", "افتح القدمين والذراعين بإيقاع ثم عد للمنتصف.", "Ubbil tànk ak loxo yi ci dox bu wóor.") },
        { id: "e-06-2", name: tr("Montées de genoux rapides", "Fast High Knees", "رفع الركبتين سريعاً", "Yékkati ñàkk bu gaaw"), muscle: "Cardio & Jambes", motion: "jack", sets: 4, repsOrSec: "35s", durationSec: 35, restSec: 20, hasJump: true, instructions: tr("Garde le buste droit et dynamise l'appui des pieds.", "Stay tall and keep foot contacts quick.", "حافظ على استقامة الجذع واجعل لمس القدم سريعاً.", "Taxawal bu jub te yékkati tànk yi bu gaaw.") },
        { id: "e-06-3", name: tr("Squat impulsion", "Pulse Squat", "قرفصاء نبضية", "Squat bu yëngu"), muscle: "Cuisses & Fessiers", motion: "squat", sets: 3, repsOrSec: "30s", durationSec: 30, restSec: 20, hasJump: false, instructions: tr("Fais de petites impulsions dans la zone basse du squat.", "Pulse gently in the lower range of the squat.", "قم بنبضات صغيرة في الجزء السفلي للقرفصاء.", "Defal yëngu yu néew ci suufu squat bi.") },
        { id: "e-06-4", name: tr("Pompe + planche rapide", "Push-Up to Plank Flow", "دمج الضغط والبلانك", "Pompe ak planche"), muscle: "Haut du corps & Core", motion: "push", sets: 3, repsOrSec: "10 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Enchaîne proprement sans perdre l'alignement.", "Transition smoothly without losing alignment.", "انتقل بسلاسة دون فقدان الاستقامة.", "Démbal bu baax te bul wàccal jub gi.") },
      ],
    },
    {
      id: "wk-07",
      title: tr("Mobilité", "Mobility", "المرونة والحركية", "Woyofal yaram", "Movilidad", "Mobilidade", "Mobilität", "Mobilità"),
      description: tr(
        "Améliore la souplesse articulaire et la fluidité des mouvements au quotidien.",
        "Improves joint flexibility and everyday movement fluidity.",
        "يحسن مرونة المفاصل وسلاسة الحركة اليومية.",
        "Yokk woyofu yaram ak yaatuwaayu dundu bes bu nekk."
      ),
      photoUrl: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=900",
      photoFallback: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=900",
      durationMin: 15,
      level: "Débutant",
      equipment: "Tapis",
      bodyZone: "Mobilité & Dos",
      caloriesEst: 95,
      hasJump: false,
      safetyNotes: [
        tr("Recherche un étirement confortable, jamais une douleur vive.", "Aim for a gentle stretch, never sharp pain.", "ابحث عن إطالة مريحة دون ألم حاد.", "Seetal talal bu neex te bul dugg ci metti."),
      ],
      exercises: [
        { id: "e-07-1", name: tr("Étirement latéral du buste", "Side Bend Stretch", "إطالة جانبية للجذع", "Talal wàll ci wet"), muscle: "Flancs", motion: "stretch", sets: 3, repsOrSec: "30s", durationSec: 30, restSec: 15, hasJump: false, instructions: tr("Incline doucement le buste sur le côté.", "Bend torso gently sideways while keeping hips grounded.", "انحنِ بالجانب بلطف مع ثبات الحوض.", "Wàññil wàll gi ci wet ndànk.") },
        { id: "e-07-2", name: tr("Squat mobilité hanches", "Hip Mobility Squat", "قرفصاء مرونة الورك", "Squat ngir woyofal létt"), muscle: "Hanches & Chevilles", motion: "squat", sets: 3, repsOrSec: "35s", durationSec: 35, restSec: 15, hasJump: false, instructions: tr("Descends lentement pour ouvrir les hanches en douceur.", "Lower slowly to open hips comfortably.", "انزل ببطء لفتح الوركين براحة.", "Wàccal ndànk ngir ubbi létt yi.") },
        { id: "e-07-3", name: tr("Étirement chaîne arrière", "Posterior Stretch Flow", "إطالة السلسلة الخلفية", "Talal gannaaw"), muscle: "Dos & Jambes", motion: "stretch", sets: 3, repsOrSec: "35s", durationSec: 35, restSec: 15, hasJump: false, instructions: tr("Allonge les bras et pousse doucement les talons vers le sol.", "Reach long through arms and press heels gently down.", "مد الذراعين وادفع الكعبين بلطف نحو الأرض.", "Tàllalal loxo yi te wàccal tànk yi.") },
        { id: "e-07-4", name: tr("Rotation thoracique", "Thoracic Reach", "حركة دوران الصدر", "Wëñal dënk"), muscle: "Thorax & Épaules", motion: "stretch", sets: 2, repsOrSec: "30s", durationSec: 30, restSec: 15, hasJump: false, instructions: tr("Tourne le buste sans forcer.", "Rotate upper back smoothly without forcing.", "أدر الجزء العلوي للظهر بلطف.", "Wëñalal wàllu kaw gi ndànk.") },
      ],
    },
    {
      id: "wk-08",
      title: tr("Dos et posture", "Back & Posture", "الظهر والقوام", "Gannaaw ak taxawaay", "Espalda y postura", "Costas e postura", "Rücken & Haltung", "Schiena e postura"),
      description: tr(
        "Renforce le dos et améliore la posture face aux écrans et à la position assise.",
        "Strengthens the back and improves posture for desk and daily life.",
        "يقوي الظهر ويحسن القوام أثناء الجلوس اليومي.",
        "Dëgëral gannaaw gi te taxawal yaram bi bu baax."
      ),
      photoUrl: "https://images.pexels.com/photos/4056535/pexels-photo-4056535.jpeg?auto=compress&cs=tinysrgb&w=900",
      photoFallback: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=900",
      durationMin: 18,
      level: "Débutant",
      equipment: "Tapis",
      bodyZone: "Mobilité & Dos",
      caloriesEst: 120,
      hasJump: false,
      safetyNotes: [
        tr("Garde la nuque longue dans l'alignement de la colonne.", "Keep neck neutral in line with your spine.", "حافظ على استقامة الرقبة مع العمود الفقري.", "Wàccal waxambaane wi mu ànd ak gannaaw gi."),
      ],
      exercises: [
        { id: "e-08-1", name: tr("Extension dorsale douce", "Gentle Back Extension", "تمديد الظهر بلطف", "Tàllal gannaaw bu neex"), muscle: "Muscles spinaux", motion: "hinge", sets: 3, repsOrSec: "12 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Soulève légèrement la poitrine en serrant les omoplates.", "Lift chest slightly while drawing shoulder blades together.", "ارفع الصدر قليلاً مع ضم لوحي الكتف.", "Yékkatil dënk bi tuuti te boole mbaam yi.") },
        { id: "e-08-2", name: tr("Pont fessier lombaire", "Glute Bridge", "جسر الحوض والظهر", "Pont ngir létt ak gannaaw"), muscle: "Fessiers & Lombaires", motion: "core", sets: 3, repsOrSec: "14 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Monte le bassin jusqu'à aligner genoux, hanches et épaules.", "Lift hips until knees, hips, and shoulders align.", "ارفع الحوض حتى تستقيم الركبتان والوركان والكتفان.", "Yékkatil létt bi ba ñàkk, létt ak mbaam ànd.") },
        { id: "e-08-3", name: tr("Étirement dorsal", "Back Release Stretch", "إطالة لإراحة الظهر", "Talal ngir woyofal gannaaw"), muscle: "Dos", motion: "stretch", sets: 3, repsOrSec: "30s", durationSec: 30, restSec: 15, hasJump: false, instructions: tr("Allonge le dos et relâche la respiration.", "Lengthen back and breathe calmly.", "مدد الظهر وتنفس بهدوء.", "Tàllalal gannaaw gi te noyi bu dal.") },
        { id: "e-08-4", name: tr("Squat posture droite", "Upright Posture Squat", "قرفصاء باستقامة الظهر", "Squat bu gannaaw jub"), muscle: "Jambes & Posture", motion: "squat", sets: 3, repsOrSec: "12 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Descends en gardant le buste droit et les épaules basses.", "Lower while keeping chest upright and shoulders down.", "انزل مع الحفاظ على استقامة الصدر وخفض الكتفين.", "Wàccal te dënk bi jub, mbaam yi wàcc.") },
      ],
    },
    {
      id: "wk-09",
      title: tr("Bras et épaules", "Arms & Shoulders", "الذراعين والكتفين", "Loxo ak mbaam", "Brazos y hombros", "Braços e ombros", "Arme & Schultern", "Braccia e spalle"),
      description: tr(
        "Cible les dips, épaules et bras pour gagner en tonicité et en endurance.",
        "Targets dips, shoulders, and arms to build muscular tone and endurance.",
        "يستهدف الغطس والكتفين والذراعين لزيادة التناسق والتحمل.",
        "Dëgëral loxo yi ak mbaam yi ngir yokk doole ak wér."
      ),
      photoUrl: "https://images.pexels.com/photos/4162491/pexels-photo-4162491.jpeg?auto=compress&cs=tinysrgb&w=900",
      photoFallback: "https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=900",
      durationMin: 19,
      level: "Intermédiaire",
      equipment: "Chaise / Mur",
      bodyZone: "Haut du corps",
      caloriesEst: 155,
      hasJump: false,
      safetyNotes: [
        tr("Vérifie la stabilité de la chaise ou du mur avant de commencer.", "Make sure your chair or support is stable before starting.", "تأكد من ثبات الكرسي أو الدعامة قبل البدء.", "Wóorlu ne toogu bi walla biir bi taxaw na bu baax."),
      ],
      exercises: [
        { id: "e-09-1", name: tr("Dips sur chaise stable", "Chair Dips", "غطس على كرسي ثابت", "Dips ci toogu bu wóor"), muscle: "Triceps & Épaules", motion: "push", sets: 4, repsOrSec: "10 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Plie les coudes vers l'arrière près du bord puis pousse vers le haut.", "Bend elbows back close to edge and press up.", "اثنِ المرفقين للخلف قرب الحافة ثم ادفع للأعلى.", "Wàññil gëdd yi ginnaaw te yékkatu ci loxo yi.") },
        { id: "e-09-2", name: tr("Pompes inclinées", "Incline Push-Ups", "ضغط مائل", "Pompe bu wàññiku"), muscle: "Pectoraux & Épaules", motion: "push", sets: 3, repsOrSec: "12 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Mains sur support stable, corps aligné.", "Hands on stable surface, body in a straight line.", "اليدان على سطح ثابت والجسم مستقيم.", "Loxo yi ci biir bu wóor, yaram bi jub.") },
        { id: "e-09-3", name: tr("Maintien et extension épaules", "Shoulder Hold & Reach", "ثبات ومد الكتفين", "Taxaw ak tàllal mbaam"), muscle: "Épaules", motion: "core", sets: 3, repsOrSec: "35s", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Maintiens la position avec contrôle.", "Hold position steadily with controlled breathing.", "حافظ على الوضعية بثبات مع تنفس منتظم.", "Taxawal bu baax te noyi bu wóor.") },
        { id: "e-09-4", name: tr("Étirement bras et triceps", "Arm & Triceps Stretch", "إطالة الذراعين", "Talal loxo yi"), muscle: "Bras", motion: "stretch", sets: 2, repsOrSec: "30s", durationSec: 30, restSec: 15, hasJump: false, instructions: tr("Étire doucement l'arrière de chaque bras.", "Gently stretch the back of each arm.", "مدد الجزء الخلفي لكل ذراع برفق.", "Talalal ginnaawu loxo bu nekk ndànk.") },
      ],
    },
    {
      id: "wk-10",
      title: tr("Sans saut", "Low Impact No-Jump", "بدون قفز", "Amul tàbb", "Sin salto", "Sem salto", "Ohne Sprung", "Senza salti"),
      description: tr(
        "Entraînement complet en appartement, silencieux et sans impact sur les articulations.",
        "Quiet, apartment-friendly full workout with zero joint impact.",
        "تمرين متكامل مناسب للشقق بدون قفز أو ضغط على المفاصل.",
        "Tàggat bu mat ci biir kër te amul tàbb walla metti ci yaram."
      ),
      photoUrl: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=900",
      photoFallback: "https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=900",
      durationMin: 20,
      level: "Tous niveaux",
      equipment: "Aucun",
      bodyZone: "Full Body",
      caloriesEst: 160,
      hasJump: false,
      safetyNotes: [
        tr("Mouvements fluides et contrôlés, zéro saut brusque.", "Smooth, controlled movements with zero jarring jumps.", "حركات سلسة ومنضبطة دون قفز مفاجئ.", "Dox yu woyof te ànd ak sàkku, amul tàbb bu metti."),
      ],
      exercises: [
        { id: "e-10-1", name: tr("Squat + élévation douce", "Squat to Calf Raise", "قرفصاء مع رفع الكعبين", "Squat ak yékkati tànk"), muscle: "Jambes & Mollets", motion: "squat", sets: 3, repsOrSec: "14 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Remonte du squat et monte sur demi-pointes sans sauter.", "Stand up from squat and rise onto toes without jumping.", "انهض من القرفصاء ثم قف على أطراف القدمين دون قفز.", "Jógal ci squat te yékkatu ci baaraami tànk te bul tàbb.") },
        { id: "e-10-2", name: tr("Step-jack sans saut", "Step Jack No-Jump", "جامبينغ جاك بدون قفز", "Step jack amul tàbb"), muscle: "Cardio sans impact", motion: "jack", sets: 3, repsOrSec: "40s", durationSec: 40, restSec: 20, hasJump: false, instructions: tr("Écarte un pied après l'autre tout en levant les bras.", "Step one foot out at a time while raising arms.", "حرك قدماً تلو الأخرى جانباً مع رفع الذراعين.", "Yàggal tànk bi ci wet te yékkati loxo yi.") },
        { id: "e-10-3", name: tr("Pompe inclinée calme", "Calm Incline Push-Up", "ضغط مائل هادئ", "Pompe bu woyof"), muscle: "Pectoraux & Épaules", motion: "push", sets: 3, repsOrSec: "12 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: tr("Garde l'alignement et contrôle la descente.", "Maintain alignment and control the lowering phase.", "حافظ على الاستقامة وتحكم في النزول.", "Wàccal ndànk te jubalal yaram bi.") },
        { id: "e-10-4", name: tr("Gainage + étirement final", "Core Hold & Stretch", "ثبات البطن وإطالة ختامية", "Dëgëral biir ak talal"), muscle: "Abdos & Détente", motion: "core", sets: 3, repsOrSec: "35s", durationSec: 35, restSec: 15, hasJump: false, instructions: tr("Termine en douceur par un gainage calme et un étirement.", "Finish smoothly with controlled core hold and stretch.", "اختم بهدوء بثبات للبطن وإطالة خفيفة.", "Jéexalal bu dal ak talal bu neex.") },
      ],
    },
  ];
}

function getAllTenPrograms(lang: LangCode): WorkoutSpec[] {
  return [...buildTenPrograms(lang), ...buildMorePrograms(lang)];
}

function buildAllLangsPack(): Record<LangCode, WorkoutSpec[]> {
  return LANGS.reduce((acc, l) => {
    acc[l] = getAllTenPrograms(l);
    return acc;
  }, {} as Record<LangCode, WorkoutSpec[]>);
}

function playCompletionBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {}
}

function AnimatedSilhouette2D({
  motion,
  isRunning,
  isResting,
  tick,
  size = "md",
}: {
  motion: MotionKind;
  isRunning: boolean;
  isResting: boolean;
  tick: number;
  size?: "sm" | "md";
}) {
  const phase = isRunning && !isResting ? tick % 2 : 0;
  let dy = 0;
  let armAngle = -10;
  let legAngle = 8;

  if (motion === "squat") {
    dy = phase === 1 ? 13 : 0;
    armAngle = phase === 1 ? -40 : -10;
    legAngle = phase === 1 ? 28 : 6;
  } else if (motion === "push") {
    dy = phase === 1 ? 11 : 0;
    armAngle = phase === 1 ? 30 : -12;
  } else if (motion === "jack") {
    dy = phase === 1 ? -7 : 0;
    armAngle = phase === 1 ? -58 : -12;
    legAngle = phase === 1 ? 26 : 8;
  } else if (motion === "core") {
    dy = phase === 1 ? 7 : 0;
    armAngle = phase === 1 ? -24 : -8;
  } else if (motion === "hinge") {
    dy = phase === 1 ? 9 : 0;
    armAngle = phase === 1 ? 20 : -6;
    legAngle = phase === 1 ? 14 : 4;
  } else {
    dy = phase === 1 ? -5 : 0;
    armAngle = phase === 1 ? -46 : -14;
    legAngle = phase === 1 ? 10 : 5;
  }

  const boxClass = size === "sm" ? "w-16 h-16 rounded-xl" : "w-24 h-24 rounded-2xl";
  const svgClass = size === "sm" ? "w-14 h-14 text-[#0B1F3A]" : "w-20 h-20 text-[#0B1F3A]";

  return (
    <div className={`${boxClass} bg-white border border-slate-200 flex items-center justify-center shrink-0`}>
      <svg viewBox="0 0 120 120" className={svgClass} fill="none">
        <g transform={`translate(0, ${dy})`}>
          <circle cx="60" cy="20" r="9" fill="currentColor" />
          <path d="M52 33H68L71 62H49L52 33Z" fill="currentColor" />
          <g transform={`translate(60, 38) rotate(${armAngle})`}>
            <rect x="-3" y="0" width="6" height="24" rx="3" fill="currentColor" />
          </g>
          <g transform={`translate(60, 62) rotate(${legAngle})`}>
            <rect x="-4" y="0" width="8" height="30" rx="4" fill="currentColor" />
          </g>
        </g>
        <line x1="20" y1="102" x2="100" y2="102" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
      }
                                                                                                                                                                                                                                              export default function FitProHome() {
  const [lang, setLang] = useState<LangCode>("fr");
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState<"all" | "short" | "medium">("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [jumpFilter, setJumpFilter] = useState<"all" | "no-jump" | "with-jump">("all");

  const [workouts, setWorkouts] = useState<WorkoutSpec[]>(() => getAllTenPrograms("fr"));
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSpec | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [autoChain, setAutoChain] = useState(true);
  const [tick, setTick] = useState(0);
  const [prefs, setPrefs] = useState<UserPreferenceData>({
    id: 1,
    langue: "fr",
    bipActif: true,
    vibrationActive: true,
    garderEcranAllume: true,
    avertissementSanteAccepte: true,
  });
  const [history, setHistory] = useState<SessionLog[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const wakeLockRef = useRef<{ release?: () => Promise<void> } | null>(null);

  const ui = UI_TEXT[lang] ?? UI_TEXT.fr;

  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem("fpv_history");
      if (rawHistory) setHistory(JSON.parse(rawHistory));
      const rawPrefs = localStorage.getItem("fpv_prefs");
      if (rawPrefs) setPrefs(JSON.parse(rawPrefs));
      const rawPack = localStorage.getItem("fpv_all_langs_pack");
      if (!rawPack) {
        localStorage.setItem("fpv_all_langs_pack", JSON.stringify(buildAllLangsPack()));
      }
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }
    } catch {}
  }, []);

  useEffect(() => {
    const syncWakeLock = async () => {
      try {
        if (prefs.garderEcranAllume && isRunning && "wakeLock" in navigator) {
          const wlApi = navigator as unknown as { wakeLock?: { request?: (t: string) => Promise<{ release?: () => Promise<void> }> } };
          if (!wakeLockRef.current && wlApi.wakeLock?.request) {
            wakeLockRef.current = await wlApi.wakeLock.request("screen");
          }
        } else if (wakeLockRef.current?.release) {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
      } catch {}
    };
    syncWakeLock();
  }, [prefs.garderEcranAllume, isRunning]);

  const syncPendingData = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    try {
      const rawPrefs = localStorage.getItem("fpv_pending_prefs");
      if (rawPrefs) {
        const patch = JSON.parse(rawPrefs);
        const res = await fetch("/api/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (res.ok) localStorage.removeItem("fpv_pending_prefs");
      }
      const rawHist = localStorage.getItem("fpv_pending_history");
      if (rawHist) {
        const items = JSON.parse(rawHist);
        if (Array.isArray(items) && items.length > 0) {
          const res = await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ logs: items }),
          });
          if (res.ok) localStorage.removeItem("fpv_pending_history");
        }
      }
      setOfflineMode(false);
    } catch {}
  }, []);

  const addHistory = useCallback(
    async (workoutTitle: string, exerciseName: string, durationSec: number) => {
      const entry: SessionLog = {
        id: `${Date.now()}`,
        workoutTitle,
        exerciseName,
        completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        durationSec,
      };
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, 20);
        try { localStorage.setItem("fpv_history", JSON.stringify(next)); } catch {}
        return next;
      });
      if (prefs.bipActif) playCompletionBeep();
      if (prefs.vibrationActive && typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate([180, 80, 180]); } catch {}
      }
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setOfflineMode(true);
        try {
          const cur = JSON.parse(localStorage.getItem("fpv_pending_history") || "[]");
          cur.push(entry);
          localStorage.setItem("fpv_pending_history", JSON.stringify(cur));
        } catch {}
        return;
      }
      try {
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
      } catch {
        try {
          const cur = JSON.parse(localStorage.getItem("fpv_pending_history") || "[]");
          cur.push(entry);
          localStorage.setItem("fpv_pending_history", JSON.stringify(cur));
        } catch {}
      }
    },
    [prefs.bipActif, prefs.vibrationActive]
  );

  const selectExerciseAt = useCallback((wk: WorkoutSpec | null, idx: number, shouldStart: boolean) => {
    const list = wk?.exercises ?? [];
    const safeIdx = Math.max(0, Math.min(idx, Math.max(0, list.length - 1)));
    const targetEx = list[safeIdx];
    setActiveIdx(safeIdx);
    setIsResting(false);
    setSecondsLeft(targetEx?.durationSec ?? 30);
    setIsRunning(shouldStart && Boolean(targetEx));
  }, []);

  const openWorkout = useCallback(
    (wk: WorkoutSpec, shouldStart: boolean) => {
      setSelectedWorkout(wk);
      setActiveTab("workouts");
      selectExerciseAt(wk, 0, shouldStart);
    },
    [selectExerciseAt]
  );

  const loadData = useCallback(async (targetLang: LangCode) => {
    const baseTen = getAllTenPrograms(targetLang);
    const cacheKey = `fpv_ten_${targetLang}`;
    const isBrowserOffline = typeof navigator !== "undefined" && !navigator.onLine;

    const applyPrograms = (list: WorkoutSpec[], offline: boolean) => {
      setWorkouts(list);
      setOfflineMode(offline);
      setSelectedWorkout((prev) => (prev ? list.find((w) => w.id === prev.id) ?? null : null));
    };

    if (isBrowserOffline) {
      try {
        const cached = localStorage.getItem(cacheKey);
        const parsed = cached ? JSON.parse(cached) : baseTen;
        applyPrograms(Array.isArray(parsed) && parsed.length >= 10 ? parsed : baseTen, true);
      } catch {
        applyPrograms(baseTen, true);
      }
      return;
    }

    try {
      await fetch(`/api/workouts?lang=${targetLang}`, { cache: "no-store" });
      try {
        localStorage.setItem(cacheKey, JSON.stringify(baseTen));
      } catch {}
      applyPrograms(baseTen, false);
    } catch {
      applyPrograms(baseTen, true);
    }
  }, []);

  useEffect(() => {
    loadData(lang);
  }, [lang, loadData]);

  useEffect(() => {
    const onOnline = () => {
      setOfflineMode(false);
      syncPendingData();
      loadData(lang);
    };
    const onOffline = () => setOfflineMode(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [lang, loadData, syncPendingData]);

  const completeCurrentStep = useCallback(() => {
    const wk = selectedWorkout;
    const list = wk?.exercises ?? [];
    const ex = list[activeIdx];
    const wkTitle = wk?.title ?? "Séance";

    if (!isResting && ex) {
      addHistory(wkTitle, ex.name, ex.durationSec);
    }

    if (!isResting && autoChain && activeIdx < list.length - 1) {
      setIsResting(true);
      setSecondsLeft(ex?.restSec ?? 15);
      setIsRunning(true);
      return;
    }

    if (isResting && activeIdx < list.length - 1) {
      selectExerciseAt(wk, activeIdx + 1, autoChain);
      return;
    }

    setIsRunning(false);
    setIsResting(false);
    setSecondsLeft(0);
  }, [selectedWorkout, activeIdx, isResting, autoChain, addHistory, selectExerciseAt]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setSecondsLeft((s) => {
        if (s <= 1) {
          completeCurrentStep();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, completeCurrentStep]);

  const updatePref = async (key: "bipActif" | "vibrationActive" | "garderEcranAllume" | "avertissementSanteAccepte") => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try { localStorage.setItem("fpv_prefs", JSON.stringify(next)); } catch {}
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setOfflineMode(true);
      try { localStorage.setItem("fpv_pending_prefs", JSON.stringify({ [key]: next[key] })); } catch {}
      return;
    }
    try {
      await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: next[key] }),
      });
    } catch {
      setOfflineMode(true);
      try { localStorage.setItem("fpv_pending_prefs", JSON.stringify({ [key]: next[key] })); } catch {}
    }
  };

  const visibleWorkouts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return workouts.filter((wk) => {
      if (q) {
        const matchTitle = wk.title.toLowerCase().includes(q) || wk.description.toLowerCase().includes(q);
        const matchEx = wk.exercises.some((e) => e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q));
        if (!matchTitle && !matchEx) return false;
      }
      if (durationFilter === "short" && wk.durationMin > 18) return false;
      if (durationFilter === "medium" && wk.durationMin <= 18) return false;
      if (levelFilter !== "all" && wk.level !== levelFilter) return false;
      if (equipmentFilter !== "all" && wk.equipment !== equipmentFilter) return false;
      if (zoneFilter !== "all" && wk.bodyZone !== zoneFilter) return false;
      if (jumpFilter === "no-jump" && wk.hasJump) return false;
      if (jumpFilter === "with-jump" && !wk.hasJump) return false;
      return true;
    });
  }, [workouts, searchQuery, durationFilter, levelFilter, equipmentFilter, zoneFilter, jumpFilter]);

  const exercises = selectedWorkout?.exercises ?? [];
  const currentEx = exercises[activeIdx] ?? null;
  const featuredWorkout = workouts[0] ?? null;
  const totalCaloriesDone = history.reduce((acc, item) => acc + Math.max(8, Math.round(item.durationSec * 0.2)), 0);
  const weeklyPct = Math.min(100, Math.round((history.length / 5) * 100));
                                                                                                                                                                                                                                              export default function FitProHome() {
  const [lang, setLang] = useState<LangCode>("fr");
  const [activeTab, setActiveTab] = useState<TabKey>("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [durationFilter, setDurationFilter] = useState<"all" | "short" | "medium">("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [jumpFilter, setJumpFilter] = useState<"all" | "no-jump" | "with-jump">("all");

  const [workouts, setWorkouts] = useState<WorkoutSpec[]>(() => getAllTenPrograms("fr"));
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSpec | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [autoChain, setAutoChain] = useState(true);
  const [tick, setTick] = useState(0);
  const [prefs, setPrefs] = useState<UserPreferenceData>({
    id: 1,
    langue: "fr",
    bipActif: true,
    vibrationActive: true,
    garderEcranAllume: true,
    avertissementSanteAccepte: true,
  });
  const [history, setHistory] = useState<SessionLog[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const wakeLockRef = useRef<{ release?: () => Promise<void> } | null>(null);

  const ui = UI_TEXT[lang] ?? UI_TEXT.fr;

  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem("fpv_history");
      if (rawHistory) setHistory(JSON.parse(rawHistory));
      const rawPrefs = localStorage.getItem("fpv_prefs");
      if (rawPrefs) setPrefs(JSON.parse(rawPrefs));
      const rawPack = localStorage.getItem("fpv_all_langs_pack");
      if (!rawPack) {
        localStorage.setItem("fpv_all_langs_pack", JSON.stringify(buildAllLangsPack()));
      }
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      }
    } catch {}
  }, []);

  useEffect(() => {
    const syncWakeLock = async () => {
      try {
        if (prefs.garderEcranAllume && isRunning && "wakeLock" in navigator) {
          const wlApi = navigator as unknown as { wakeLock?: { request?: (t: string) => Promise<{ release?: () => Promise<void> }> } };
          if (!wakeLockRef.current && wlApi.wakeLock?.request) {
            wakeLockRef.current = await wlApi.wakeLock.request("screen");
          }
        } else if (wakeLockRef.current?.release) {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
      } catch {}
    };
    syncWakeLock();
  }, [prefs.garderEcranAllume, isRunning]);

  const syncPendingData = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return;
    try {
      const rawPrefs = localStorage.getItem("fpv_pending_prefs");
      if (rawPrefs) {
        const patch = JSON.parse(rawPrefs);
        const res = await fetch("/api/preferences", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (res.ok) localStorage.removeItem("fpv_pending_prefs");
      }
      const rawHist = localStorage.getItem("fpv_pending_history");
      if (rawHist) {
        const items = JSON.parse(rawHist);
        if (Array.isArray(items) && items.length > 0) {
          const res = await fetch("/api/history", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ logs: items }),
          });
          if (res.ok) localStorage.removeItem("fpv_pending_history");
        }
      }
      setOfflineMode(false);
    } catch {}
  }, []);

  const addHistory = useCallback(
    async (workoutTitle: string, exerciseName: string, durationSec: number) => {
      const entry: SessionLog = {
        id: `${Date.now()}`,
        workoutTitle,
        exerciseName,
        completedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        durationSec,
      };
      setHistory((prev) => {
        const next = [entry, ...prev].slice(0, 20);
        try { localStorage.setItem("fpv_history", JSON.stringify(next)); } catch {}
        return next;
      });
      if (prefs.bipActif) playCompletionBeep();
      if (prefs.vibrationActive && typeof navigator !== "undefined" && "vibrate" in navigator) {
        try { navigator.vibrate([180, 80, 180]); } catch {}
      }
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setOfflineMode(true);
        try {
          const cur = JSON.parse(localStorage.getItem("fpv_pending_history") || "[]");
          cur.push(entry);
          localStorage.setItem("fpv_pending_history", JSON.stringify(cur));
        } catch {}
        return;
      }
      try {
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(entry),
        });
      } catch {
        try {
          const cur = JSON.parse(localStorage.getItem("fpv_pending_history") || "[]");
          cur.push(entry);
          localStorage.setItem("fpv_pending_history", JSON.stringify(cur));
        } catch {}
      }
    },
    [prefs.bipActif, prefs.vibrationActive]
  );

  const selectExerciseAt = useCallback((wk: WorkoutSpec | null, idx: number, shouldStart: boolean) => {
    const list = wk?.exercises ?? [];
    const safeIdx = Math.max(0, Math.min(idx, Math.max(0, list.length - 1)));
    const targetEx = list[safeIdx];
    setActiveIdx(safeIdx);
    setIsResting(false);
    setSecondsLeft(targetEx?.durationSec ?? 30);
    setIsRunning(shouldStart && Boolean(targetEx));
  }, []);

  const openWorkout = useCallback(
    (wk: WorkoutSpec, shouldStart: boolean) => {
      setSelectedWorkout(wk);
      setActiveTab("workouts");
      selectExerciseAt(wk, 0, shouldStart);
    },
    [selectExerciseAt]
  );

  const loadData = useCallback(async (targetLang: LangCode) => {
    const baseTen = getAllTenPrograms(targetLang);
    const cacheKey = `fpv_ten_${targetLang}`;
    const isBrowserOffline = typeof navigator !== "undefined" && !navigator.onLine;

    const applyPrograms = (list: WorkoutSpec[], offline: boolean) => {
      setWorkouts(list);
      setOfflineMode(offline);
      setSelectedWorkout((prev) => (prev ? list.find((w) => w.id === prev.id) ?? null : null));
    };

    if (isBrowserOffline) {
      try {
        const cached = localStorage.getItem(cacheKey);
        const parsed = cached ? JSON.parse(cached) : baseTen;
        applyPrograms(Array.isArray(parsed) && parsed.length >= 10 ? parsed : baseTen, true);
      } catch {
        applyPrograms(baseTen, true);
      }
      return;
    }

    try {
      await fetch(`/api/workouts?lang=${targetLang}`, { cache: "no-store" });
      try {
        localStorage.setItem(cacheKey, JSON.stringify(baseTen));
      } catch {}
      applyPrograms(baseTen, false);
    } catch {
      applyPrograms(baseTen, true);
    }
  }, []);

  useEffect(() => {
    loadData(lang);
  }, [lang, loadData]);

  useEffect(() => {
    const onOnline = () => {
      setOfflineMode(false);
      syncPendingData();
      loadData(lang);
    };
    const onOffline = () => setOfflineMode(true);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [lang, loadData, syncPendingData]);

  const completeCurrentStep = useCallback(() => {
    const wk = selectedWorkout;
    const list = wk?.exercises ?? [];
    const ex = list[activeIdx];
    const wkTitle = wk?.title ?? "Séance";

    if (!isResting && ex) {
      addHistory(wkTitle, ex.name, ex.durationSec);
    }

    if (!isResting && autoChain && activeIdx < list.length - 1) {
      setIsResting(true);
      setSecondsLeft(ex?.restSec ?? 15);
      setIsRunning(true);
      return;
    }

    if (isResting && activeIdx < list.length - 1) {
      selectExerciseAt(wk, activeIdx + 1, autoChain);
      return;
    }

    setIsRunning(false);
    setIsResting(false);
    setSecondsLeft(0);
  }, [selectedWorkout, activeIdx, isResting, autoChain, addHistory, selectExerciseAt]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setSecondsLeft((s) => {
        if (s <= 1) {
          completeCurrentStep();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, completeCurrentStep]);

  const updatePref = async (key: "bipActif" | "vibrationActive" | "garderEcranAllume" | "avertissementSanteAccepte") => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try { localStorage.setItem("fpv_prefs", JSON.stringify(next)); } catch {}
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setOfflineMode(true);
      try { localStorage.setItem("fpv_pending_prefs", JSON.stringify({ [key]: next[key] })); } catch {}
      return;
    }
    try {
      await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: next[key] }),
      });
    } catch {
      setOfflineMode(true);
      try { localStorage.setItem("fpv_pending_prefs", JSON.stringify({ [key]: next[key] })); } catch {}
    }
  };

  const visibleWorkouts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return workouts.filter((wk) => {
      if (q) {
        const matchTitle = wk.title.toLowerCase().includes(q) || wk.description.toLowerCase().includes(q);
        const matchEx = wk.exercises.some((e) => e.name.toLowerCase().includes(q) || e.muscle.toLowerCase().includes(q));
        if (!matchTitle && !matchEx) return false;
      }
      if (durationFilter === "short" && wk.durationMin > 18) return false;
      if (durationFilter === "medium" && wk.durationMin <= 18) return false;
      if (levelFilter !== "all" && wk.level !== levelFilter) return false;
      if (equipmentFilter !== "all" && wk.equipment !== equipmentFilter) return false;
      if (zoneFilter !== "all" && wk.bodyZone !== zoneFilter) return false;
      if (jumpFilter === "no-jump" && wk.hasJump) return false;
      if (jumpFilter === "with-jump" && !wk.hasJump) return false;
      return true;
    });
  }, [workouts, searchQuery, durationFilter, levelFilter, equipmentFilter, zoneFilter, jumpFilter]);

  const exercises = selectedWorkout?.exercises ?? [];
  const currentEx = exercises[activeIdx] ?? null;
  const featuredWorkout = workouts[0] ?? null;
  const totalCaloriesDone = history.reduce((acc, item) => acc + Math.max(8, Math.round(item.durationSec * 0.2)), 0);
  const weeklyPct = Math.min(100, Math.round((history.length / 5) * 100));
                                                                                                                                                                                                                                                
