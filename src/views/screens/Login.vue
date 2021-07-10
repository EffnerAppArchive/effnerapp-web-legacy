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
import {sha512} from "@/tools/hash";
import {saveCredentials} from "@/tools/storage";

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
  created() {
    axios.get('https://api.effner.app/data/classes').then(value => {
      value.data.forEach(c => {
        this.classes.push(c)
      })
    })
  },
  data() {
    return {
      classes: []
    }
  },
  methods: {
    async login() {
      const credentials = this.$refs.input_id.$el.value + ':' + this.$refs.input_password.$el.value
      const sClass = this.$refs.input_class.$el.value

      const time = Date.now()

      axios.post('https://api.effner.app/auth/login', {}, {
        headers: {
          'Authorization': 'Basic ' + sha512(credentials + ':' + time),
          'X-Time': time
        }
      }).then((value) => {
        if (value.data.status.login) {
          saveCredentials(credentials, sClass).then(() => {
            this.$router.push({name: 'Home'})
          })
        } else {
          console.log('login failed')
        }
      }).catch(reason => console.log(reason))
    },
  },
  computed: {
    getClasses() {
      return this.classes
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
