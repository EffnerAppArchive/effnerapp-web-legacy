import {StatusBar, Style} from '@capacitor/status-bar';
import {saveDarkMode, saveLaunched, saveTimetableColorTheme} from '@/tools/storage';
import store from '@/store';

export const toggleDarkTheme = async (shouldAdd: boolean): Promise<void> => {
    document.body.classList.toggle('dark', shouldAdd);
    await StatusBar.setStyle({style: shouldAdd ? Style.Dark : Style.Light});
    await saveDarkMode(shouldAdd);
};

export const setTimetableColorTheme = async (id: number): Promise<void> => {
    await saveTimetableColorTheme(id);
};

export const initTheme = async (): Promise<void> => {
    if (store.getters.isFirstLaunch) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        console.log('Initializing dark mode to: ' + prefersDark.matches);
        await toggleDarkTheme(prefersDark.matches);
        await saveLaunched();
    } else {
        await toggleDarkTheme(store.getters.getDarkMode);
    }
};

export const TIMETABLE_COLOR_THEME_KEYS = [
    'transparent',
    '#ebc334',
    '#34eb52',
    '#349eeb',
    '#00bf99',
    '#e85b5b'
];

export const TIMETABLE_COLOR_THEME_VALUES = [
    'Kunterbunt',
    'Schwarz/Weiß',
    'Gelb',
    'Grün',
    'Blau',
    'Türkis',
    'Rot'
];
