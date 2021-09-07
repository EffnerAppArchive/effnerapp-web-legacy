<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-title>Stundenplan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <table class="table-auto mt-8" style="width: 100%">
        <thead>
        <tr>
          <th/>
          <th>Mo</th>
          <th>Di</th>
          <th>Mi</th>
          <th>Do</th>
          <th>Fr</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="hour in 10" :key="hour">
          <td class="text-center">
            {{ hour }}
          </td>
          <td v-for="day in 5" :key="day" class="break-all text-center py-2"
              :style="'background: ' + meta.find(e => e.subject === lessons[day - 1][hour - 1])?.color || 'black'">
            {{ lessons[day - 1][hour - 1] }}
          </td>
        </tr>
        </tbody>
      </table>
      <div class="mt-8">
        <ion-item class="item_transparent" lines="none">
          <ion-icon :icon="informationOutline" color="black"
                    style="margin-right: 0.75rem; font-size: 1.5rem;"></ion-icon>
          <ion-label style="font-weight: normal; font-size: 1rem">Zuletzt aktualisiert:
            {{ moment(updatedAt, 'YYYY-MM-DD\'T\'HH:mm:ss').format('DD.MM.YYYY HH:mm:ss') }}
          </ion-label>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonContent,
  IonItem,
  IonIcon,
  IonLabel
} from '@ionic/vue';
import {informationOutline} from 'ionicons/icons';

import {defineComponent} from 'vue';
import {useStore} from 'vuex';
import moment from 'moment';

export default defineComponent({
  name: 'Timetable',
  components: {
    IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonItem, IonIcon, IonLabel
  },
  setup() {
    const store = useStore();

    const timetable = store.getters.getData.timetable;
    const {lessons, meta, updatedAt} = timetable;

    return {
      lessons, meta, updatedAt,
      informationOutline,
      moment
    };
  }
});
</script>

<style scoped>
.item_transparent {
  --ion-item-background: transparent;
}
</style>
