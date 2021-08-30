<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
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

        <ion-tab-button href="/main/settings" tab="tab4">
          <ion-icon :icon="settings"/>
          <ion-label>Einstellungen</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {IonIcon, IonLabel, IonPage, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/vue';
import {grid, home, school, settings} from 'ionicons/icons';
import {sha512} from '@/tools/hash'
import axios from 'axios';
import {useStore} from "vuex";
import {defineComponent} from "vue";
import {useRouter} from "vue-router";
import DSBMobile from "@/tools/dsbmobile";

export default defineComponent({
  name: 'Main',
  components: {IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet},
  async setup() {
    const store = useStore()
    const router = useRouter()

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
      store.commit('setError', e)
      await router.push({name: 'Login'})
    }

    const creds = credentials.split(':')
    const dsbmobile = new DSBMobile(creds[0], creds[1])

    let timetable;

    try {
      timetable = await dsbmobile.getTimetable();

      console.log("timetable: " + JSON.stringify(timetable));
      store.commit('setSubstitutions', timetable);
    } catch (e) {
      console.error(e);
    }

    return {
      home, grid, school, settings
    }
  }
})
</script>
