import React, { useEffect } from 'react';
import { Icons } from './Icons';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
    duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColors = {
        success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
        error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
        info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    };

    const Icon = type === 'success' ? Icons.CheckCircle : type === 'error' ? Icons.AlertCircle : Icons.Activity;

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-in slide-in-from-bottom-5 fade-in ${bgColors[type]}`}>
            <Icon size={20} />
            <span className="font-medium text-sm">{message}</span>
            <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
                <Icons.X size={16} />
            </button>
        </div>
    );
};
