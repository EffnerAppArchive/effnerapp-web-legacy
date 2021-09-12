import {StatusBar, Style} from '@capacitor/status-bar';
import {saveDarkMode, saveLaunched} from '@/tools/storage';
import store from '@/store';

export const toggleDarkTheme = async (shouldAdd: boolean): Promise<void> => {
    document.body.classList.toggle('dark', shouldAdd);
    await StatusBar.setStyle({style: shouldAdd ? Style.Dark : Style.Light});
    await saveDarkMode(shouldAdd);
};

export const initTheme = async (): Promise<void> => {
    if(store.getters.isFirstLaunch) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        console.log('Initializing dark mode to: ' + prefersDark.matches);
        await toggleDarkTheme(prefersDark.matches);
        await saveLaunched();
    } else  {
        await toggleDarkTheme(store.getters.getDarkMode);
    }
};
