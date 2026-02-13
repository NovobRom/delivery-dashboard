import React, { useState, useEffect } from 'react';
import { Icons } from '@/components/common/Icons';
import { SCHEMA_FIELDS } from '@/types/schema';
import { guessMapping } from '@/utils/mapper';

interface MappingModalProps {
    isOpen: boolean;
    onClose: () => void;
    csvHeaders: string[];
    onConfirm: (mapping: Record<string, string>) => void;
}

export const MappingModal: React.FC<MappingModalProps> = ({ isOpen, onClose, csvHeaders, onConfirm }) => {
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<boolean>(false);

    // Auto-guess mapping when headers change or modal opens
    useEffect(() => {
        if (isOpen && csvHeaders.length > 0) {
            const guessed = guessMapping(csvHeaders);
            setMapping(guessed);
        }
    }, [isOpen, csvHeaders]);

    const handleMappingChange = (key: string, value: string) => {
        setMapping(prev => ({ ...prev, [key]: value }));
        setTouched(true);
    };

    const getMissingFields = () => {
        return SCHEMA_FIELDS.filter(field => field.required && !mapping[field.key]);
    };

    const missingFields = getMissingFields();
    const isValid = missingFields.length === 0;

    const handleSubmit = () => {
        if (isValid) {
            onConfirm(mapping);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Icons.Upload size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Import Data</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Map your CSV columns to the database fields</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <Icons.X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 mb-2 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            <div>Target Field</div>
                            <div>CSV Column</div>
                        </div>

                        {SCHEMA_FIELDS.map((field) => (
                            <div key={field.key} className="grid grid-cols-2 gap-4 items-center group">
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-medium ${field.required ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                        {field.label}
                                    </span>
                                    {field.required && <span className="text-red-500 text-xs">*</span>}
                                    {/* Validated checkmark */}
                                    {mapping[field.key] && (
                                        <span className="text-green-500 animate-in fade-in zoom-in duration-300">
                                            <Icons.CheckCircle size={14} />
                                        </span>
                                    )}
                                </div>

                                <select
                                    value={mapping[field.key] || ''}
                                    onChange={(e) => handleMappingChange(field.key, e.target.value)}
                                    className={`
                                        w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all
                                        bg-white dark:bg-gray-800 
                                        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                        ${!mapping[field.key] && field.required && touched
                                            ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/10'
                                            : 'border-gray-200 dark:border-gray-700'
                                        }
                                    `}
                                >
                                    <option value="">-- Select Column --</option>
                                    {csvHeaders.map((header) => (
                                        <option key={header} value={header}>
                                            {header}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-2xl flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        {isValid ? (
                            <span className="text-green-600 flex items-center gap-1.5">
                                <Icons.CheckCircle size={16} /> All required fields mapped
                            </span>
                        ) : (
                            <span className="text-amber-600 flex items-center gap-1.5">
                                <Icons.AlertTriangle size={16} /> {missingFields.length} required fields missing
                            </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!isValid}
                            className={`
                                px-6 py-2 text-sm font-medium rounded-lg text-white shadow-lg shadow-indigo-500/20 transition-all
                                ${isValid
                                    ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'
                                    : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed text-gray-500'
                                }
                            `}
                        >
                            Import Data
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
