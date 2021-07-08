``<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vertretungen</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import {defineComponent} from "vue";
import DSBMobile from "@/tools/dsbmobile/index";
import {useStore} from "vuex";

export default defineComponent({
  name: 'Substitutions',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  created() {
    const store = useStore()
    const creds = store.getters.getCredentials.split(':')
    const dsbmobile = new DSBMobile(creds[0], creds[1])

    dsbmobile.fetch()
  }
})
</script>
