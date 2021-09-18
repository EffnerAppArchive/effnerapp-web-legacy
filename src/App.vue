<template>
  <ion-app>
    <Suspense>
      <template #default>
        <ion-router-outlet/>
      </template>
      <template #fallback>
        <div>Loading ...</div>
      </template>
    </Suspense>
  </ion-app>
</template>

<script lang="ts">
import {IonApp, IonRouterOutlet} from '@ionic/vue';
import {defineComponent} from 'vue';
import {ActionPerformed, PushNotifications, PushNotificationSchema, Token} from '@capacitor/push-notifications';
import {initTheme} from '@/tools/theme';
import {isNative} from '@/tools/native';

export default defineComponent({
  name: 'App',
  components: {
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
          // Show some error
        }
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
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.md ion-alert > .alert-wrapper {
  border-radius: 15px;
}

.md ion-card {
  margin: 24px 16px;
  border-radius: 8px;
}
</style>
