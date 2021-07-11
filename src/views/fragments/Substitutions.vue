<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vertretungen</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div>
      </div>
<!--/*      <iframe style="height: 100%; width: 100%" src="https://dsbmobile.de/data/760a9f28-60a4-4385-abc2-21db3fd38016/b5240cf0-cb9e-4af5-b170-5497450e9a99/esis.html"></iframe>*/-->
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import {defineComponent} from "vue";
import {useStore} from "vuex";
import DSBMobile from "@/tools/dsbmobile";

export default defineComponent({
  name: 'Substitutions',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  data() {
    return {

    }
  },
  async created() {
    const store = useStore()
    const creds = store.getters.getCredentials.split(':')
    const dsbmobile = new DSBMobile(creds[0], creds[1])

    const timetable = await dsbmobile.getTimetable();

    console.log(timetable)

  },
  computed: {

  }
})
</script>
