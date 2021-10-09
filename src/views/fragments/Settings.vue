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
          <ion-note>Version: ##VERSIONNAME##</ion-note>
          <ion-ripple-effect/>
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="openInBrowser('https://go.effner.app/privacy', 'pdf')">
          <ion-label>Datenschutzerklärung</ion-label>
          <ion-ripple-effect/>
        </ion-item>
        <ion-item class="ion-activatable ripple-parent" @click="openInBrowser('https://go.effner.app/imprint', 'pdf')">
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
        <ion-item class="ion-activatable ripple-parent" @click="showClassSelectionAlert">
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
            <ion-label>Mode für Nerds</ion-label>
          </ion-list-header>
          <ion-item class="ion-activatable ripple-parent" @click="showFCMToken">
            <ion-label>FCMToken</ion-label>
            <ion-ripple-effect/>
          </ion-item>
          <ion-item class="ion-activatable ripple-parent">
            <ion-label>Experimental themes</ion-label>
            <ion-select slot="end" v-model="theme" :value="theme" @ionChange="setExperimentalTheme(theme)">
              <ion-select-option v-for="(e, i) in experimentalThemes" :key="i" :value="i">{{ e }}</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item class="ion-activatable ripple-parent" @click="leaveDeveloper">
            <ion-label>Leave</ion-label>
            <ion-ripple-effect/>
          </ion-item>
        </div>
      </ion-list>
      <div class="text-center mt-4 mb-4">
        <ion-note>
          © {{ new Date().getFullYear() }} EffnerApp by<br>Luis Bros, Sebastian Müller & Jonathan Berger
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
import {reset, saveClass, saveDeveloper, saveNotificationsState} from '@/tools/storage';
import {FCM} from '@capacitor-community/fcm';
import {
  EXPERIMENTAL_THEME_VALUES,
  setExperimentalTheme,
  setTimetableColorTheme,
  TIMETABLE_COLOR_THEME_VALUES,
  toggleDarkTheme
} from '@/tools/theme';
import {isNative, openInBrowser, openSimpleAlert, openToast} from '@/tools/helper';
import axios from 'axios';
import {loadData} from '@/tools/data';

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
    const theme = store.getters.getTheme;
    const developerClick = 0;

    const timetableColorTheme = ref(store.getters.getTimetableColorTheme);

    return {
      timetableColorTheme,
      router,
      store,
      notificationEnabled,
      darkModeEnabled,
      theme,
      developerClick,
      openInBrowser,
      themes: TIMETABLE_COLOR_THEME_VALUES,
      experimentalThemes: EXPERIMENTAL_THEME_VALUES,
      setTimetableColorTheme,
      setExperimentalTheme
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
      await this.router.replace({name: 'Login'});
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
        await openToast('Du bist bereits ein Nerd');
        return;
      }
      this.developerClick++;

      if (this.developerClick == 20) {
        await openToast('Du bist jetzt ein Nerd');
        this.developerClick = 0;
        await saveDeveloper(true);
        await FCM.subscribeTo({topic: 'APP_DEV_NOTIFICATIONS'});
      }
    },
    async leaveDeveloper() {
      await openToast('Du bist kein Nerd mehr');
      await saveDeveloper(false);
      await FCM.unsubscribeFrom({topic: 'APP_DEV_NOTIFICATIONS'});
    },
    async showFCMToken() {
      await openSimpleAlert('FCMToken', (await FCM.getToken()).token);
    },
    async showAbout() {
      await openSimpleAlert('Über die App',
          'EffnerApp by Luis Bros, Sebastian Müller & Jonathan Berger<br><br>© ' + new Date().getFullYear() + ' EffnerApp - Danke an alle Mitwirkenden ❤');
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
    async showClassSelectionAlert() {
      const sClass = this.store.getters.getClass;

      let classes = [];
      try {
        classes = await axios.get('https://api.effner.app/v2.1/data/classes').then((response: any) => response.data);
      } catch (e: any) {
        console.error(e);
        await openToast(e.toString());
        return;
      }

      const alert = await alertController
          .create({
            header: 'Klasse ändern ...',
            inputs: classes.map((value: string) => ({
              type: 'radio',
              label: value,
              value,
              checked: value === sClass
            })),
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel'
              },
              {
                text: 'Klasse ändern',
                handler: async (data) => {

                  if (this.notificationEnabled) {
                    // unsubscribe from FCM channel
                    await FCM.unsubscribeFrom({topic: `APP_SUBSTITUTION_NOTIFICATIONS_${sClass}`});
                  }

                  saveClass(data).then(async () => {
                    console.log('Updated class to: ' + data);
                    await loadData();

                    if (this.notificationEnabled) {
                      // unsubscribe from FCM channel
                      await FCM.unsubscribeFrom({topic: `APP_SUBSTITUTION_NOTIFICATIONS_${data}`});
                    }
                  });
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
