import {isPlatform} from '@ionic/vue';

export const isNative = (): boolean => {
    return (isPlatform('ios') || isPlatform('android')) && !isPlatform('mobileweb');
};
