<template>
  <ion-page>
    <ion-header translucent="true">
      <ion-toolbar>
        <ion-title>Login - EffnerApp</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen>
      <div id="container">
        <ion-item style="margin-bottom: 1rem">
          <ion-label position="floating">ID</ion-label>
          <ion-input v-model="id"></ion-input>
        </ion-item>

        <ion-item style="margin-bottom: 1rem">
          <ion-label position="floating">Passwort</ion-label>
          <ion-input v-model="password" type="password"></ion-input>
        </ion-item>

        <ion-item style="margin-bottom: 1rem">
          <ion-label position="floating">Klasse</ion-label>
          <ion-select v-model="sClass">
            <ion-select-option v-for="c in classes" :key="c" :value="c">{{ c }}</ion-select-option>
          </ion-select>
        </ion-item>

        <div style="position: relative">
          <ion-button @click="login" style="position: absolute; right: 0; padding-right: 0.5rem">Login</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonLabel,
  IonInput,
  IonItem,
  IonButton,
  IonSelect,
  IonSelectOption,
  toastController
} from '@ionic/vue';

import {defineComponent, ref} from 'vue';

import axios from 'axios';
import {sha512} from "@/tools/hash";
import {saveCredentials} from "@/tools/storage";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

export default defineComponent({
  name: "Login",
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonLabel,
    IonInput,
    IonItem,
    IonButton,
    IonSelect,
    IonSelectOption
  },
  async setup() {
    const router = useRouter()
    const store = useStore()

    if(store.getters.isRegistered && !store.getters.getError) {
      await router.push({path: '/main'})
    }

    const id = ref('');
    const password = ref('');
    const sClass = ref('');

    let classes = []
    try {
      classes = await axios.get('https://api.effner.app/data/classes').then(value => value.data)
    } catch (e) {
      console.log(e)
    }

    return {
      router,
      store,
      id,
      password,
      sClass,
      classes: classes as string[]
    }
  },
  created() {
    if(this.store.getters.getError) {
      this.openToast(this.store.getters.getError)
      this.store.commit('setError', null)
    }
  },
  methods: {
    async login() {
      if (!this.validateInput()) {
        await this.openToast('Please fill in the fields.');
        return;
      }

      const credentials = this.id + ':' + this.password
      const sClass = this.sClass

      const time = Date.now()

      axios.post('https://api.effner.app/auth/login', {}, {
        headers: {
          'Authorization': 'Basic ' + sha512(credentials + ':' + time),
          'X-Time': time
        }
      }).then((value) => {
        if (value.data.status.login) {
          saveCredentials(credentials, sClass).then(() => {
            this.router.push({name: 'Home'})
          })
        } else {
          this.openToast(value.status + ' ' + value.statusText)
        }
      }).catch(reason => this.openToast(reason))
    },
    async openToast(message: string) {
      const toast = await toastController
          .create({
            message: message,
            duration: 2000
          })
      return toast.present();
    },
    validateInput() {
      return this.id && this.password && this.sClass;
    }
  },
  computed: {
    getClasses(): string[] {
      return this.classes
    }
  }
})
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
