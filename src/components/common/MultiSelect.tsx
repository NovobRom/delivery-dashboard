
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import type { MultiSelectProps } from '@/types/index';

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange, label = "Select", icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    const isAllSelected = options.length > 0 && selected.length === options.length;

    const toggleAll = () => {
        if (isAllSelected) {
            onChange([]); // Deselect all (Empty = All)
        } else {
            onChange(options); // Select all explicitly
        }
    };

    // Calculate label to show on button
    const getButtonLabel = () => {
        if (selected.length === 0) return label;
        if (selected.length === options.length) return `All (${options.length})`;
        if (selected.length === 1) return selected[0].length > 15 ? selected[0].substring(0, 12) + '...' : selected[0];
        return `${selected.length} Selected`;
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${isOpen || selected.length > 0
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm'
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-500'
                    }`}
            >
                {Icon && <Icon size={14} className={selected.length > 0 ? "text-indigo-600" : "text-slate-400"} />}
                <span>{getButtonLabel()}</span>
                {!Icon && <Icons.ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/40 ring-1 ring-black/5 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {/* Select All Option */}
                    <div
                        onClick={toggleAll}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors border-b border-slate-100 mb-1 pb-2"
                    >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isAllSelected || selected.length === 0 ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                            {(isAllSelected || selected.length === 0) && <Icons.Check size={10} className="text-white" />}
                        </div>
                        <span className="text-xs font-bold text-slate-700">Select All</span>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-0.5">
                        {options.length > 0 ? (
                            options.map(option => {
                                const isSelected = selected.includes(option);
                                return (
                                    <div
                                        key={option}
                                        onClick={() => toggleOption(option)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                            {isSelected && <Icons.Check size={10} className="text-white" />}
                                        </div>
                                        <span className={`text-xs truncate ${isSelected ? 'text-indigo-900 font-medium' : 'text-slate-600'}`}>
                                            {option}
                                        </span>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="px-3 py-4 text-center text-xs text-slate-400 italic">
                                No items found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
