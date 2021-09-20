<template>
  <ion-page>
    <ion-content fullscreen>
      <div class="container mx-auto px-6 py-10">
        <div class="flex flex-col">
          <div>
            <div class="flex justify-center h-24 smolest:h-32 smol:h-36 norm:h-40 thiccc:h-52">
              <img alt="logo" src="/img/effnerapp_logo.svg">
            </div>
          </div>

          <div class="flex justify-center text-3xl">
            <h1>EffnerApp</h1>
          </div>

          <div class="pt-8 smolest:pt-16 smol:pt-20 norm:pt-24 thiccc:pt-32">
            <ion-item style="margin-bottom: 1rem">
              <ion-label position="floating">ID</ion-label>
              <ion-input v-model="id" type="number"></ion-input>
            </ion-item>
          </div>

          <div>
            <ion-item style="margin-bottom: 1rem">
              <ion-label position="floating">Passwort</ion-label>
              <ion-input v-model="password" type="password"></ion-input>
            </ion-item>
          </div>

          <div>
            <ion-item style="margin-bottom: 1rem">
              <ion-label position="floating">Klasse</ion-label>
              <ion-select v-model="sClass">
                <ion-select-option v-for="c in classes" :key="c" :value="c">{{ c }}</ion-select-option>
              </ion-select>
            </ion-item>
          </div>

          <div style="position: relative">
            <ion-button style="position: absolute; right: 0; padding-right: 0.5rem" @click="login">Login</ion-button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  alertController,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption
} from '@ionic/vue';

import {defineComponent, ref} from 'vue';

import axios from 'axios';
import {sha512} from '@/tools/hash';
import {saveCredentials, saveNotificationsState} from '@/tools/storage';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {FCM} from '@capacitor-community/fcm';
import {isNative, openToast} from '@/tools/helper';

export default defineComponent({
  name: 'Login',
  components: {
    IonPage,
    IonContent,
    IonLabel,
    IonInput,
    IonItem,
    IonButton,
    IonSelect,
    IonSelectOption
  },
  async setup() {
    const router = useRouter();
    const store = useStore();

    const id = ref('');
    const password = ref('');
    const sClass = ref('');

    let classes = [];
    try {
      classes = await axios.get('https://api.effner.app/v2/data/classes').then(value => value.data);
    } catch (e) {
      console.error(e);
    }

    for (const c of ['11Q', '12Q']) {
      for (let i = 1; i <= 6; i++) {
        classes.push(c + i);
      }
    }

    return {
      router,
      store,
      id,
      password,
      sClass,
      classes: classes as string[]
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
          })();
        } else {
          openToast(value.status + ' ' + value.statusText);
        }
      }).catch(reason => {
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

</style>
