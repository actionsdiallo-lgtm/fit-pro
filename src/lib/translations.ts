export type Lang = 'fr' | 'en' | 'es' | 'pt' | 'ar' | 'zh' | 'ru';

export const languages: { code: Lang; label: string; flag: string }[] = [
  { code: 'fr' as Lang, label: 'Français', flag: '🇫🇷' },
  { code: 'en' as Lang, label: 'English', flag: '🇺🇸' },
  { code: 'es' as Lang, label: 'Español', flag: '🇪🇸' },
  { code: 'pt' as Lang, label: 'Português', flag: '🇵🇹' },
  { code: 'ar' as Lang, label: 'العربية', flag: '🇸🇦' },
  { code: 'zh' as Lang, label: '中文', flag: '🇨🇳' },
  { code: 'ru' as Lang, label: 'Русский', flag: '🇷🇺' },
];

export const translations = {
  fr: { home: 'Accueil', workouts: 'Entraînements', workoutsShort: 'Entraîn.', nutrition: 'Nutrition', stats: 'Stats', profile: 'Profil', welcome: 'Bienvenue', calories: 'Calories', sessions: 'Séances', language: 'Langue' },
  en: { home: 'Home', workouts: 'Workouts', workoutsShort: 'Workouts', nutrition: 'Nutrition', stats: 'Stats', profile: 'Profile', welcome: 'Welcome', calories: 'Calories', sessions: 'Sessions', language: 'Language' },
  es: { home: 'Inicio', workouts: 'Entrenamientos', workoutsShort: 'Entren.', nutrition: 'Nutrición', stats: 'Estadísticas', profile: 'Perfil', welcome: 'Bienvenido', calories: 'Calorías', sessions: 'Sesiones', language: 'Idioma' },
  pt: { home: 'Início', workouts: 'Treinos', workoutsShort: 'Treinos', nutrition: 'Nutrição', stats: 'Estatísticas', profile: 'Perfil', welcome: 'Bem-vindo', calories: 'Calorias', sessions: 'Sessões', language: 'Idioma' },
  ar: { home: 'الرئيسية', workouts: 'التمارين', workoutsShort: 'تمارين', nutrition: 'التغذية', stats: 'الإحصائيات', profile: 'الملف', welcome: 'مرحباً', calories: 'السعرات', sessions: 'الجلسات', language: 'اللغة' },
  zh: { home: '首页', workouts: '训练', workoutsShort: '训练', nutrition: '营养', stats: '统计', profile: '个人', welcome: '欢迎', calories: '卡路里', sessions: '课程', language: '语言' },
  ru: { home: 'Главная', workouts: 'Тренировки', workoutsShort: 'Тренир.', nutrition: 'Питание', stats: 'Статистика', profile: 'Профиль', welcome: 'Добро пожаловать', calories: 'Калории', sessions: 'Занятия', language: 'Язык' },
};
