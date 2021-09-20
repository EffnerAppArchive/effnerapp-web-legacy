import {Storage} from '@capacitor/storage';
import store from '../store';
import {isPlatform} from '@ionic/vue';
import {FCM} from '@capacitor-community/fcm';

export async function loadStorage(): Promise<void> {
    const credentials = await Storage.get({key: 'APP_CREDENTIALS'});
    const sClass = await Storage.get({key: 'APP_USER_CLASS'});
    const mvvState = await Storage.get({key: 'APP_MVV_STATE'});
    const notificationsEnabled = await Storage.get({key: 'APP_NOTIFICATIONS'});
    const launched = await Storage.get({key: 'APP_LAUNCHED'});
    const darkMode = await Storage.get({key: 'APP_DARK_MODE'});
    const timetableColorTheme = await Storage.get({key: 'APP_TIMETABLE_COLOR_THEME'});
    const preferredTimetable = await Storage.get({key: 'APP_PREFERRED_TIMETABLE'});
    const developer = await Storage.get({key: 'APP_DEVELOPER'});

    if (credentials && credentials.value) {
        store.commit('setCredentials', credentials.value);
        store.commit('setRegistered', !!credentials.value);
    } else {
        if (isPlatform('android')) {
            await searchLegacyStorageGroup();
        }
    }

    if (sClass && sClass.value) {
        store.commit('setClass', sClass.value);
    }

    if (mvvState && mvvState.value) {
        store.commit('setMVVState', JSON.parse(mvvState.value));
    }

    if (notificationsEnabled.value === 'true') {
        store.commit('setNotificationsEnabled', true);
    }

    if (launched && launched.value === 'true') {
        store.commit('setFirstLaunch', false);
    }

    if (darkMode && darkMode.value === 'true') {
        store.commit('setDarkMode', true);
    }

    if (timetableColorTheme && timetableColorTheme.value) {
        store.commit('setTimetableColorTheme', parseInt(timetableColorTheme.value));
    }

    if (preferredTimetable && preferredTimetable.value) {
        store.commit('setPreferredTimetable', parseInt(preferredTimetable.value));
    }

    if (developer && developer.value === 'true') {
        store.commit('setDeveloper', true);
    }
}

export async function saveCredentials(credentials: string, sClass: string): Promise<void> {
    store.commit('setCredentials', credentials);
    store.commit('setRegistered', !!credentials);
    store.commit('setClass', sClass);

    await Storage.set({key: 'APP_CREDENTIALS', value: credentials});
    await Storage.set({key: 'APP_USER_CLASS', value: sClass});
}

export async function saveNotificationsState(enabled: boolean): Promise<void> {
    store.commit('setNotificationsEnabled', enabled);
    await Storage.set({key: 'APP_NOTIFICATIONS', value: String(enabled)});
}

export async function saveMVVState(state: { id: string; name: string }): Promise<void> {
    store.commit('setMVVState', state);
    await Storage.set({key: 'APP_MVV_STATE', value: JSON.stringify(state)});
}

export async function saveLaunched(): Promise<void> {
    store.commit('setFirstLaunch', false);
    await Storage.set({key: 'APP_LAUNCHED', value: 'true'});
}

export async function saveDarkMode(enabled: boolean): Promise<void> {
    store.commit('setDarkMode', enabled);
    await Storage.set({key: 'APP_DARK_MODE', value: String(enabled)});
}

export async function saveTimetableColorTheme(id: number): Promise<void> {
    store.commit('setTimetableColorTheme', id);
    await Storage.set({key: 'APP_TIMETABLE_COLOR_THEME', value: String(id)});
}

export async function savePreferredTimetable(i: number): Promise<void> {
    store.commit('setPreferredTimetable', i);
    await Storage.set({key: 'APP_PREFERRED_TIMETABLE', value: String(i)});
}

export async function saveDeveloper(enabled: boolean): Promise<void> {
    store.commit('setDeveloper', enabled);
    await Storage.set({key: 'APP_DEVELOPER', value: String(enabled)});
}

export async function reset(): Promise<void> {
    store.commit('reset');
    await Storage.clear();
}

async function searchLegacyStorageGroup(): Promise<void> {
    // configure storage to use the legacy group name
    await Storage.configure({
        group: 'de.effnerapp.effner_preferences'
    });

    // check legacy storage keys
    const id = await Storage.get({key: 'APP_DSB_LOGIN_ID'});
    const password = await Storage.get({key: 'APP_DSB_LOGIN_PASSWORD'});
    const sClass = await Storage.get({key: 'APP_USER_CLASS'});

    if (id && id.value && password && password.value && sClass && sClass.value) {
        // store values in new storage keys
        await store.commit('setCredentials', id.value + ':' + password.value);
        await store.commit('setRegistered', true);
        await store.commit('setClass', sClass.value);

        // remove legacy storage keys
        await Storage.remove({key: 'APP_DSB_LOGIN_ID'});
        await Storage.remove({key: 'APP_DSB_LOGIN_PASSWORD'});
        await Storage.remove({key: 'APP_USER_CLASS'});
        await Storage.remove({key: 'APP_DESIGN_DARK'});
        await Storage.remove({key: 'APP_NOTIFICATIONS'});

        // switch back to the default group
        await Storage.configure({});

        // store values in new group
        await Storage.set({key: 'APP_CREDENTIALS', value: id.value + ':' + password.value});
        await Storage.set({key: 'APP_USER_CLASS', value: sClass.value});

        // subscribe automatically to notifications
        await FCM.subscribeTo({topic: 'APP_GENERAL_NOTIFICATIONS'});
        await FCM.subscribeTo({topic: `APP_SUBSTITUTION_NOTIFICATIONS_${sClass.value}`});
        await saveNotificationsState(true);
    } else {
        // switch back to the default group
        await Storage.configure({});
    }
}
