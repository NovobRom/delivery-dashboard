
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore, useFiltersStore, useDataStore } from '@/store';
import { Icons } from '@/components/common/Icons';
import { MultiSelect } from '@/components/common/MultiSelect';
import { DateFilter } from '@/components/common/DateFilter';
import { HelpModal } from '@/components/common/HelpModal';

export const Header: React.FC = () => {
    const { t } = useTranslation();
    const { language, setLanguage } = useSettingsStore();
    const [showHelp, setShowHelp] = useState(false);

    // Filters
    const {
        selectedUnits, setSelectedUnits,
        dateRange, setDateRange,
        customDateRange, setCustomDateRange
    } = useFiltersStore();

    // Data for selectors
    const { fullData, setRawData } = useDataStore();

    // Get unique units
    const uniqueUnits = React.useMemo(() => {
        const units = [...new Set(fullData.map(d => d.unit))];
        return units.filter(u => u && u !== 'Unknown').sort();
    }, [fullData]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    setRawData(text);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <>
            <header className="glass-header sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Logo Section */}
                        <div className="bg-red-600 p-1.5 rounded-lg shadow-lg shadow-red-500/20 flex items-center justify-center w-10 h-10">
                            <img
                                src="/nova-poshta.svg"
                                alt="Nova Poshta"
                                className="w-full h-full invert brightness-0"
                            />
                        </div>

                        {/* Title Section */}
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent tracking-tight leading-tight">
                                Delivery Analytics
                            </h1>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                                Developed by Roman Novobranets
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-2 ml-4 border-l border-gray-200 pl-4">
                            {uniqueUnits.length > 0 ? (
                                <MultiSelect
                                    options={uniqueUnits}
                                    selected={selectedUnits}
                                    onChange={setSelectedUnits}
                                    label={t('header.selectRegions')}
                                    icon={Icons.MapPin}
                                />
                            ) : (
                                <div className="text-xs text-slate-400 flex items-center gap-1">
                                    <Icons.MapPin size={12} />
                                    <span>{t('header.noLocations')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block">
                            <DateFilter
                                value={dateRange}
                                onChange={setDateRange}
                                customRange={customDateRange}
                                onCustomChange={setCustomDateRange}
                            />
                        </div>

                        {/* Help Button */}
                        <button
                            onClick={() => setShowHelp(true)}
                            className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                            title={language === 'en' ? 'User Manual' : 'Посібник користувача'}
                        >
                            <Icons.HelpCircle size={18} />
                        </button>

                        {/* Language Switcher */}
                        <button
                            onClick={() => setLanguage(language === 'en' ? 'uk' : 'en')}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-all border border-transparent hover:border-slate-300 dark:hover:border-gray-500"
                            title={language === 'en' ? 'Switch to Ukrainian' : 'Switch to English'}
                        >
                            {language === 'en' ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-5 h-3.5 shadow-sm rounded-[2px] object-cover">
                                        <path fill="#012169" d="M0 0h640v480H0z" />
                                        <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-179L0 62V0h75z" />
                                        <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z" />
                                        <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
                                        <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
                                    </svg>
                                    <span>EN</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-5 h-3.5 shadow-sm rounded-[2px] object-cover">
                                        <g fill-rule="evenodd" stroke-width="1pt">
                                            <path fill="#ffd700" d="M0 240h640v240H0z" />
                                            <path fill="#0057b8" d="M0 0h640v240H0z" />
                                        </g>
                                    </svg>
                                    <span>UA</span>
                                </>
                            )}
                        </button>

                        {/* Upload Button */}
                        <label className="group relative flex items-center gap-2 bg-slate-900 dark:bg-red-600 hover:bg-indigo-600 dark:hover:bg-red-700 text-white px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <Icons.Upload size={18} className="relative z-10" />
                            <span className="text-sm font-medium relative z-10 hidden sm:inline">{t('header.uploadButton', 'Upload')}</span>
                            <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>
                </div>
            </header>

            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
        </>
    );
};
