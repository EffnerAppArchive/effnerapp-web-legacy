<template>
  <ion-app>
    <Suspense>
      <template #default>
        <ion-router-outlet/>
      </template>
      <template #fallback>
        <!-- https://codepen.io/Bilal1909/pen/pobgJae -->
        <div class="center">
          <div class="wave"/>
          <div class="wave"/>
          <div class="wave"/>
          <div class="wave"/>
          <div class="wave"/>
          <div class="wave"/>
          <div class="wave"/>
          <div class="wave"/>
          <div class="wave"/>
        </div>
      </template>
    </Suspense>
  </ion-app>
</template>

<script lang="ts">
import {IonApp, IonRouterOutlet, isPlatform} from '@ionic/vue';
import {defineComponent} from 'vue';
import {ActionPerformed, PushNotifications, PushNotificationSchema, Token} from "@capacitor/push-notifications";

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    console.log('Initializing HomePage');

    if ((isPlatform('ios') || isPlatform('android')) && !isPlatform('mobileweb')) {
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
            alert('Push registration success, token: ' + token.value);
          }
      );

      // Some issue with our setup and push will not work
      PushNotifications.addListener('registrationError',
          (error: any) => {
            alert('Error on registration: ' + JSON.stringify(error));
          }
      );

      // Show us the notification payload if the app is open on our device
      PushNotifications.addListener('pushNotificationReceived',
          (notification: PushNotificationSchema) => {
            alert('Push received: ' + JSON.stringify(notification));
          }
      );

      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
          (notification: ActionPerformed) => {
            alert('Push action performed: ' + JSON.stringify(notification));
          }
      );
    }
  },
});
</script>

<style scoped>
bodY {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.center {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}

.wave {
  width: 5px;
  height: 100px;
  background: linear-gradient(45deg, cyan, #fff);
  margin: 10px;
  animation: wave 1s linear infinite;
  border-radius: 20px;
}

.wave:nth-child(2) {
  animation-delay: 0.1s;
}

.wave:nth-child(3) {
  animation-delay: 0.2s;
}

.wave:nth-child(4) {
  animation-delay: 0.3s;
}

.wave:nth-child(5) {
  animation-delay: 0.4s;
}

.wave:nth-child(6) {
  animation-delay: 0.5s;
}

.wave:nth-child(7) {
  animation-delay: 0.6s;
}

.wave:nth-child(8) {
  animation-delay: 0.7s;
}

.wave:nth-child(9) {
  animation-delay: 0.8s;
}

.wave:nth-child(10) {
  animation-delay: 0.9s;
}

@keyframes wave {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}


</style>
