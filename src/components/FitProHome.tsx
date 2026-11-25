"use client";

import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";

const LANGS = ["fr", "en", "es", "ar", "pt", "de", "it", "wo"] as const;
type LangCode = (typeof LANGS)[number];
type MotionKind = "squat" | "push" | "jack" | "core" | "stretch" | "hinge";

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
    brandSub: string;
    pageTitle: string;
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
  }
> = {
  fr: {
    brandSub: "FIT PRO VERT • ENTRAÎNEMENT",
    pageTitle: "Programmes d'entraînement",
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
    backToList: "Retour aux 10 programmes",
    exercisesCount: "exercices",
    setsLabel: "Séries",
    restLabel: "Repos",
    safetyTitle: "Consignes de sécurité",
  },
  en: {
    brandSub: "FIT PRO VERT • WORKOUTS",
    pageTitle: "Training Programs",
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
    backToList: "Back to 10 programs",
    exercisesCount: "exercises",
    setsLabel: "Sets",
    restLabel: "Rest",
    safetyTitle: "Safety guidelines",
  },
  es: {
    brandSub: "FIT PRO VERT • ENTRENAMIENTO",
    pageTitle: "Programas de entrenamiento",
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
    backToList: "Volver a los 10 programas",
    exercisesCount: "ejercicios",
    setsLabel: "Series",
    restLabel: "Descanso",
    safetyTitle: "Pautas de seguridad",
  },
  ar: {
    brandSub: "FIT PRO VERT • التدريب",
    pageTitle: "برامج التدريب",
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
    backToList: "العودة إلى 10 برامج",
    exercisesCount: "تمارين",
    setsLabel: "المجموعات",
    restLabel: "الراحة",
    safetyTitle: "إرشادات السلامة",
  },
  pt: {
    brandSub: "FIT PRO VERT • TREINOS",
    pageTitle: "Programas de treino",
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
    backToList: "Voltar aos 10 programas",
    exercisesCount: "exercícios",
    setsLabel: "Séries",
    restLabel: "Descanso",
    safetyTitle: "Orientações de segurança",
  },
  de: {
    brandSub: "FIT PRO VERT • TRAINING",
    pageTitle: "Trainingsprogramme",
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
    backToList: "Zurück zu 10 Programmen",
    exercisesCount: "Übungen",
    setsLabel: "Sätze",
    restLabel: "Pause",
    safetyTitle: "Sicherheitshinweise",
  },
  it: {
    brandSub: "FIT PRO VERT • ALLENAMENTI",
    pageTitle: "Programmi di allenamento",
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
    backToList: "Torna ai 10 programmi",
    exercisesCount: "esercizi",
    setsLabel: "Serie",
    restLabel: "Recupero",
    safetyTitle: "Norme di sicurezza",
  },
  wo: {
    brandSub: "FIT PRO VERT • TÀGGAT",
    pageTitle: "Porogaramu Tàggat",
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
    backToList: "Dellu ci 10 porogaram yi",
    exercisesCount: "tàggat",
    setsLabel: "Wàll",
    restLabel: "Noflaay",
    safetyTitle: "Aarukaayu wér gi yaram",
  },
};

function buildTenPrograms(lang: LangCode): WorkoutSpec[] {
  const isFr = lang === "fr";
  const isEn = lang === "en";
  const t = (fr: string, en: string, ar: string, wo: string, es?: string, pt?: string, de?: string, it?: string) => {
    if (isFr) return fr;
    if (isEn) return en;
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
      title: t("Full Body débutant", "Beginner Full Body", "الجسم كامل للمبتدئين", "Yaram wépp bu njàlbéen", "Cuerpo completo principiante", "Corpo inteiro iniciante", "Ganzkörper Anfänger", "Total body principianti"),
      description: t(
        "Routine douce et complète à la maison pour bâtir l'endurance et la coordination sans matériel.",
        "Gentle, complete home routine to build endurance and coordination with zero equipment.",
        "حصة منزلية متكاملة وسهلة لبناء التحمل والتناسق بدون معدات.",
        "Tàggat bu neex ci biir kër ngir yokk kàttan ak àndandoo yaram te soxlaul dara.",
        "Rutina completa en casa para ganar resistencia y coordinación sin equipo.",
        "Rotina completa em casa para desenvolver resistência e coordenação sem equipamentos.",
        "Sanftes Ganzkörpertraining zu Hause für Ausdauer und Koordination ohne Geräte.",
        "Routine completa a casa per resistenza e coordinazione a corpo libero."
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
        t("Garde les genoux alignés avec les pointes de pieds.", "Keep knees aligned with your toes.", "حافظ على استقامة الركبتين مع أطراف القدمين.", "Wàccal sa ñàkk te mu ànd ak sa baaraami tànk."),
        t("Respire régulièrement sans bloquer l'air.", "Breathe steadily without holding your breath.", "تنفس بانتظام دون حبس النفس.", "Nóoyal bu baax te bul téye noyi."),
      ],
      exercises: [
        { id: "e-01-1", name: t("Squat à la maison", "Home Bodyweight Squat", "قرفصاء في المنزل", "Squat ci biir kër"), muscle: "Quadriceps & Fessiers", motion: "squat", sets: 3, repsOrSec: "12 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: t("Descends les hanches vers l'arrière et pousse sur les talons pour remonter.", "Push hips back and drive through heels to stand up.", "ادفع الوركين للخلف وانهض بالارتكاز على الكعبين.", "Wàccal sa létt ginnaaw te jël kàttan ci tànk yi ngir jóg.") },
        { id: "e-01-2", name: t("Pompes sur genoux", "Knee Push-Ups", "ضغط على الركبتين", "Pompe ci ñàkk"), muscle: "Pectoraux & Triceps", motion: "push", sets: 3, repsOrSec: "10 reps", durationSec: 30, restSec: 20, hasJump: false, instructions: t("Garde le bassin gainé et abaisse la poitrine près du sol.", "Keep core braced and lower chest smoothly.", "حافظ على شد البطن وانزل بالصدر بهدوء.", "Dëgëral sa biir te wàccal sa dënk ci suuf.") },
        { id: "e-01-3", name: t("Marche sur place haute", "High March in Place", "مشي عالٍ في المكان", "Dox ci boppam bu kawe"), muscle: "Hanches & Cardio doux", motion: "jack", sets: 3, repsOrSec: "40s", durationSec: 40, restSec: 20, hasJump: false, instructions: t("Monte alternativement les genoux et balance les bras.", "Lift knees alternately while swinging arms.", "ارفع الركبتين بالتناوب مع تحريك الذراعين.", "Yékkatil ñàkk yi te yëngal loxo yi.") },
        { id: "e-01-4", name: t("Crunch abdominal doux", "Gentle Abdominal Crunch", "تمرين كرانش خفيف", "Crunch bu woyof"), muscle: "Abdominaux", motion: "core", sets: 3, repsOrSec: "12 reps", durationSec: 30, restSec: 20, hasJump: false, instructions: t("Décolle légèrement les omoplates en expirant.", "Lift shoulder blades slightly while exhaling.", "ارفع لوحي الكتف قليلاً مع الزفير.", "Yékkatil sa mbaam ci kaw te di génne ngelaw.") },
        { id: "e-01-5", name: t("Étirement dos et bras", "Back & Arm Stretch", "إطالة الظهر والذراعين", "Talal gannaaw ak loxo"), muscle: "Dos & Épaules", motion: "stretch", sets: 2, repsOrSec: "30s", durationSec: 30, restSec: 15, hasJump: false, instructions: t("Allonge la colonne et étire doucement les épaules.", "Lengthen spine and stretch shoulders gently.", "اطل العمود الفقري ومدد الكتفين برفق.", "Talal sa gannaaw te yàggal sa mbaam ndànk.") },
      ],
    },
    {
      id: "wk-02",
      title: t("Full Body intermédiaire", "Intermediate Full Body", "الجسم كامل للمتوسطين", "Yaram wépp bu diggu", "Cuerpo completo intermedio", "Corpo inteiro intermediário", "Ganzkörper Fortgeschrittene", "Total body intermedio"),
      description: t(
        "Séance dynamique combinant puissance musculaire, rythme cardio et gainage complet.",
        "Dynamic workout combining muscular power, cardio pace, and full-body core stability.",
        "حصة ديناميكية تجمع بين القوة العضلية والكارديو وثبات الجذع.",
        "Tàggat bu woyof te am kàttan ngir yokk doole yaram ak wér gu yaram.",
        "Entrenamiento dinámico que combina potencia muscular, ritmo cardio y core.",
        "Treino dinâmico combinando potência muscular, ritmo cardio e estabilidade.",
        "Dynamisches Training aus Kraft, Cardio-Tempo und Rumpfstabilität.",
        "Allenamento dinamico tra forza, ritmo cardio e tenuta del core."
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
        t("Amortis chaque réception souplement sur l'avant du pied.", "Land softly on the balls of your feet.", "اهبط بخفة على مقدمة القدمين.", "Wàccal ndànk ci kanamu tànk yi."),
        t("Maintiens le dos neutre pendant les transitions.", "Keep your spine neutral during transitions.", "حافظ على استقامة الظهر أثناء الانتقال.", "Wàccal sa gannaaw mu jub ci biir soppi yi."),
      ],
      exercises: [
        { id: "e-02-1", name: t("Burpee contrôlé", "Controlled Burpee", "بيربي متحكم به", "Burpee bu ànd ak sàkku"), muscle: "Full Body & Cardio", motion: "jack", sets: 4, repsOrSec: "10 reps", durationSec: 40, restSec: 25, hasJump: true, instructions: t("Passe en planche, ramène les pieds et réalise une extension dynamique.", "Step or jump to plank, return feet, and extend cleanly.", "انتقل إلى البلانك ثم عد وانهض بثبات.", "Démb ci planche, delloo tànk yi te jóg bu baax.") },
        { id: "e-02-2", name: t("Squat sauté léger", "Light Jump Squat", "قرفصاء مع قفز خفيف", "Squat ak tàbb bu néew"), muscle: "Quadriceps & Fessiers", motion: "squat", sets: 4, repsOrSec: "12 reps", durationSec: 35, restSec: 25, hasJump: true, instructions: t("Descends en squat puis pousse vers le haut sans à-coup brutal.", "Lower into squat then drive up smoothly.", "انزل في القرفصاء ثم ادفع للأعلى بسلاسة.", "Wàccal ci squat te yékkatu ndànk.") },
        { id: "e-02-3", name: t("Pompes complètes", "Standard Push-Ups", "تمارين الضغط الكاملة", "Pompe bu mat"), muscle: "Pectoraux, Bras & Core", motion: "push", sets: 4, repsOrSec: "12 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: t("Corps gainé de la tête aux talons, pousse fort sur les mains.", "Body in a straight plank line, press through palms.", "الجسم مستقيم من الرأس إلى القدمين مع الدفع باليدين.", "Yaram bi jub na ba ci tànk yi, jëfandikoo loxo yi.") },
        { id: "e-02-4", name: t("Gainage dynamique", "Dynamic Plank Tap", "بلانك حركي", "Planche bu yëngu"), muscle: "Sangle abdominale", motion: "core", sets: 3, repsOrSec: "40s", durationSec: 40, restSec: 20, hasJump: false, instructions: t("Stabilise le bassin tout en touchant l'épaule opposée.", "Keep hips still while tapping opposite shoulder.", "ثبت الحوض مع لمس الكتف المقابل.", "Dëgëral létt bi te laal mbaam mi ci loxo bi.") },
        { id: "e-02-5", name: t("Good morning buste", "Hip Hinge Good Morning", "انحناء الجذع للأمام", "Wàccal wàll gi kanam"), muscle: "Ischios & Lombaires", motion: "hinge", sets: 3, repsOrSec: "14 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: t("Pousse les fessiers vers l'arrière avec le dos bien plat.", "Push glutes back with a flat back.", "ادفع المؤخرة للخلف مع الحفاظ على الظهر مسطحاً.", "Wàccal létt gi ginnaaw te gannaaw gi jub.") },
      ],
    },
    {
      id: "wk-03",
      title: t("Haut du corps", "Upper Body", "الجزء العلوي من الجسم", "Wàllu kawu yaram", "Tren superior", "Parte superior", "Oberkörper", "Parte superiore"),
      description: t(
        "Renforce les pectoraux, le dos et les épaules pour une posture ferme et tonique.",
        "Strengthens chest, upper back, and shoulders for a strong, upright posture.",
        "يقوي الصدر وأعلى الظهر والكتفين لقوام مشدود.",
        "Dëgëral dënk bi, gannaaw gi ak mbaam yi ngir yaram bi taxaw bu baax.",
        "Fortalece pecho, espalda alta y hombros para una postura firme.",
        "Fortalece peitoral, costas e ombros para uma postura firme.",
        "Stärkt Brust, oberen Rücken und Schultern für eine aufrechte Haltung.",
        "Rinforza petto, dorso e spalle per una postura solida."
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
        t("Évite de hausser les épaules vers les oreilles.", "Avoid shrugging shoulders up toward your ears.", "تجنب رفع الكتفين نحو الأذنين.", "Bul yékkati mbaam yi ba ci nopp yi."),
      ],
      exercises: [
        { id: "e-03-1", name: t("Pompes classiques", "Classic Push-Ups", "ضغط كلاسيكي", "Pompe bu wóor"), muscle: "Pectoraux", motion: "push", sets: 4, repsOrSec: "10 reps", durationSec: 35, restSec: 20, hasJump: false, instructions: t("Mains légèrement plus larges que les épaules, coudes à 45°.", "Hands slightly wider than shoulders, elbows at 45°.", "اليدان أوسع قليلاً من الكتفين بزاوية 45 درجة.", "Loxo yi yaatu nañu tuuti, gëdd yi ànd ci 45°.") },
        { id: "e-03-2", name: t("Pompes diamant ou serrées", "Close-Grip Push-Ups", "ضغط قريب اليدين", "Pompe bu loxo yi jege"), muscle: "Triceps & Pectoraux", motion: "push", sets: 3, repsOrSec: "10 reps", durationSec: 30, restSec: 20, hasJump: false, instructions: t("Rapproche les mains pour cibler l'arrière des bras.", "Bring hands closer to target the back of the arms.", "قرب اليدين لاستهداف الجزء الخلفي للذراعين.", "Jëflanteel loxo yi ngir taxaw ci ginnaawu loxo yi.") },
        { id: "e-03-3", name: t("Superman dorsal", "Superman Back Raise", "تمرين سوبرمان للظهر", "Superman ci gannaaw"), muscle: "Érecteurs du rachis", motion: "hinge", sets: 3, repsOrSec: "12 reps", durationSec: 30, restSec: 20, hasJump: false, instructions: t("Sur le ventre, décolle légèrement buste et bras sans forcer la nuque.", "Lie face down and lift chest and arms without straining neck.", "على البطن، ارفع الصدر والذراعين بلطف دون إجهاد الرقبة.", "Tédd ci biir te yékkati dënk ak loxo ndànk.") },
        { id: "e-03-4", name: t("Étirement pectoraux et épaules", "Chest & Shoulder Stretch", "إطالة الصدر والكتفين", "Talal dënk ak mbaam"), muscle: "Mobilité haut du corps", motion: "stretch", sets: 2, repsOrSec: "30s", durationSec: 30, restSec: 15, hasJump: false, instructions: t("Ouvre la cage thoracique et respire profondément.", "Open the chest and take deep breaths.", "افتح القفص الصدري وخذ أنفاساً عميقة.", "Ubbi dënk bi te noyi bu xóot.") },
        { id: "e-03-5", name: t("Planche haute épaule", "High Plank Hold", "ثبات البلانك العالي", "Planche bu kawe"), muscle: "Épaules & Core", motion: "core", sets: 3, repsOrSec: "35s", durationSec: 35, restSec: 20, hasJump: false, instructions: t("Repousse le sol avec les paumes de mains.", "Push the floor away with your palms.", "ادفع الأرض بعيداً براحتي اليدين.", "Tëgg suuf ci xaaju loxo yi.") },
      ],
    },
    {
      id: "wk-04",
      title: t("Jambes et fessiers", "Legs & Glutes", "الأرجل والمؤخرة", "Tànk ak létt", "Piernas y glúteos", "Pernas e glúteos", "Beine & Gesäß", "Gambe e glutei"),
      description: t(
        "Sculpte et renforce le bas du corps avec des squats, fentes et ponts fessiers.",
        "Shapes and strengthens the lower body with squats, lunges, and glute bridges.",
        "يشد ويقوي الجزء السفلي عبر القرفصاء والاندفاع وجسر المؤخرة.",
        "Dëgëral wàllu suufu yaram ak squat, fente ak pont.",
        "Tonifica y fortalece el tren inferior con sentadillas, zancadas y puente.",
        "Fortalece pernas e glúteos com agachamentos, avanços e ponte.",
        "Kräftigt Beine und Gesäß mit Kniebeugen, Ausfallschritten und Brücke.",
        "Tonifica gambe e glutei con squat, af  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 text-slate-900 p-4 max-w-5xl mx-auto space-y-6">
      <header className="bg-[#0B1F3A] text-white rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">{ui.brandSub}</p>
            <h1 className="text-2xl font-bold">{ui.pageTitle} ({visibleWorkouts.length})</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {offlineMode && <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-200 font-semibold">Hors ligne</span>}
            {selectedWorkout && (
              <button
                type="button"
                onClick={() => {
                  setIsRunning(false);
                  setSelectedWorkout(null);
                }}
                className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-400 text-slate-950"
              >
                {ui.backToList}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGS.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${lang === code ? "bg-emerald-400 text-slate-950" : "bg-slate-800 text-slate-200"}`}
            >
              {code}
            </button>
          ))}
        </div>
      </header>

      {!prefs.avertissementSanteAccepte && (
        <div className="bg-amber-50 border border-amber-300 text-amber-950 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs">
          <span>Échauffez-vous et adaptez l&apos;intensité à votre condition physique avant chaque séance.</span>
          <button type="button" onClick={() => updatePref("avertissementSanteAccepte")} className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold shrink-0">
            Accepter
          </button>
        </div>
      )}

      {!selectedWorkout ? (
        <>
          <section className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={ui.searchPlaceholder}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              <label className="space-y-1">
                <span className="font-semibold text-slate-600">{ui.durationLabel}</span>
                <select value={durationFilter} onChange={(e) => setDurationFilter(e.target.value as "all" | "short" | "medium")} className="w-full rounded-lg border border-slate-300 p-2 bg-white">
                  <option value="all">{ui.allOption}</option>
                  <option value="short">&le; 18 min</option>
                  <option value="medium">&gt; 18 min</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-slate-600">{ui.levelLabel}</span>
                <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2 bg-white">
                  <option value="all">{ui.allOption}</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Tous niveaux">Tous niveaux</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-slate-600">{ui.equipmentLabel}</span>
                <select value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2 bg-white">
                  <option value="all">{ui.allOption}</option>
                  <option value="Aucun">Aucun</option>
                  <option value="Tapis">Tapis</option>
                  <option value="Chaise / Mur">Chaise / Mur</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-slate-600">{ui.zoneLabel}</span>
                <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="w-full rounded-lg border border-slate-300 p-2 bg-white">
                  <option value="all">{ui.allOption}</option>
                  <option value="Full Body">Full Body</option>
                  <option value="Haut du corps">Haut du corps</option>
                  <option value="Jambes & Fessiers">Jambes &amp; Fessiers</option>
                  <option value="Abdos">Abdos</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Mobilité & Dos">Mobilité &amp; Dos</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="font-semibold text-slate-600">{ui.jumpFilterLabel}</span>
                <select value={jumpFilter} onChange={(e) => setJumpFilter(e.target.value as "all" | "no-jump" | "with-jump")} className="w-full rounded-lg border border-slate-300 p-2 bg-white">
                  <option value="all">{ui.allOption}</option>
                  <option value="without-jump">{ui.withoutJump}</option>
                  <option value="with-jump">{ui.withJump}</option>
                </select>
              </label>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setDurationFilter("all");
                    setLevelFilter("all");
                    setEquipmentFilter("all");
                    setZoneFilter("all");
                    setJumpFilter("all");
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 p-2 font-semibold text-slate-800"
                >
                  Reset filtres
                </button>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {visibleWorkouts.map((wk) => (
              <article key={wk.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
                <img
                  src={wk.photoUrl}
                  alt={wk.title}
                  onError={(e) => {
                    if (e.currentTarget.src !== wk.photoFallback) {
                      e.currentTarget.src = wk.photoFallback;
                    }
                  }}
                  className="w-full h-44 object-cover bg-slate-200"
                />
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                      <span>{wk.level} • {wk.durationMin} min</span>
                      <span>~{wk.caloriesEst} kcal</span>
                    </div>
                    <h2 className="text-lg font-bold text-[#0B1F3A]">{wk.title}</h2>
                    <p className="text-xs text-slate-600 line-clamp-2">{wk.description}</p>
                    <div className="text-xs text-slate-700 pt-1">
                      <strong>{ui.equipmentLabel}:</strong> {wk.equipment} • <strong>{wk.exercises.length}</strong> {ui.exercisesCount}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedWorkout(wk);
                        selectExerciseAt(wk, 0, false);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-[#0B1F3A] text-[#0B1F3A] text-xs font-bold"
                    >
                      {ui.seeProgram}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedWorkout(wk);
                        selectExerciseAt(wk, 0, true);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#0B1F3A] text-white text-xs font-bold"
                    >
                      {ui.startBtn}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </>
      ) : (
        <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm space-y-5">
          <img
            src={selectedWorkout.photoUrl}
            alt={selectedWorkout.title}
            onError={(e) => {
              if (e.currentTarget.src !== selectedWorkout.photoFallback) {
                e.currentTarget.src = selectedWorkout.photoFallback;
              }
            }}
            className="w-full h-56 object-cover bg-slate-200"
          />

          <div className="px-5 space-y-4">
            <div className="flex items-start justify-between gap-3 flex-wrap border-b border-slate-100 pb-4">
              <div className="space-y-1 max-w-xl">
                <div className="text-xs font-bold text-emerald-700">
                  {selectedWorkout.level} • {selectedWorkout.durationMin} min • ~{selectedWorkout.caloriesEst} kcal • {ui.equipmentLabel}: {selectedWorkout.equipment}
                </div>
                <h2 className="text-2xl font-bold text-[#0B1F3A]">{selectedWorkout.title}</h2>
                <p className="text-sm text-slate-700">{selectedWorkout.description}</p>
              </div>

              <div className="bg-[#0B1F3A] text-white rounded-2xl px-4 py-3 flex items-center gap-2 shrink-0">
                <span className="text-2xl font-mono font-bold">{secondsLeft}s</span>
                <button
                  type="button"
                  onClick={() => {
                    if (secondsLeft <= 0 && currentEx) {
                      selectExerciseAt(selectedWorkout, activeIdx, true);
                    } else {
                      setIsRunning((r) => !r);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-400 text-slate-950 text-xs font-bold"
                >
                  {isRunning ? "Pause" : secondsLeft <= 0 ? "Relancer" : ui.startBtn}
                </button>
                <button
                  type="button"
                  onClick={() => selectExerciseAt(selectedWorkout, activeIdx, false)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-semibold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={completeCurrentStep}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-700 text-emerald-300 text-xs font-semibold"
                >
                  Suivant
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#0B1F3A]">
                {isResting ? "Temps de repos" : `Exercice ${activeIdx + 1} / ${exercises.length}`}
              </span>
              <button
                type="button"
                onClick={() => setAutoChain((v) => !v)}
                className="px-2.5 py-1 rounded-lg border border-slate-300 font-semibold text-slate-700"
              >
                Enchaînement : {autoChain ? "AUTO" : "MANUEL"}
              </button>
            </div>

            {currentEx && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex gap-4 items-center">
                <AnimatedSilhouette2D motion={currentEx.motion} isRunning={isRunning} isResting={isResting} tick={tick} size="md" />
                <div className="space-y-1 flex-1">
                  <div className="text-xs font-semibold text-emerald-700">
                    {isResting ? `${ui.restLabel} (${currentEx.restSec}s)` : `${currentEx.muscle} • ${ui.setsLabel}: ${currentEx.sets} • ${currentEx.repsOrSec}`}
                  </div>
                  <div className="text-lg font-bold text-[#0B1F3A]">{currentEx.name}</div>
                  <p className="text-sm text-slate-700">{currentEx.instructions}</p>
                </div>
              </div>
            )}

            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1">
              <div className="text-xs font-bold text-[#0B1F3A]">{ui.safetyTitle}</div>
              <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                {selectedWorkout.safetyNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pb-5">
              <h3 className="text-sm font-bold text-[#0B1F3A]">Exercices ({exercises.length})</h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {exercises.map((ex, i) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => selectExerciseAt(selectedWorkout, i, true)}
                    className={`w-full text-start px-3.5 py-2.5 flex items-center justify-between gap-3 ${i === activeIdx ? "bg-emerald-50/80" : "bg-white"}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <AnimatedSilhouette2D motion={ex.motion} isRunning={isRunning && i === activeIdx} isResting={isResting && i === activeIdx} tick={tick} size="sm" />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[#0B1F3A] truncate">{i + 1}. {ex.name}</div>
                        <div className="text-xs text-slate-600 truncate">
                          {ui.setsLabel}: {ex.sets} • {ex.repsOrSec} • {ui.restLabel}: {ex.restSec}s
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 shrink-0">{ex.durationSec}s</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0B1F3A]">Récupération &amp; Historique</h2>
          <span className="text-xs font-semibold text-emerald-700">{history.length >= 4 ? "Récupération conseillée" : "Prêt pour l'entraînement"}</span>
        </div>
        {history.length === 0 ? <p className="text-xs text-slate-500">Aucun exercice terminé pour l&apos;instant.</p> : (
          <ul className="divide-y divide-slate-100 text-xs">
            {history.map((h) => (
              <li key={h.id} className="py-2 flex justify-between">
                <span><strong>{h.exerciseName}</strong> — {h.workoutTitle}</span>
                <span className="text-slate-500">{h.durationSec}s • {h.completedAt}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap gap-2 text-xs">
        <button type="button" onClick={() => updatePref("bipActif")} className={`px-3 py-2 rounded-lg border ${prefs.bipActif ? "bg-[#0B1F3A] text-white" : "bg-slate-50"}`}>Bip : {prefs.bipActif ? "ON" : "OFF"}</button>
        <button type="button" onClick={() => updatePref("vibrationActive")} className={`px-3 py-2 rounded-lg border ${prefs.vibrationActive ? "bg-[#0B1F3A] text-white" : "bg-slate-50"}`}>Vibration : {prefs.vibrationActive ? "ON" : "OFF"}</button>
        <button type="button" onClick={() => updatePref("garderEcranAllume")} className={`px-3 py-2 rounded-lg border ${prefs.garderEcranAllume ? "bg-[#0B1F3A] text-white" : "bg-slate-50"}`}>Écran : {prefs.garderEcranAllume ? "ON" : "OFF"}</button>
        <button type="button" onClick={() => updatePref("avertissementSanteAccepte")} className={`px-3 py-2 rounded-lg border ${prefs.avertissementSanteAccepte ? "bg-emerald-600 text-white" : "bg-slate-50"}`}>Santé : {prefs.avertissementSanteAccepte ? "OUI" : "NON"}</button>
      </section>
    </div>
  );
              }
                  
