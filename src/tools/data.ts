import axios from 'axios';
import {sha512} from '@/tools/hash';
import DSBMobile from '@/tools/dsbmobile';
import store from '@/store';
import {FirebaseCrashlytics} from '@capacitor-community/firebase-crashlytics';
import {Http} from '@capacitor-community/http';

let lastFetchTime = 0;

export const refreshContent = async (e: any): Promise<void> => {
    console.log('Refreshing data ...');
    await loadData();
    e.target.complete();
};


export const refreshContentIfNeeded = async (): Promise<void> => {
    const now = new Date().getTime();
    if (now - lastFetchTime >= 10 * 60 * 1000) {
        await loadData();
    }
};

export const loadData = async (): Promise<void> => {
    console.log('Loading data ...');
    lastFetchTime = new Date().getTime();
    const credentials = store.getters.getCredentials;
    const sClass = store.getters.getClass;
    const time = Date.now();

    try {
        const response = await axios.get('https://api.effner.app/v2/data?class=' + sClass, {
            headers: {
                'Authorization': 'Basic ' + sha512(credentials + ':' + time),
                'X-Time': time
            }
        });

        store.commit('setData', response.data.data);
    } catch (e: any) {
        store.commit('setError', e.response?.data?.status?.error || e);

        await FirebaseCrashlytics.recordException({message: e.message, stacktrace: e.stack});
        console.error(e);

        return Promise.reject(e);
    }

    const creds = credentials.split(':');
    const dsbmobile = new DSBMobile(creds[0], creds[1]);

    let timetable;

    try {
        await dsbmobile.login();
        timetable = await dsbmobile.getTimetable();

        store.commit('setSubstitutions', timetable);
    } catch (e: any) {
        await FirebaseCrashlytics.recordException({message: e.message, stacktrace: e.stack});
        console.error(e);
    }

    try {
        // get news from effner.de website
        const news = await Http.request({
            method: 'GET',
            url: 'https://effner.de/wp-json/wp/v2/posts',
            responseType: 'json'
        });

        store.commit('setNews', news.data);
    } catch (e: any) {
        await FirebaseCrashlytics.recordException({message: e.message, stacktrace: e.stack});
        console.error(e);
    }
};
