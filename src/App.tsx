import { useTranslation } from 'react-i18next';
import { useDataStore, useFiltersStore, useSettingsStore } from '@store';

function App() {
    const { t, i18n } = useTranslation();
    const { language, setLanguage } = useSettingsStore();

    // Sync i18n with store
    React.useEffect(() => {
        i18n.changeLanguage(language);
    }, [language, i18n]);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="glass-header sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <span className="text-xl">🚚</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                                {t('header.title')}
                                <span className="text-indigo-600">{t('header.titleAccent')}</span>
                            </h1>
                            <p className="text-xs text-slate-500 mt-0.5">v10.0 - Refactored Edition</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Language Switcher */}
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'uk' : 'en')}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                            {language === 'en' ? '🇺🇦 UA' : '🇬🇧 EN'}
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="text-center py-20">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">
                        🚧 {t('header.title')} {t('header.titleAccent')} - In Progress
                    </h2>
                    <p className="text-slate-600 mb-8">
                        Структура проєкту створена. Компоненти в процесі розробки.
                    </p>
                    <div className="max-w-2xl mx-auto text-left bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg">
                        <h3 className="text-lg font-bold mb-4">✅ Що вже готово:</h3>
                        <ul className="space-y-2 text-sm text-slate-700">
                            <li>✅ Конфігурація проєкту (Vite, TypeScript, Tailwind)</li>
                            <li>✅ Структура директорій</li>
                            <li>✅ TypeScript типи</li>
                            <li>✅ i18n (українська та англійська)</li>
                            <li>✅ Zustand stores</li>
                            <li>✅ Утиліти (парсинг CSV, обчислення, дати)</li>
                            <li>✅ Іконки</li>
                            <li>✅ Базові компоненти</li>
                        </ul>

                        <h3 className="text-lg font-bold mt-6 mb-4">⏳ Що потрібно завершити:</h3>
                        <ul className="space-y-2 text-sm text-slate-700">
                            <li>⏳ Решта React компонентів (StatCard, MultiSelect, DateFilter, etc.)</li>
                            <li>⏳ Компоненти графіків</li>
                            <li>⏳ Dashboard та Leaderboard</li>
                            <li>⏳ Layout компоненти</li>
                        </ul>

                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900">
                                <strong>Наступні кроки:</strong><br />
                                1. Попросіть адміністратора встановити Node.js<br />
                                2. Запустіть <code className="bg-blue-100 px-2 py-0.5 rounded">npm install</code><br />
                                3. Я допоможу завершити решту компонентів
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-auto py-8">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-400 text-xs flex items-center justify-center gap-2">
                        <span>© 2026 Roman Novobranets. {t('footer.copyright')}.</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{t('footer.version')} v10.0</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
