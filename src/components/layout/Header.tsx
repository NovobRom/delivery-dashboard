
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsStore, useFiltersStore, useDataStore } from '@/store';
import { Icons } from '@/components/common/Icons';
import { MultiSelect } from '@/components/common/MultiSelect';
import { DateFilter } from '@/components/common/DateFilter';

export const Header: React.FC = () => {
    const { t } = useTranslation();
    const { language, setLanguage } = useSettingsStore();

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
        <header className="glass-header sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                        <Icons.Globe size={22} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-tight">
                            {t('header.title')}
                            <span className="text-indigo-600">{t('header.titleAccent')}</span>
                        </h1>

                        <div className="flex items-center gap-2 mt-1">
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
                </div>

                <div className="flex items-center gap-4">
                    {/* Date Filter */}
                    <DateFilter
                        value={dateRange}
                        onChange={setDateRange}
                        customRange={customDateRange}
                        onCustomChange={setCustomDateRange}
                    />

                    {/* Language Switcher */}
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'uk' : 'en')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                        {language === 'en' ? '🇺🇦 UA' : '🇬🇧 EN'}
                    </button>

                    {/* Upload Button */}
                    <label className="group relative flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 shadow-md hover:shadow-indigo-500/30 overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <Icons.Upload size={18} className="relative z-10" />
                        <span className="text-sm font-medium relative z-10 hidden sm:inline">{t('header.uploadButton', 'Upload')}</span>
                        <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>
            </div>
        </header>
    );
};
