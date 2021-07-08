<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/main/home">
          <ion-icon :icon="home"/>
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/main/substitutions">
          <ion-icon :icon="grid"/>
          <ion-label>Vertretungen</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/main/exams">
          <ion-icon :icon="school"/>
          <ion-label>Schulaufgaben</ion-label>
        </ion-tab-button>

      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet} from '@ionic/vue';
import {home, grid, school} from 'ionicons/icons';
import {sha512} from '@/tools/hash'
import axios from 'axios';
import {useStore} from "vuex";
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Main',
  components: {IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet},
  async setup() {
    const store = useStore()

    const credentials = store.getters.getCredentials
    const sClass = store.getters.getClass
    const time = Date.now()

    try {
      const response = await axios.get('https://api.effner.app/data?class=' + sClass, {
        headers: {
          'Authorization': 'Basic ' + sha512(credentials + ':' + time),
          'X-Time': time
        }
      })

      store.commit('setData', response.data.data)
    } catch (e) {
      console.log(e)
      // TODO: handle
    }

    return {
      home, grid, school
    }
  }
})
</script>
