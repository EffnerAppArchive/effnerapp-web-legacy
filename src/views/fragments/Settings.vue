<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Einstellungen</ion-title>
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
        <ion-item class="ion-activatable ripple-parent">
          <ion-label>Stundenplan-Farbe</ion-label>
          <ion-select slot="end" v-model="timetableColorTheme"
                      :value="timetableColorTheme" @ionChange="setTimetableColorTheme(timetableColorTheme)">
            <ion-select-option v-for="(e, i) in themes" :key="i" :value="i">{{ e }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-list-header>
          <ion-label>Über EffnerApp</ion-label>
        </ion-list-header>
        <ion-item class="ion-activatable ripple-parent" @click="showFeedback">
          <ion-label>Feedback</ion-label>
          <ion-note></ion-note>
          <ion-ripple-effect/>
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="joinDeveloper">
          <ion-label>App-Version</ion-label>
          <ion-note>Version: 2</ion-note>
          <ion-ripple-effect/>
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="openInBrowser('https://go.effner.app/privacy')">
          <ion-label>Datenschutzerklärung</ion-label>
          <ion-ripple-effect/>
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="openInBrowser('https://go.effner.app/imprint')">
          <ion-label>Impressum</ion-label>
          <ion-ripple-effect/>
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="showAbout">
          <ion-label>Über die App</ion-label>
          <ion-ripple-effect/>
        </ion-item>

        <ion-list-header>
          <ion-label>Account</ion-label>
        </ion-list-header>
        <ion-item class="ion-activatable ripple-parent">
          <ion-label>Deine Klasse</ion-label>
          <ion-note>{{ $store.getters.getClass }}</ion-note>
          <ion-ripple-effect/>
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="confirmLogout">
          <ion-label>Abmelden</ion-label>
          <ion-ripple-effect/>
        </ion-item>

        <div v-if="store.getters.getDeveloper">
          <ion-list-header>
            <ion-label>Developer</ion-label>
          </ion-list-header>
          <ion-item class="ion-activatable ripple-parent" @click="showFCMToken">
            <ion-label>FCMToken</ion-label>
            <ion-ripple-effect/>
          </ion-item>
          <ion-item class="ion-activatable ripple-parent" @click="leaveDeveloper">
            <ion-label>Leave</ion-label>
            <ion-ripple-effect/>
          </ion-item>
        </div>
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
import {defineComponent, ref} from 'vue';
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
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
  isPlatform
} from '@ionic/vue';

import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {reset, saveDeveloper, saveNotificationsState} from '@/tools/storage';
import {FCM} from '@capacitor-community/fcm';
import {setTimetableColorTheme, TIMETABLE_COLOR_THEME_VALUES, toggleDarkTheme} from '@/tools/theme';
import {isNative, openInBrowser, openSimpleAlert, openToast} from '@/tools/helper';

export default defineComponent({
  name: 'Settings',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonItem,
    IonList,
    IonContent,
    IonLabel,
    IonListHeader,
    IonRippleEffect,
    IonNote,
    IonToggle,
    IonSelect,
    IonSelectOption
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const notificationEnabled = store.getters.getNotificationsEnabled;
    const darkModeEnabled = store.getters.getDarkMode;
    const developerClick = 0;

    const timetableColorTheme = ref(store.getters.getTimetableColorTheme);

    return {
      timetableColorTheme,
      router,
      store,
      notificationEnabled,
      darkModeEnabled,
      developerClick,
      openInBrowser,
      themes: TIMETABLE_COLOR_THEME_VALUES,
      setTimetableColorTheme
    };
  },
  methods: {
    async logout() {
      const sClass = this.store.getters.getClass;

      if (isNative()) {
        // unsubscribe from FCM channels
        await FCM.unsubscribeFrom({topic: 'APP_GENERAL_NOTIFICATIONS'});
        await FCM.unsubscribeFrom({topic: `APP_SUBSTITUTION_NOTIFICATIONS_${sClass}`});
        await FCM.unsubscribeFrom({topic: 'APP_DEV_NOTIFICATIONS'});
      }

      // reset storage
      await reset();

      // redirect to login page
      await this.router.push({name: 'Login'});
    },
    async toggleNotifications() {
      this.notificationEnabled = !this.notificationEnabled;
      const sClass = this.store.getters.getClass;

      if (this.notificationEnabled) {
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
    async joinDeveloper() {
      if (this.store.getters.getDeveloper) {
        await openToast('Du bist bereits Developer');
        return;
      }
      this.developerClick++;

      if (this.developerClick == 20) {
        await openToast('Du bist jetzt Developer');
        this.developerClick = 0;
        await saveDeveloper(true);
        await FCM.subscribeTo({topic: 'APP_DEV_NOTIFICATIONS'});
      }
    },
    async leaveDeveloper() {
      await openToast('Du bist kein Developer mehr');
      await saveDeveloper(false);
      await FCM.unsubscribeFrom({topic: 'APP_DEV_NOTIFICATIONS'});
    },
    async showFCMToken() {
      await openSimpleAlert('FCMToken', (await FCM.getToken()).token);
    },
    async showAbout() {
      await openSimpleAlert('Über die App',
          'EffnerApp - by Luis & Sebi!<br><br>© ' + new Date().getFullYear() + ' EffnerApp - Danke an alle Mitwirkenden ❤');
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
                  openInBrowser(this.getStoreUrl());
                }
              },
              {
                text: 'E-Mail senden',
                handler: () => {
                  openInBrowser('mailto:info@effner.app');
                }
              }
            ]
          });
      return alert.present();
    },
    getStoreUrl() {
      if (isPlatform('ios')) {
        return 'https://go.effner.app/ios';
      } else if (isPlatform('android')) {
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
.md ion-list ion-item ion-note {
  align-self: center;
  padding: 0;
}

.md ion-note {
  font-size: 1rem;
}

.md ion-list-header {
  font-size: 24px;
  font-weight: bold;
  padding-top: 1rem;
  padding-bottom: 0.25rem;
}
</style>
