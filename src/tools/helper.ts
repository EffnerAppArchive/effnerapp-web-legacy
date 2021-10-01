import {Browser} from '@capacitor/browser';
import {alertController, isPlatform, toastController} from '@ionic/vue';
import store from '../store';
import moment from 'moment';

const isNative = (): boolean => {
    return (isPlatform('ios') || isPlatform('android')) && !isPlatform('mobileweb');
};

const openInBrowser = async (uri: string, type?: string): Promise<void> => {
    if (isPlatform('android') && (type === 'pdf' || uri.endsWith('.pdf') || uri.startsWith('mailto:'))) {
        window.open(uri);
        return;
    }

    await Browser.open({url: uri});
};

const openToast = async (message: string): Promise<void> => {
    const toast = await toastController
        .create({
            message: message,
            duration: 2000
        });
    return toast.present();
};

const openSimpleAlert = async (title?: string, body?: string): Promise<void> => {
    alertController
        .create({
            header: title,
            message: body,
            buttons: ['OK']
        }).then(alert => alert.present());
};

const validateClass = (fullClass: string, test: string): boolean => {
    if (fullClass === test)
        return true;

    // if the test string is not equal to the full class name we test it using regex for these cases:
    // fullClass="12Q3"; test="12Q" -> match
    // fullClass="10E"; test="12EF" -> match


    const checkA = fullClass.match(/\d{1,2}[A-Z]/);
    const checkB = test.match(/\d{1,2}[A-Z]/);

    let result = false;

    if (checkA) {
        result = checkA[0] === test;
    } else if (checkB) {
        result = checkB[0] === fullClass;
    }

    return result;
};


const getCurrentSubstitutionDay = (dates: string[]): string => {
    const now = new Date();
    const hour = now.getHours();

    let newDate;

    if (hour >= 14 || dates[0] !== moment(now).format('DD.MM.YYYY')) {
        if (dates.length >= 2) {
            newDate = dates[1];
        } else {
            newDate = dates[0];
        }
    } else {
        newDate = dates[0];
    }

    return newDate;
};

const getLevel = (): number => {
    return store.getters.getClass.match('^\\d{1,2}');
};

export {isNative, openInBrowser, openToast, openSimpleAlert, validateClass, getCurrentSubstitutionDay, getLevel};
