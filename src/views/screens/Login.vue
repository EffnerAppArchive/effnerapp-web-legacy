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
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  isPlatform,
  toastController
} from '@ionic/vue';

import {defineComponent, ref} from 'vue';

import axios from 'axios';
import {sha512} from '@/tools/hash';
import {saveCredentials, saveNotificationsState} from '@/tools/storage';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import {FCM} from '@capacitor-community/fcm';

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

    if (store.getters.isRegistered && !store.getters.getError) {
      await router.push({path: '/main'});
    }

    const id = ref('');
    const password = ref('');
    const sClass = ref('');

    let classes = [];
    try {
      classes = await axios.get('https://api.effner.app/data/classes').then(value => value.data);
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
      this.openToast(this.store.getters.getError);
      this.store.commit('setError', null);
    }
  },
  methods: {
    async login() {
      if (!this.validateInput()) {
        await this.openToast('Bitte fülle alle Felder aus.');
        return;
      }

      const credentials = this.id + ':' + this.password;
      const sClass = this.sClass;

      const time = Date.now();

      axios.post('https://api.effner.app/auth/login', {}, {
        headers: {
          'Authorization': 'Basic ' + sha512(credentials + ':' + time),
          'X-Time': time
        }
      }).then((value) => {
        if (value.data.status.login) {
          (async () => {
            await saveCredentials(credentials, sClass);

            if (this.isNative()) {
              // subscribe to FCM channels
              await FCM.subscribeTo({topic: 'APP_GENERAL_NOTIFICATIONS'});
              await FCM.subscribeTo({topic: `APP_SUBSTITUTION_NOTIFICATIONS_${sClass}`});
              await saveNotificationsState(true);
            }

            await this.router.push({name: 'Home'});
          })();
        } else {
          this.openToast(value.status + ' ' + value.statusText);
        }
      }).catch(reason => this.openToast(reason));
    },
    async openToast(message: string) {
      const toast = await toastController
          .create({
            message: message,
            duration: 2000
          });
      return toast.present();
    },
    validateInput() {
      return this.id && this.password && this.sClass;
    },
    isNative() {
      return (isPlatform('ios') || isPlatform('android')) && !isPlatform('mobileweb');
    }
  },
  computed: {
    getClasses(): string[] {
      return this.classes;
    }
  }
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding-left: 2rem;
  padding-right: 2rem;
}
</style>
