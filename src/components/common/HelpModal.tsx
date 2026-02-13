
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Icons } from '@/components/common/Icons';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
    const { i18n } = useTranslation();
    const [content, setContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        setIsLoading(true);
        const lang = i18n.language === 'uk' ? 'uk' : 'en';

        fetch(`/docs/${lang}/manual.md`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load manual');
                return res.text();
            })
            .then(text => setContent(text))
            .catch(() => setContent('# Error\n\nCould not load the manual.'))
            .finally(() => setIsLoading(false));
    }, [isOpen, i18n.language]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-3xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-700 flex flex-col overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">
                            <Icons.FileText size={18} />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-gray-100">
                            {i18n.language === 'uk' ? 'Посібник користувача' : 'User Manual'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Icons.X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <article className="help-manual-content">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        </article>
                    )}
                </div>
            </div>
        </div>
    );
};
