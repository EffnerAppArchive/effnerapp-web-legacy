import {Browser} from '@capacitor/browser';
import {alertController, isPlatform, toastController} from '@ionic/vue';

const isNative = (): boolean => {
    return (isPlatform('ios') || isPlatform('android')) && !isPlatform('mobileweb');
};

const openInBrowser = async (uri: string): Promise<void> => {
    if(isPlatform('android') && (uri.endsWith('.pdf') || uri.startsWith('mailto:'))) {
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

export {isNative, openInBrowser, openToast, openSimpleAlert};
