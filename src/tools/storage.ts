import {Storage} from '@capacitor/storage';
import store from '../store';

export async function loadStorage() {
    const credentials = await Storage.get({key: 'APP_CREDENTIALS'});
    const sClass = await Storage.get({key: 'APP_USER_CLASS'});
    const mvvState = await Storage.get({key: 'APP_MVV_STATE'});
    const notificationsEnabled = await Storage.get({key: 'APP_NOTIFICATIONS'});
    const launched = await Storage.get({key: 'APP_LAUNCHED'});
    const darkMode = await Storage.get({key: 'APP_DARK_MODE'});

    if(credentials && credentials.value) {
        store.commit('setCredentials', credentials.value);
        store.commit('setRegistered', !!credentials.value);
    }

    if(sClass && sClass.value) {
        store.commit('setClass', sClass.value);
    }

    if(mvvState && mvvState.value) {
        store.commit('setMVVState', JSON.parse(mvvState.value));
    }

    if(notificationsEnabled.value === 'true') {
        store.commit('setNotificationsEnabled', true);
    }

    if(launched && launched.value === 'true') {
        store.commit('setFirstLaunch', false);
    }

    if(darkMode && darkMode.value === 'true') {
        store.commit('setDarkMode', true);
    }
}

export async function saveCredentials(credentials: string, sClass: string) {
    store.commit('setCredentials', credentials);
    store.commit('setRegistered', !!credentials);
    store.commit('setClass', sClass);

    await Storage.set({key: 'APP_CREDENTIALS', value: credentials});
    await Storage.set({key: 'APP_USER_CLASS', value: sClass});
}

export async function saveNotificationsState(enabled: boolean) {
    store.commit('setNotificationsEnabled', enabled);
    await Storage.set({key: 'APP_NOTIFICATIONS', value: String(enabled)});
}

export async function saveMVVState(state: {id: string; name: string}) {
    store.commit('setMVVState', state);
    await Storage.set({key: 'APP_MVV_STATE', value: JSON.stringify(state)});
}

export async function saveLaunched() {
    store.commit('setFirstLaunch', false);
    await Storage.set({key: 'APP_LAUNCHED', value: 'true'});
}

export async function saveDarkMode(enabled: boolean) {
    store.commit('setDarkMode', enabled);
    await Storage.set({key: 'APP_DARK_MODE', value: String(enabled)});
}

export async function reset() {
    store.commit('reset');
    await Storage.clear();
}
