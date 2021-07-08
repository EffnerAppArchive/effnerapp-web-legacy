<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col>
            <p style="font-size: x-large; text-align: center">{{motd}}</p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            ion-col
          </ion-col>
          <ion-col>
            ion-col
          </ion-col>
        </ion-row>

      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol } from '@ionic/vue';
import {defineComponent} from "vue";
import {useStore} from "vuex";

export default defineComponent({
  name: 'Home',
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonGrid, IonRow, IonCol },
  created() {
    const store = useStore()

    const data = store.getters.getData

    console.log(data)


    this.data = data
  },
  data() {
    return {
      data: {
        motd: ''
      }
    }
  },
  computed: {
    motd(): string {
      return this.data.motd
    }
  }
})
</script>
