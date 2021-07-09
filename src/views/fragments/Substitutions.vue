<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vertretungen</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <iframe style="height: 100%; width: 100%" src="https://dsbmobile.de/data/760a9f28-60a4-4385-abc2-21db3fd38016/b5240cf0-cb9e-4af5-b170-5497450e9a99/esis.html"></iframe>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Substitutions',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  created() {
    // const store = useStore()

  }
})
</script>
