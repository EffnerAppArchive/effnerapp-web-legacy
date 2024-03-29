import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'de.effnerapp.effner',
    appName: 'EffnerApp',
    webDir: 'dist',
    bundledWebRuntime: false,
    plugins: {
        PushNotifications: {
            presentationOptions: ['badge', 'sound', 'alert']
        }
    }
};

export default config;
