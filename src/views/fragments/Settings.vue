<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-button @click="logout">Logout</ion-button>


  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonButton, IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';
import {Storage} from "@capacitor/storage";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

export default defineComponent({
  name: "Settings",
  components: {IonPage, IonHeader, IonToolbar, IonTitle, IonButton},
  setup() {
    const router = useRouter()
    const store = useStore()

    return {
      router,
      store
    }
  },
  methods: {
    async logout() {
      await Storage.clear()
      this.store.commit('reset')
      await this.router.push({name: 'Login'})
    }
  }
});
</script>

<style scoped>

</style>
