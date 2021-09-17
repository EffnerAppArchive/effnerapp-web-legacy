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

    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="refreshContent($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-item v-if="classes.length > 1">
        <ion-label>Kurs</ion-label>
        <ion-select v-model="select">
          <ion-select-option v-for="c in classes" :key="c" :value="c">
            {{ c }}
          </ion-select-option>
        </ion-select>
      </ion-item>
      <table v-if="maxDepth() > 0" class="table-auto mt-8" style="width: 100%">
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
        <tr v-for="hour in this.maxDepth()" :key="hour">
          <td class="text-center">
            {{ hour }}
          </td>
          <td v-for="day in 5" :key="day"
              :style="'background: ' + meta.find(e => e.subject === lessons[day - 1][hour - 1])?.color || 'black'"
              class="break-all text-center py-2">
            {{ lessons[day - 1][hour - 1] }}
          </td>
        </tr>
        </tbody>
      </table>
      <div v-else>
        <ion-grid>
          <ion-row class="text-center">
            <ion-col class="p-8">
              Für deine Klasse existiert noch kein Stundenplan.
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <div class="row">
          <ion-item class="item_transparent" lines="none">
            <ion-icon :icon="informationOutline" color="black"
                      style="margin-right: 0.75rem; font-size: 1.5rem;"></ion-icon>
            <ion-label style="font-weight: normal; font-size: 1rem" text-wrap>Zuletzt aktualisiert:
              {{ moment(updatedAt, 'YYYY-MM-DD\'T\'HH:mm:ss').format('DD.MM.YYYY HH:mm:ss') }}
            </ion-label>
          </ion-item>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {informationOutline} from 'ionicons/icons';

import {defineComponent, ref} from 'vue';
import {useStore} from 'vuex';
import moment from 'moment';

import {refreshContent} from '@/tools/data';

export default defineComponent({
  name: 'Timetable',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonItem,
    IonIcon,
    IonLabel,
    IonFooter,
    IonGrid,
    IonRow,
    IonCol,
    IonRefresher,
    IonRefresherContent,
    IonSelect,
    IonSelectOption
  },
  setup() {
    const store = useStore();
    const select = ref('');

    return {
      store,
      select,
      informationOutline,
      moment,
      refreshContent
    };
  },
  created() {
    this.select = this.classes[0];
  },
  methods: {
    maxDepth() {
      for (let j = 9; j >= 0; j--) {
        let rowEmpty = true;
        for (let i = 4; i >= 0; i--) {
          rowEmpty = !this.lessons[i][j];

          if (!rowEmpty) {
            break;
          }
        }

        if (!rowEmpty) {
          return j + 1;
        }
      }

      return 0;
    }
  },
  computed: {
    timetables(): any {
      return this.store.getters.getData.timetables;
    },
    timetable(): any {
      return this.timetables.find((t: any) => t.class === this.select) || this.timetables[0];
    },
    lessons(): any {
      return this.timetable?.lessons;
    },
    meta(): any {
      return this.timetable.meta;
    },
    updatedAt(): any {
      return this.timetable.updatedAt;
    },
    classes(): any {
      return this.timetables.map((t: any) => t.class);
    }
  },
  watch: {
    timetables: function () {
      this.select = this.classes[0];
    }
  }
});
</script>

<style scoped>
.item_transparent {
  --ion-item-background: transparent;
}
</style>
