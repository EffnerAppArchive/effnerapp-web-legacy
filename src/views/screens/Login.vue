<template>
  <ion-page>
    <ion-content v-if="!loggingIn" fullscreen>
      <div class="container mx-auto px-6 py-10">
        <div class="flex flex-col">
          <div>
            <div class="flex justify-center h-24 smolest:h-28 smol:h-36 norm:h-32 thiccc:h-44">
              <img alt="logo" src="@/assets/effnerapp_logo.svg">
            </div>
          </div>

          <div class="pt-2 text-center text-weight-100 text-4xl">
            EffnerApp
          </div>

          <div class="pt-8 smolest:pt-16 smol:pt-20 norm:pt-24 thiccc:pt-32">
            <ion-item style="margin-bottom: 1rem">
              <ion-label position="stacked">ID</ion-label>
              <ion-input v-model="id" type="number"></ion-input>
            </ion-item>
          </div>

          <div>
            <ion-item style="margin-bottom: 1rem">
              <ion-label position="stacked">Passwort</ion-label>
              <ion-input v-model="password" type="password"></ion-input>
            </ion-item>
          </div>

          <div>
            <ion-item style="margin-bottom: 1rem">
              <ion-label position="stacked">Klasse</ion-label>
              <ion-select v-model="sClass">
                <ion-select-option v-for="c in classes" :key="c" :value="c">{{ c }}</ion-select-option>
              </ion-select>
            </ion-item>
          </div>

          <div style="position: relative">
            <ion-button :disabled="loggingIn" style="position: absolute; right: 0; padding-right: 0.5rem"
                        @click="login">Login
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>

    <LoadingAnimation v-else/>

    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <div>
          <ion-item class="item_transparent" lines="none">
            <ion-icon :icon="informationOutline" color="black"
                      style="margin-right: 0.75rem; font-size: 1.5rem;"></ion-icon>
            <ion-label style="font-weight: normal; font-size: 1rem">
              <div @click="openInBrowser('https://go.effner.app/privacy', 'pdf')">Datenschutzerklärung</div>
            </ion-label>
          </ion-item>
        </div>
      </ion-toolbar>
    </ion-footer>

  </ion-page>
</template>

<script lang="ts">
import {
  alertController,
  IonButton,
  IonContent,
  IonFooter,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonToolbar
} from '@ionic/vue';
import {informationOutline} from 'ionicons/icons';

import {defineComponent, ref} from 'vue';

import axios from 'axios';
import {sha512} from '@/tools/hash';
import {saveCredentials, saveNotificationsState} from '@/tools/storage';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {FCM} from '@capacitor-community/fcm';
import {isNative, openInBrowser, openToast} from '@/tools/helper';
import LoadingAnimation from '@/components/LoadingAnimation.vue';

export default defineComponent({
  name: 'Login',
  components: {
    LoadingAnimation,
    IonPage,
    IonContent,
    IonLabel,
    IonInput,
    IonItem,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonToolbar,
    IonFooter
  },
  async setup() {
    const router = useRouter();
    const store = useStore();


    let classes = [];
    try {
      classes = await axios.get('https://api.effner.app/v2.1/data/classes').then(value => value.data);
    } catch (e) {
      console.error(e);
    }

    const id = ref('');
    const password = ref('');
    const sClass = ref(classes[0]);

    return {
      router,
      store,
      id,
      password,
      sClass,
      loggingIn: false,
      classes: classes as string[],

      informationOutline,
      openInBrowser
    };
  },
  created() {
    if (this.store.getters.getError) {
      this.showErrorAlert(this.store.getters.getError);
      this.store.commit('setError', null);
    }
  },
  methods: {
    async login() {
      if (!this.validateInput()) {
        await openToast('Bitte fülle alle Felder aus.');
        return;
      }

      this.loggingIn = true;

      const credentials = this.id + ':' + this.password;
      const sClass = this.sClass;

      const time = Date.now();

      axios.post('https://api.effner.app/v1/auth/login', {}, {
        headers: {
          'Authorization': 'Basic ' + sha512(credentials + ':' + time),
          'X-Time': time
        }
      }).then((value) => {
        if (value.data.status.login) {
          (async () => {
            await saveCredentials(credentials, sClass);

            if (isNative()) {
              // subscribe to FCM channels
              await FCM.subscribeTo({topic: 'APP_GENERAL_NOTIFICATIONS'});
              await FCM.subscribeTo({topic: `APP_SUBSTITUTION_NOTIFICATIONS_${sClass}`});
              await saveNotificationsState(true);
            }

            await this.router.replace({path: '/main'});
            this.loggingIn = false;
          })();
        } else {
          openToast(value.status + ' ' + value.statusText);
          this.loggingIn = false;
        }
      }).catch(reason => {
        this.loggingIn = false;
        if (reason.response.status === 401) {
          openToast('Überprüfe deine Anmeldedaten');
          return;
        }

        openToast(reason.response?.data?.status?.error || reason);
      });
    },
    async showErrorAlert(message: string) {
      const alert = await alertController
          .create({
            header: 'Anmeldevorgang fehlgeschlagen',
            message,
            buttons: [
              {
                text: 'OK',
                role: 'cancel'
              },
              {
                text: 'Neu versuchen',
                handler: () => {
                  this.router.replace({path: '/main'});
                }
              }
            ]
          });
      return alert.present();
    },
    validateInput() {
      return this.id && this.password && this.sClass;
    }
  },
  computed: {
    getClasses(): string[] {
      return this.classes;
    }
  },
  watch: {
    $route(to) {
      if (to.name === 'Login') {
        console.log('Reattached to login component...');
        if (this.store.getters.getError) {
          this.showErrorAlert(this.store.getters.getError);
          this.store.commit('setError', null);
        }
      }
    }
  }
});
</script>

<style scoped>
.text-weight-100 {
  font-weight: 100;
}
</style>
