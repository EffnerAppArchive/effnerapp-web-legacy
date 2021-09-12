<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <ion-list>
        <ion-list-header>
          <ion-label>Benachrichtigungen</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label>Benachrichtigungen</ion-label>
          <ion-toggle slot="end" :checked="notificationEnabled" @ionChange="toggleNotifications"></ion-toggle>
        </ion-item>
        <ion-list-header>
          <ion-label>Verschiedenes</ion-label>
        </ion-list-header>
        <ion-item class="ion-activatable ripple-parent">
          <ion-label>Night-Theme</ion-label>
          <ion-toggle slot="end" :checked="darkModeEnabled" @ionChange="toggleNightTheme"></ion-toggle>
        </ion-item>
        <ion-list-header>
          <ion-label>Über EffnerApp</ion-label>
        </ion-list-header>
        <ion-item class="ion-activatable ripple-parent" @click="showFeedback">
          <ion-label>Feedback</ion-label>
          <ion-note></ion-note>
          <ion-ripple-effect />
        </ion-item>
        <ion-item class="ion-activatable ripple-parent">
          <ion-label>App-Version</ion-label>
          <ion-note>Version: 1.x</ion-note>
          <ion-ripple-effect />
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="openInBrowser('https://go.effner.app/privacy')">
          <ion-label>Datenschutzerklärung</ion-label>
          <ion-ripple-effect />
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="openInBrowser('https://go.effner.app/imprint')">
          <ion-label>Impressum</ion-label>
          <ion-ripple-effect />
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="showAbout">
          <ion-label>Über die App</ion-label>
          <ion-ripple-effect />
        </ion-item>
        <ion-list-header>
          <ion-label>Account</ion-label>
        </ion-list-header>
        <ion-item class="ion-activatable ripple-parent">
          <ion-label>Deine Klasse</ion-label>
          <ion-note>{{ $store.getters.getClass }}</ion-note>
          <ion-ripple-effect />
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="confirmLogout">
          <ion-label>Abmelden</ion-label>
          <ion-ripple-effect />
        </ion-item>
      </ion-list>
      <div class="text-center mt-4 mb-4">
        <ion-note>
          © {{ new Date().getFullYear() }} EffnerApp by Luis & Sebi
        </ion-note>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {
  alertController,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonPage,
  IonRippleEffect,
  IonTitle,
  IonToggle,
  IonToolbar,
  isPlatform
} from '@ionic/vue';

import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {Browser} from '@capacitor/browser';
import {reset, saveDarkMode, saveNotificationsState} from '@/tools/storage';
import {FCM} from '@capacitor-community/fcm';
import {toggleDarkTheme} from "@/tools/theme";

export default defineComponent({
  name: 'Settings',
  components: {IonPage, IonHeader, IonToolbar, IonTitle, IonItem, IonList, IonContent, IonLabel, IonListHeader, IonRippleEffect, IonNote, IonToggle},
  setup() {
    const router = useRouter();
    const store = useStore();

    const notificationEnabled = store.getters.getNotificationsEnabled;
    const darkModeEnabled = store.getters.getDarkMode;

    return {
      router,
      store,
      notificationEnabled,
      darkModeEnabled
    };
  },
  methods: {
    async logout() {
      const sClass = this.store.getters.getClass;

      // unsubscribe from FCM channels
      await FCM.unsubscribeFrom({topic: 'APP_GENERAL_NOTIFICATIONS'});
      await FCM.unsubscribeFrom({topic: `APP_SUBSTITUTION_NOTIFICATIONS_${sClass}`});

      // reset storage
      await reset();

      // redirect to login page
      await this.router.push({name: 'Login'});
    },
    async toggleNotifications() {
      this.notificationEnabled = !this.notificationEnabled;
      const sClass = this.store.getters.getClass;

      if(this.notificationEnabled) {
        // subscribe to FCM channels
        await FCM.subscribeTo({topic: 'APP_GENERAL_NOTIFICATIONS'});
        await FCM.subscribeTo({topic: `APP_SUBSTITUTION_NOTIFICATIONS_${sClass}`});
      } else {
        // unsubscribe from FCM channels
        await FCM.unsubscribeFrom({topic: 'APP_GENERAL_NOTIFICATIONS'});
        await FCM.unsubscribeFrom({topic: `APP_SUBSTITUTION_NOTIFICATIONS_${sClass}`});
      }

      await saveNotificationsState(this.notificationEnabled);
    },
    async openInBrowser(uri: string) {
      await Browser.open({url: uri});
    },
    async confirmLogout() {
      const alert = await alertController
          .create({
            header: 'Abmelden?',
            message: 'Willst du dich wirklich abmelden?',
            buttons: [
              {
                text: 'Nein',
                role: 'cancel'
              },
              {
                text: 'Ja',
                handler: () => {
                  this.logout();
                }
              }
            ]
          });
      return alert.present();
    },
    async showAbout() {
      const alert = await alertController
          .create({
            header: 'Über die App',
            message: 'EffnerApp - by Luis & Sebi!<br><br>© ' + new Date().getFullYear() + ' EffnerApp - Danke an alle Mitwirkenden ❤',
            buttons: ['OK']
          });
      return alert.present();
    },
    async showFeedback() {
      const alert = await alertController
          .create({
            header: 'Feedback',
            message: 'Schreib uns eine E-Mail, wenn du uns Verbesserungsvorschläge mitteilen möchtest oder Probleme mit der App hast!<br>Wenn du willst, kannst du die App im Store bewerten! 😉',
            buttons: [
              {
                text: 'OK',
                role: 'cancel'
              },
              {
                text: 'App bewerten',
                handler: () => {
                  this.openInBrowser(this.getStoreUrl());
                }
              },
              {
                text: 'E-Mail senden',
                handler: () => {
                  this.openInBrowser('mailto:info@effner.app');
                }
              }
            ]
          });
      return alert.present();
    },
    getStoreUrl() {
      if(isPlatform('ios')) {
        return 'https://go.effner.app/ios';
      } else if(isPlatform('android')) {
        return 'https://go.effner.app/android';
      } else {
        return 'https://effner.app';
      }
    },
    async toggleNightTheme() {
      this.darkModeEnabled = !this.darkModeEnabled;
      await toggleDarkTheme(this.darkModeEnabled);
    }
  }
});
</script>

<style scoped>

</style>
