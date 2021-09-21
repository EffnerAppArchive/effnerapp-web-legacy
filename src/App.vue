<template>
  <ion-app>
    <Suspense>
      <template #default>
        <ion-router-outlet/>
      </template>
      <template #fallback>
        <LoadingAnimation />
      </template>
    </Suspense>
  </ion-app>
</template>

<script lang="ts">
import {IonApp, IonRouterOutlet, isPlatform} from '@ionic/vue';
import {defineComponent} from 'vue';
import {ActionPerformed, PushNotifications, PushNotificationSchema, Token} from '@capacitor/push-notifications';
import { FirebaseCrashlytics } from '@capacitor-community/firebase-crashlytics';
import {initTheme} from '@/tools/theme';
import LoadingAnimation from '@/components/LoadingAnimation.vue';
import {isNative, openSimpleAlert, openToast} from '@/tools/helper';

export default defineComponent({
  name: 'App',
  components: {
    LoadingAnimation,
    IonApp,
    IonRouterOutlet
  },
  setup() {
    console.log('Initializing app ...');

    initTheme();

    if (isNative()) {
      // Request permission to use push notifications
      // iOS will prompt user and return if they granted permission or not
      // Android will just grant without prompting
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          openToast('Notifications disabled');
        }
      });


      // enable firebase crashlytics
      FirebaseCrashlytics.setEnabled({
        enabled: true
      });

      // On success, we should be able to receive notifications
      PushNotifications.addListener('registration',
          (token: Token) => {
            console.log('Push registration success, token: ' + token.value);
          }
      );

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
          (error: any) => {
            console.error('Error on registration: ' + JSON.stringify(error));
          }
      );

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
          (notification: PushNotificationSchema) => {
            console.log('Push received: ' + JSON.stringify(notification));

            if (!isPlatform('ios')) {
              openSimpleAlert(notification.title, notification.body);
            }
          }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
          (notification: ActionPerformed) => {
            console.log('Push action performed: ' + JSON.stringify(notification));
          }
      );
    }
  }
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

.md ion-alert > .alert-wrapper {
  border-radius: 15px;
}

.md ion-card {
  margin: 24px 16px;
  border-radius: 8px;
}
</style>
