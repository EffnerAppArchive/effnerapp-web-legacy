<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vertretungen</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div>
        <ion-select :value="timetable?.timetable?.dates[0]">
          <ion-select-option v-for="date in timetable?.timetable?.dates" :key="date" :value="date">{{
              date
            }}
          </ion-select-option>
        </ion-select>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {IonContent, IonHeader, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar,} from '@ionic/vue';
import {defineComponent} from "vue";
import {useStore} from "vuex";
import DSBMobile from "@/tools/dsbmobile";

export default defineComponent({
  name: 'Substitutions',
  components: {IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSelect, IonSelectOption,},
  data() {
    return {}
  },
  async setup() {
    const store = useStore()
    const creds = store.getters.getCredentials.split(':')
    const dsbmobile = new DSBMobile(creds[0], creds[1])

    const timetable = await dsbmobile.getTimetable();

    console.log(timetable)

    return {
      timetable,
    }
  },
  computed: {

  }
})
</script>
