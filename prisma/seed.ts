import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type LangFields = {
  fr: string;
  en: string;
  es: string;
  ar: string;
  pt: string;
  de: string;
  it: string;
  wo: string;
};

type WorkoutSeedInput = {
  idWorkout: string;
  slug: string;
  titre: LangFields;
  description: LangFields;
  dureeIndicativeMin: number;
  dureeCalculeeSec: number;
  niveau: string;
  materiel: string;
  zoneCorps: string;
  typeSeance: string;
  isSansSaut: boolean;
  isAvecSaut: boolean;
  photoUrl: string;
  caloriesMin: number;
  caloriesMax: number;
  isFavorite?: boolean;
  ordreAffichage: number;
};

type ExerciseSeedInput = {
  idExercice: string;
  idWorkout: string;
  ordreExercice: number;
  nom: LangFields;
  description: LangFields;
  animation2dUrl: string;
  animation2dApercuUrl: string;
  animationDureeSec: number;
  animationTailleMo: number;
  animationVue: string;
  photoEntrainementUrl: string;
  positionDepart: string;
  instructionsExecution: string;
  respiration: string;
  erreursAEviter: string;
  consignesSecurite: string;
  varianteDebutant?: string;
  varianteAvancee?: string;
  series: number;
  modeMesure: string;
  repetitionsCible?: number;
  dureeCibleSec?: number;
  parCoteOuJambe?: boolean;
  reposApresSerieSec?: number;
  reposApresExerciceSec?: number;
  niveau: string;
  materiel: string;
  muscleCible: string;
  isSansSaut: boolean;
  isEchauffement?: boolean;
  isRetourCalme?: boolean;
  caloriesEstimationMin?: number;
  caloriesEstimationMax?: number;
  dureeEstimeeSec: number;
};

type ExerciseTemplateInput = {
  nom: LangFields;
  description: LangFields;
  positionDepart: string;
  instructionsExecution: string;
  respiration: string;
  erreursAEviter: string;
  consignesSecurite: string;
  varianteDebutant: string;
  varianteAvancee: string;
  modeMesure: "reps" | "temps";
  repetitionsCible?: number;
  dureeCibleSec?: number;
  parCoteOuJambe?: boolean;
  muscleCible: string;
  isSansSaut: boolean;
  isEchauffement?: boolean;
  isRetourCalme?: boolean;
};

const WORKOUTS: WorkoutSeedInput[] = [
  {
    idWorkout: "wk-01",
    slug: "full-body-sans-saut",
    titre: {
      fr: "Full Body Sans Saut",
      en: "Low-Impact Full Body",
      es: "Full Body Sin Saltos",
      ar: "كامل الجسم بدون قفز",
      pt: "Corpo Inteiro Sem Salto",
      de: "Ganzkörper Ohne Sprünge",
      it: "Full Body Senza Salti",
      wo: "Yaram Wépp Ci Sañse Jump",
    },
    description: {
      fr: "Renforcement complet du corps à la maison sans impact articulaire.",
      en: "Complete at-home strength circuit with zero joint impact.",
      es: "Circuito de fuerza en casa sin impacto en las articulaciones.",
      ar: "تمرين قوة متكامل في المنزل بدون ضغط على المفاصل.",
      pt: "Circuito completo em casa sem impacto nas articulações.",
      de: "Ganzkörper-Krafttraining zu Hause ohne Gelenkbelastung.",
      it: "Circuito completo a casa a basso impatto articolare.",
      wo: "Liggéeyal sa yaram ci kër gi te du naqal yëngal.",
    },
    dureeIndicativeMin: 18,
    dureeCalculeeSec: 1080,
    niveau: "debutant",
    materiel: "aucun",
    zoneCorps: "full_body",
    typeSeance: "renforcement",
    isSansSaut: true,
    isAvecSaut: false,
    photoUrl: "/images/workouts/wk-01.jpg",
    caloriesMin: 120,
    caloriesMax: 180,
    ordreAffichage: 1,
  },
  {
    idWorkout: "wk-02",
    slug: "cardio-maison-energie",
    titre: {
      fr: "Cardio Maison Énergie",
      en: "Home Cardio Boost",
      es: "Cardio en Casa Energía",
      ar: "كارديو منزلي للطاقة",
      pt: "Cardio em Casa Energia",
      de: "Home Cardio Energie",
      it: "Cardio a Casa Energia",
      wo: "Cardio Ci Kër Gudd Kàttan",
    },
    description: {
      fr: "Montée en rythme progressive pour stimuler le cardio sans matériel.",
      en: "Progressive pace workout to boost cardio with no equipment.",
      es: "Ritmo progresivo para activar el cardio sin equipo.",
      ar: "رفع تدريجي للنبض لتنشيط القلب دون معدات.",
      pt: "Ritmo progressivo para ativar o cardio sem equipamento.",
      de: "Steigerndes Tempo für das Herz-Kreislauf-System ohne Geräte.",
      it: "Ritmo progressivo per attivare il cardio a corpo libero.",
      wo: "Yëkkati doxalin bi ndank-ndank ngir gudd xol bi.",
    },
    dureeIndicativeMin: 20,
    dureeCalculeeSec: 1200,
    niveau: "intermediaire",
    materiel: "aucun",
    zoneCorps: "full_body",
    typeSeance: "cardio",
    isSansSaut: false,
    isAvecSaut: true,
    photoUrl: "/images/workouts/wk-02.jpg",
    caloriesMin: 160,
    caloriesMax: 240,
    ordreAffichage: 2,
  },
  {
    idWorkout: "wk-03",
    slug: "abdos-gainage-profond",
    titre: {
      fr: "Abdos & Gainage Profond",
      en: "Core & Deep Plank",
      es: "Abdominales y Core Profundo",
      ar: "بطن وثبات عميق",
      pt: "Abdômen e Core Profundo",
      de: "Bauch & Tiefe Rumpfstabilität",
      it: "Addominali e Core Profondo",
      wo: "Biir Ak Taxawu Ci Dëgër",
    },
    description: {
      fr: "Sangle abdominale et stabilité du tronc avec contrôle postural.",
      en: "Core strengthening and trunk stability with strict posture.",
      es: "Fortalecimiento del core y estabilidad del tronco.",
      ar: "تقوية عضلات البطن وثبات الجذع بوضعية صحيحة.",
      pt: "Fortalecimento do core e estabilidade do tronco.",
      de: "Rumpfkräftigung und Stabilität mit sauberer Haltung.",
      it: "Rinforzo del core e stabilità del busto con controllo.",
      wo: "Dëgëral biir bi ak taxawu yaram bi ci lu wér.",
    },
    dureeIndicativeMin: 15,
    dureeCalculeeSec: 900,
    niveau: "debutant",
    materiel: "aucun",
    zoneCorps: "abdos",
    typeSeance: "gainage",
    isSansSaut: true,
    isAvecSaut: false,
    photoUrl: "/images/workouts/wk-03.jpg",
    caloriesMin: 90,
    caloriesMax: 140,
    ordreAffichage: 3,
  },
  {
    idWorkout: "wk-04",
    slug: "jambes-fessiers-tonus",
    titre: {
      fr: "Jambes & Fessiers Tonus",
      en: "Legs & Glutes Tone",
      es: "Piernas y Glúteos Tono",
      ar: "أرجل ومؤخرة لشد العضلات",
      pt: "Pernas e Glúteos Tônus",
      de: "Beine & Gesäß Straffung",
      it: "Gambe e Glutei Tono",
      wo: "Tank Ak Tànk Dëgëral",
    },
    description: {
      fr: "Squats, fentes et ponts pour tonifier le bas du corps.",
      en: "Squats, lunges, and bridges to tone the lower body.",
      es: "Sentadillas, zancadas y puentes para tonificar el tren inferior.",
      ar: "قرفصاء وطعنات وجسور لشد الجزء السفلي من الجسم.",
      pt: "Agachamentos, avanços e pontes para tonificar inferiores.",
      de: "Kniebeugen, Ausfallschritte und Brücken für die Beine.",
      it: "Squat, affondi e glute bridge per tonificare le gambe.",
      wo: "Suuxat, jéggi ak yëkkati ngir dëgëral tank yi.",
    },
    dureeIndicativeMin: 20,
    dureeCalculeeSec: 1200,
    niveau: "debutant",
    materiel: "aucun",
    zoneCorps: "bas_du_corps",
    typeSeance: "renforcement",
    isSansSaut: true,
    isAvecSaut: false,
    photoUrl: "/images/workouts/wk-04.jpg",
    caloriesMin: 140,
    caloriesMax: 210,
    ordreAffichage: 4,
  },
  {
    idWorkout: "wk-05",
    slug: "haut-du-corps-bras-dos",
    titre: {
      fr: "Haut du Corps : Bras & Dos",
      en: "Upper Body: Arms & Back",
      es: "Tren Superior: Brazos y Espalda",
      ar: "الجزء العلوي: الذراعان والظهر",
      pt: "Superior: Braços e Costas",
      de: "Oberkörper: Arme & Rücken",
      it: "Parte Alta: Braccia e Schiena",
      wo: "Kow Yaram : Loxo Ak Gannaaw",
    },
    description: {
      fr: "Pompes adaptées, gainage dorsal et mobilité des épaules.",
      en: "Adapted push-ups, back holds, and shoulder mobility.",
      es: "Flexiones adaptadas, espalda y movilidad de hombros.",
      ar: "ضغط معدل وثبات الظهر ومرونة الكتفين.",
      pt: "Flexões adaptadas, costas e mobilidade dos ombros.",
      de: "Angepasste Liegestütze, Rückenstabilität und Schultern.",
      it: "Piegamenti modulati, schiena e mobilità delle spalle.",
      wo: "Tëdd-jóg yu yomb, gannaaw ak yëngalug mbagg yi.",
    },
    dureeIndicativeMin: 16,
    dureeCalculeeSec: 960,
    niveau: "intermediaire",
    materiel: "aucun",
    zoneCorps: "haut_du_corps",
    typeSeance: "renforcement",
    isSansSaut: true,
    isAvecSaut: false,
    photoUrl: "/images/workouts/wk-05.jpg",
    caloriesMin: 110,
    caloriesMax: 170,
    ordreAffichage: 5,
  },
  {
    idWorkout: "wk-06",
    slug: "hiit-express-bruleur",
    titre: {
      fr: "HIIT Express Brûleur",
      en: "Express HIIT Burner",
      es: "HIIT Express Quema",
      ar: "تمارين عالية الشدة سريعة",
      pt: "HIIT Express Queima",
      de: "Express HIIT Fettverbrennung",
      it: "HIIT Express Brucia",
      wo: "HIIT Gaaw Ngir Lakk Kàttan",
    },
    description: {
      fr: "Intervalles dynamiques courts pour maximiser l'intensité.",
      en: "Short dynamic intervals to maximize workout intensity.",
      es: "Intervalos dinámicos cortos para máxima intensidad.",
      ar: "فترات حركية قصيرة لرفع شدة التمرين.",
      pt: "Intervalos dinâmicos curtos para máxima intensidade.",
      de: "Kurze dynamische Intervalle für hohe Intensität.",
      it: "Intervalli brevi e dinamici per alta intensità.",
      wo: "Yëngal yu gatt te gaaw ngir yokk kàttan gi.",
    },
    dureeIndicativeMin: 15,
    dureeCalculeeSec: 900,
    niveau: "avance",
    materiel: "aucun",
    zoneCorps: "full_body",
    typeSeance: "hiit",
    isSansSaut: false,
    isAvecSaut: true,
    photoUrl: "/images/workouts/wk-06.jpg",
    caloriesMin: 170,
    caloriesMax: 260,
    ordreAffichage: 6,
  },
  {
    idWorkout: "wk-07",
    slug: "mobilite-souplesse-matinale",
    titre: {
      fr: "Mobilité & Souplesse Matinale",
      en: "Morning Mobility & Stretch",
      es: "Movilidad y Flexibilidad Matinal",
      ar: "مرونة وليونة صباحية",
      pt: "Mobilidade e Alongamento Matinal",
      de: "Morgendliche Mobilität & Dehnung",
      it: "Mobilità e Flessibilità Mattutina",
      wo: "Yëngal Ak Nooy Ci Suba",
    },
    description: {
      fr: "Réveil articulaire doux et étirements guidés au sol.",
      en: "Gentle joint wake-up and guided floor stretches.",
      es: "Activación articular suave y estiramientos en el suelo.",
      ar: "تنشيط لطيف للمفاصل وتمدد موجه على الأرض.",
      pt: "Ativação articular suave e alongamentos no chão.",
      de: "Sanfte Gelenkmobilisation und Dehnungen am Boden.",
      it: "Risveglio articolare dolce e allungamenti a terra.",
      wo: "Yëngal bu neex ci yokk-yokk yi ak tàllal ci suuf.",
    },
    dureeIndicativeMin: 14,
    dureeCalculeeSec: 840,
    niveau: "debutant",
    materiel: "aucun",
    zoneCorps: "full_body",
    typeSeance: "mobilite",
    isSansSaut: true,
    isAvecSaut: false,
    photoUrl: "/images/workouts/wk-07.jpg",
    caloriesMin: 70,
    caloriesMax: 110,
    ordreAffichage: 7,
  },
  {
    idWorkout: "wk-08",
    slug: "posture-dos-anti-raideur",
    titre: {
      fr: "Posture & Dos Anti-Raideur",
      en: "Posture & Back Relief",
      es: "Postura y Espalda Anti-Rigidez",
      ar: "وضعية الظهر وتخفيف التيبس",
      pt: "Postura e Costas Sem Rigidez",
      de: "Haltung & Rücken Gegen Steifheit",
      it: "Postura e Schiena Anti-Rigidità",
      wo: "Taxawu Gannaaw Ak Wàññi Dëgëray",
    },
    description: {
      fr: "Soulage les tensions liées à la position assise prolongée.",
      en: "Relieves stiffness caused by prolonged sitting.",
      es: "Alivia la rigidez por estar sentado mucho tiempo.",
      ar: "يخفف الشد الناتج عن الجلوس الطويل.",
      pt: "Alivia a rigidez causada por ficar muito tempo sentado.",
      de: "Löst Verspannungen durch langes Sitzen.",
      it: "Allevia le rigidità da posizione seduta prolungata.",
      wo: "Wàññi coono bi jóge ci toog lu yàgg.",
    },
    dureeIndicativeMin: 15,
    dureeCalculeeSec: 900,
    niveau: "debutant",
    materiel: "aucun",
    zoneCorps: "dos",
    typeSeance: "mobilite",
    isSansSaut: true,
    isAvecSaut: false,
    photoUrl: "/images/workouts/wk-08.jpg",
    caloriesMin: 75,
    caloriesMax: 120,
    ordreAffichage: 8,
  },
  {
    idWorkout: "wk-09",
    slug: "equilibre-controle-corporel",
    titre: {
      fr: "Équilibre & Contrôle Corporel",
      en: "Balance & Body Control",
      es: "Equilibrio y Control Corporal",
      ar: "توازن وتحكم في الجسم",
      pt: "Equilíbrio e Controle Corporal",
      de: "Balance & Körperkontrolle",
      it: "Equilibrio e Controllo Corporeo",
      wo: "Dëppale Ak Saytu Sa Yaram",
    },
    description: {
      fr: "Appuis unipodaux, coordination et gainage dynamique.",
      en: "Single-leg balance, coordination, and dynamic control.",
      es: "Apoyos a una pierna, coordinación y control.",
      ar: "توازن على قدم واحدة وتناسق حركي وتحكم.",
      pt: "Apoio unipodal, coordenação e controle.",
      de: "Einbeinstand, Koordination und Kontrolle.",
      it: "Appoggio monopodalico, coordinazione e controllo.",
      wo: "Taxaw ci benn tank, dëppale ak saytu.",
    },
    dureeIndicativeMin: 16,
    dureeCalculeeSec: 960,
    niveau: "intermediaire",
    materiel: "aucun",
    zoneCorps: "full_body",
    typeSeance: "equilibre",
    isSansSaut: true,
    isAvecSaut: false,
    photoUrl: "/images/workouts/wk-09.jpg",
    caloriesMin: 95,
    caloriesMax: 145,
    ordreAffichage: 9,
  },
  {
    idWorkout: "wk-10",
    slug: "retour-au-calme-recuperation",
    titre: {
      fr: "Retour au Calme & Récupération",
      en: "Cool Down & Recovery",
      es: "Vuelta a la Calma y Recuperación",
      ar: "تهدئة واستشفاء عضلي",
      pt: "Volta à Calma e Recuperação",
      de: "Cool-Down & Regeneration",
      it: "Defaticamento e Recupero",
      wo: "Wàcc Ci Dal Ak Noppalu",
    },
    description: {
      fr: "Respiration lente et relâchement musculaire après l'effort.",
      en: "Slow breathing and muscle release after exercise.",
      es: "Respiración lenta y relajación muscular tras el esfuerzo.",
      ar: "تنفس بطيء واسترخاء عضلي بعد المجهود.",
      pt: "Respiração lenta e relaxamento após o esforço.",
      de: "Ruhige Atmung und Muskelentspannung nach dem Training.",
      it: "Respirazione lenta e rilascio muscolare post-allenamento.",
      wo: "Nox bu ndank ak noppalu sàpp yi ginnaaw liggéey.",
    },
    dureeIndicativeMin: 12,
    dureeCalculeeSec: 720,
    niveau: "debutant",
    materiel: "aucun",
    zoneCorps: "full_body",
    typeSeance: "recuperation",
    isSansSaut: true,
    isAvecSaut: false,
    photoUrl: "/images/workouts/wk-10.jpg",
    caloriesMin: 55,
    caloriesMax: 90,
    ordreAffichage: 10,
  },
];

const EXERCISE_TEMPLATES: ExerciseTemplateInput[] = [
  {
    nom: {
      fr: "Squat Poids du Corps",
      en: "Bodyweight Squat",
      es: "Sentadilla Sin Peso",
      ar: "قرفصاء بوزن الجسم",
      pt: "Agachamento Livre",
      de: "Kniebeuge Ohne Gewicht",
      it: "Squat a Corpo Libero",
      wo: "Suuxat Ci Sa Yaram",
    },
    description: {
      fr: "Flexion contrôlée des hanches et genoux buste droit.",
      en: "Controlled hip and knee bend with upright chest.",
      es: "Flexión controlada de cadera y rodillas con torso erguido.",
      ar: "ثني متحكم فيه للوركين والركبتين مع استقامة الظهر.",
      pt: "Flexão controlada de quadril e joelhos com tronco ereto.",
      de: "Kontrolliertes Beugen von Hüfte und Knien bei aufrechtem Oberkörper.",
      it: "Flessione controllata di anche e ginocchia con busto eretto.",
      wo: "Wàññi ndigg ak óom yi te gannaaw bi wér.",
    },
    positionDepart: "Pieds largeur épaules, orteils légèrement ouverts.",
    instructionsExecution: "Pousse les hanches vers l'arrière, descends jusqu'à la parallèle puis remonte en poussant sur les talons.",
    respiration: "Inspire à la descente, expire à la remontée.",
    erreursAEviter: "Genoux qui rentrent vers l'intérieur ou talons qui décollent.",
    consignesSecurite: "Garde le dos neutre et le regard vers l'avant.",
    varianteDebutant: "Amplitude réduite ou appui léger sur un dossier de chaise.",
    varianteAvancee: "Pause de 2 secondes en bas du mouvement.",
    modeMesure: "reps",
    repetitionsCible: 12,
    muscleCible: "Quadriceps & Fessiers",
    isSansSaut: true,
  },
  {
    nom: {
      fr: "Planche Frontale",
      en: "Front Plank",
      es: "Plancha Frontal",
      ar: "بلانش أمامي",
      pt: "Prancha Frontal",
      de: "Unterarmstütz",
      it: "Plank Frontale",
      wo: "Taxawu Ci Biir",
    },
    description: {
      fr: "Gainage isométrique alignant tête, épaules, bassin et talons.",
      en: "Isometric core hold aligning head, shoulders, hips, and heels.",
      es: "Isométrico de core alineando cabeza, hombros, cadera y talones.",
      ar: "ثبات عضلات الجذع بمحاذاة الرأس والكتفين والحوض والكعبين.",
      pt: "Prancha isométrica alinhando cabeça, ombros, quadril e calcanhares.",
      de: "Statische Rumpfspannung in gerader Linie von Kopf bis Ferse.",
      it: "Tenuta isometrica allineando testa, spalle, bacino e talloni.",
      wo: "Taxaw ci biir te yaram wi tàlliku lu jub.",
    },
    positionDepart: "Avant-bras au sol, coudes sous les épaules, jambes tendues.",
    instructionsExecution: "Contracte les abdos et les fessiers sans creuser les lombaires ni lever excessivement le bassin.",
    respiration: "Respiration régulière et calme sans bloquer le souffle.",
    erreursAEviter: "Reins creusés ou fessiers trop hauts.",
    consignesSecurite: "Arrête la série dès que le bassin s'affaisse.",
    varianteDebutant: "Genoux posés au sol en gardant l'alignement.",
    varianteAvancee: "Maintien sur les mains en position planche haute.",
    modeMesure: "temps",
    dureeCibleSec: 30,
    muscleCible: "Sangle abdominale",
    isSansSaut: true,
  },
  {
    nom: {
      fr: "Fente Arrière Alternée",
      en: "Alternating Reverse Lunge",
      es: "Zancada Atrás Alterna",
      ar: "طعنة خلفية متبادلة",
      pt: "Avanço para Trás Alternado",
      de: "Rückwärtsschritt Im Wechsel",
      it: "Affondo Indietro Alternato",
      wo: "Jéggi Ci Ginnaaw Ci Benn-Benn",
    },
    description: {
      fr: "Pas en arrière contrôlé pour solliciter fessiers et cuisses en douceur.",
      en: "Controlled step back to work glutes and thighs smoothly.",
      es: "Paso atrás controlado para trabajar glúteos y muslos.",
      ar: "خطوة للخلف بتحكم لتشغيل المؤخرة والفخذين بسلاسة.",
      pt: "Passo para trás controlado para trabalhar glúteos e coxas.",
      de: "Kontrollierter Schritt nach hinten für Gesäß und Oberschenkel.",
      it: "Passo indietro controllato per glutei e cosce.",
      wo: "Jéggi ci ginnaaw ndank ngir liggéeyal tànk ak lëg yi.",
    },
    positionDepart: "Debout, pieds joints, mains sur les hanches.",
    instructionsExecution: "Recule un pied, fléchis les deux genoux à 90°, puis pousse sur le pied avant pour revenir.",
    respiration: "Inspire en reculant, expire en revenant debout.",
    erreursAEviter: "Genou avant qui dépasse largement la pointe du pied.",
    consignesSecurite: "Garde le buste vertical et le pas assez long.",
    varianteDebutant: "Amplitude courte sans toucher le sol du genou arrière.",
    varianteAvancee: "Enchaînement fluide sans poser le pied arrière au retour.",
    modeMesure: "reps",
    repetitionsCible: 10,
    parCoteOuJambe: true,
    muscleCible: "Fessiers & Quadriceps",
    isSansSaut: true,
  },
  {
    nom: {
      fr: "Pompes Surélevées ou Sol",
      en: "Push-Ups",
      es: "Flexiones",
      ar: "تمرين الضغط",
      pt: "Flexões de Braço",
      de: "Liegestütze",
      it: "Piegamenti sulle Braccia",
      wo: "Tëdd-Jóg Ci Loxo Yi",
    },
    description: {
      fr: "Renforcement des pectoraux, triceps et épaules au poids du corps.",
      en: "Bodyweight strengthening for chest, triceps, and shoulders.",
      es: "Fortalecimiento de pecho, tríceps y hombros.",
      ar: "تقوية الصدر والترايسبس والكتفين بوزن الجسم.",
      pt: "Fortalecimento de peitoral, tríceps e ombros.",
      de: "Kräftigung
