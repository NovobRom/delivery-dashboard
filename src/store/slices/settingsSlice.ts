import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SettingsState } from '@types/index';

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            language: 'en',

            setLanguage: (lang: 'en' | 'uk') => {
                set({ language: lang });
                localStorage.setItem('language', lang);
            },
        }),
        {
            name: 'delivery-dashboard-settings',
        }
    )
);
