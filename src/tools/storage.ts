import {Storage} from "@capacitor/storage";
import store from '../store'

export async function loadStorage() {
    const credentials = await Storage.get({key: 'APP_CREDENTIALS'})
    const sClass = await Storage.get({key: 'APP_USER_CLASS'})
    const mvvState = await Storage.get({key: 'APP_MVV_STATE'})

    if(credentials && credentials.value) {
        store.commit('setCredentials', credentials.value)
        store.commit('setRegistered', !!credentials.value)
    }

    if(sClass && sClass.value) {
        store.commit('setClass', sClass.value)
    }

    if(mvvState && mvvState.value) {
        store.commit('setMVVState', JSON.parse(mvvState.value))
    }
}

export async function saveCredentials(credentials: string, sClass: string) {
    store.commit('setCredentials', credentials);
    store.commit('setRegistered', !!credentials)
    store.commit('setClass', sClass);

    await Storage.set({key: 'APP_CREDENTIALS', value: credentials})
    await Storage.set({key: 'APP_USER_CLASS', value: sClass})
}

export async function saveMVVState(state: {id: string; name: string}) {
    store.commit('setMVVState', state)
    await Storage.set({key: 'APP_MVV_STATE', value: JSON.stringify(state)})
}
