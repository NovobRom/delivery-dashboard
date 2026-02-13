
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import type { DateFilterProps, DateFilterOption } from '@/types/index';
import { useTranslation } from 'react-i18next';

export const DateFilter: React.FC<DateFilterProps> = ({ value, onChange, customRange, onCustomChange }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Temporary state for inputs inside the dropdown
    const [tempStart, setTempStart] = useState(customRange.start);
    const [tempEnd, setTempEnd] = useState(customRange.end);

    const options: DateFilterOption[] = [
        { id: 'all', labelKey: 'dateFilter.allTime' },
        { id: 'this_month', labelKey: 'dateFilter.thisMonth' },
        { id: 'last_month', labelKey: 'dateFilter.lastMonth' },
        { id: 'this_week', labelKey: 'dateFilter.thisWeek' },
        { id: 'last_7', labelKey: 'dateFilter.last7Days' },
        { id: 'custom', labelKey: 'dateFilter.customRange' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sync temp state when opening
    useEffect(() => {
        if (isOpen) {
            setTempStart(customRange.start);
            setTempEnd(customRange.end);
        }
    }, [isOpen, customRange]);

    const handleApplyCustom = () => {
        onCustomChange({ start: tempStart, end: tempEnd });
        onChange('custom');
        setIsOpen(false);
    };

    const currentLabel = value === 'custom' && customRange.start && customRange.end
        ? `${customRange.start.slice(5)} - ${customRange.end.slice(5)}`
        : t(options.find(o => o.id === value)?.labelKey || 'dateFilter.allTime');

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${isOpen || value !== 'all'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
            >
                <Icons.Calendar size={14} className={value !== 'all' ? "text-indigo-600" : "text-slate-400"} />
                <span className="truncate max-w-[120px]">{currentLabel}</span>
                <Icons.ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-56 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/40 ring-1 ring-black/5 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col">
                    <div className="mb-2 border-b border-slate-100 pb-1">
                        {options.filter(o => o.id !== 'custom').map(option => (
                            <div
                                key={option.id}
                                onClick={() => { onChange(option.id); setIsOpen(false); }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${value === option.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
                            >
                                <span className="text-xs">{t(option.labelKey)}</span>
                                {value === option.id && <Icons.Check size={12} className="ml-auto text-indigo-600" />}
                            </div>
                        ))}
                    </div>

                    {/* Custom Range Inputs */}
                    <div className="px-3 pb-2 pt-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 mb-2 block">{t('dateFilter.customRange')}</span>
                        <div className="space-y-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-slate-500 font-medium">{t('dateFilter.startDate', 'Start Date')}</label>
                                <input
                                    type="date"
                                    value={tempStart}
                                    onChange={(e) => setTempStart(e.target.value)}
                                    className="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-600 bg-slate-50/50"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-[10px] text-slate-500 font-medium">{t('dateFilter.endDate', 'End Date')}</label>
                                <input
                                    type="date"
                                    value={tempEnd}
                                    onChange={(e) => setTempEnd(e.target.value)}
                                    className="w-full text-xs border border-slate-200 rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-600 bg-slate-50/50"
                                />
                            </div>
                            <button
                                onClick={handleApplyCustom}
                                disabled={!tempStart || !tempEnd}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1.5 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {t('dateFilter.applyRange', 'Apply Range')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
