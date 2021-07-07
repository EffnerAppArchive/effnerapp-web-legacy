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
          <ion-input ref="input_id"></ion-input>
        </ion-item>

        <ion-item style="margin-bottom: 1rem">
          <ion-label position="floating">Passwort</ion-label>
          <ion-input ref="input_password" type="password"></ion-input>
        </ion-item>

        <ion-item style="margin-bottom: 1rem">
          <ion-label position="floating">Klasse</ion-label>
          <ion-select ref="input_class">
            <ion-select-option value="5A">5A</ion-select-option>
            <ion-select-option value="11Q3">11Q3</ion-select-option>
          </ion-select>
        </ion-item>

        <div style="position: relative">
          <ion-button @click="login" style="position: absolute; right: 0; padding-right: 0.5rem">Login</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
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
  IonSelectOption
} from '@ionic/vue';
import axios from 'axios';

export default {
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
  methods: {
    async login() {
      console.log('login')
      const id = this.$refs.input_id.$el.value
      const password = this.$refs.input_password.$el.value
      const sClass = this.$refs.input_class.$el.value

      const time = Date.now()

      axios.post('https://api.effner.app/auth/login', {}, {
        headers: {
          authorization: 'Basic ' + await this.sha512(id + ':' + password + ':' + time),
          'X-Time': time
        }
      })
      .then(value => console.log(value))
      .catch(reason => console.log(reason))
    },
    sha512(str) {
      return crypto.subtle.digest("SHA-512", new TextEncoder("utf-8").encode(str)).then(buf => {
        return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
      });
    }
  }
}
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
