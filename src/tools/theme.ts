import {StatusBar, Style} from '@capacitor/status-bar';
import {saveDarkMode, saveLaunched, saveTheme, saveTimetableColorTheme} from '@/tools/storage';
import store from '@/store';
import {isPlatform} from '@ionic/vue';
import {isNative} from '@/tools/helper';

export const toggleDarkTheme = async (shouldAdd: boolean): Promise<void> => {
    document.body.classList.toggle('dark', shouldAdd);

    if (isNative() && isPlatform('ios')) {
        await StatusBar.setStyle({style: shouldAdd ? Style.Dark : Style.Light});
    }

    await saveDarkMode(shouldAdd);
};

export const setTimetableColorTheme = async (id: number): Promise<void> => {
    await saveTimetableColorTheme(id);
};

export const setExperimentalTheme = async (id: number): Promise<void> => {
    await saveTheme(id);
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

export const EXPERIMENTAL_THEME_VALUES = [
    'Default',
    'sieht komisch aus',
    'Julian Legacy',
    'Theo',
    'Sebi',
    'Luis gefällt das nicht',
    '69',
    'Julian',
    'Pride',
    'Plain dark',
    'Unter wasser'
];
