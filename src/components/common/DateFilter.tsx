
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import type { DateFilterProps, DateFilterOption } from '@/types/index';
import { useTranslation } from 'react-i18next';
import { DayPicker, DateRange } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { enGB, uk } from 'date-fns/locale';
import 'react-day-picker/dist/style.css'; // Start with default styles, we'll override

export const DateFilter: React.FC<DateFilterProps> = ({ value, onChange, customRange, onCustomChange }) => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial state from props
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
        from: customRange.start ? parseISO(customRange.start) : undefined,
        to: customRange.end ? parseISO(customRange.end) : undefined,
    });

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

    // Sync state when opening or when props change
    useEffect(() => {
        if (isOpen && value === 'custom') {
            setSelectedRange({
                from: customRange.start ? parseISO(customRange.start) : undefined,
                to: customRange.end ? parseISO(customRange.end) : undefined,
            });
        }
    }, [isOpen, customRange, value]);

    const handleApplyCustom = () => {
        if (selectedRange?.from && selectedRange?.to) {
            // Ensure correct order
            const start = selectedRange.from < selectedRange.to ? selectedRange.from : selectedRange.to;
            const end = selectedRange.to > selectedRange.from ? selectedRange.to : selectedRange.from;

            onCustomChange({
                start: format(start, 'yyyy-MM-dd'),
                end: format(end, 'yyyy-MM-dd')
            });
            onChange('custom');
            setIsOpen(false);
        }
    };

    const currentLabel = value === 'custom' && customRange.start && customRange.end
        ? `${format(parseISO(customRange.start), 'dd MMM yyyy', { locale: i18n.language === 'uk' ? uk : enGB })} - ${format(parseISO(customRange.end), 'dd MMM yyyy', { locale: i18n.language === 'uk' ? uk : enGB })}`
        : t(options.find(o => o.id === value)?.labelKey || 'dateFilter.allTime');

    // Get the locale object for DayPicker
    const locale = i18n.language === 'uk' ? uk : enGB;

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
                <span className="truncate max-w-[180px]">{currentLabel}</span>
                <Icons.ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/40 ring-1 ring-black/5 p-4 z-50 animate-in fade-in zoom-in-95 duration-100 flex flex-col md:flex-row gap-4 min-w-[320px]">
                    <div className="flex flex-col gap-1 min-w-[140px]">
                        <span className="text-[10px] uppercase font-bold text-slate-400 mb-2 px-2">{t('dateFilter.presets', 'Presets')}</span>
                        {options.filter(o => o.id !== 'custom').map(option => (
                            <button
                                key={option.id}
                                onClick={() => { onChange(option.id); setIsOpen(false); }}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${value === option.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
                            >
                                <span className="text-xs">{t(option.labelKey)}</span>
                                {value === option.id && <Icons.Check size={12} className="ml-auto text-indigo-600" />}
                            </button>
                        ))}
                    </div>

                    <div className="border-l border-slate-100 pl-4">
                        <span className="text-[10px] uppercase font-bold text-slate-400 mb-2 block">{t('dateFilter.customRange', 'Custom Range')}</span>
                        <style>{`
                            .rdp { --rdp-cell-size: 32px; --rdp-accent-color: #4f46e5; --rdp-background-color: #eef2ff; margin: 0; }
                            .rdp-day_selected:not([disabled]) { color: white; background-color: var(--rdp-accent-color); }
                            .rdp-day_selected:hover:not([disabled]) { background-color: var(--rdp-accent-color); }
                            .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #f1f5f9; }
                         `}</style>
                        <DayPicker
                            mode="range"
                            selected={selectedRange}
                            onSelect={setSelectedRange}
                            locale={locale}
                            showOutsideDays
                            fixedWeeks
                            numberOfMonths={1}
                            pagedNavigation
                            className="bg-white rounded-lg p-2 border border-slate-100 shadow-sm"
                        />
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                            >
                                {t('common.cancel', 'Cancel')}
                            </button>
                            <button
                                onClick={handleApplyCustom}
                                disabled={!selectedRange?.from || !selectedRange?.to}
                                className="px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                {t('dateFilter.applyRange', 'Apply')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
