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
        <ion-select v-model="select" :value="select" @ionChange="savePreferredTimetable(classes.indexOf(select))">
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
              :style="'background: ' + getColor(day, hour)"
              class="inner_cell break-all text-center py-2">
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
      <div v-if="isAdvancedLevel() && getDocument() != null">
        <ion-grid>
          <ion-row>
            <ion-col>
              <div class="pr-4 pb-6 pt-2">
                <ion-item class="item_transparent ripple-parent ion-activatable float-right" lines="none">
                  <a class="text-blue-800" @click="openDocument">PDF-Version anzeigen</a>
                  <ion-ripple-effect/>
                </ion-item>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <div>
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
  IonRefresherContent, IonRippleEffect,
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
import {TIMETABLE_COLOR_THEME_KEYS} from '@/tools/theme';
import {savePreferredTimetable} from '@/tools/storage';
import {getLevel, isAdvancedLevel, openInBrowser, openToast} from '@/tools/helper';

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
    IonSelectOption,
    IonRippleEffect
  },
  setup() {
    const store = useStore();
    const select = ref('');

    return {
      store,
      select,
      informationOutline,
      moment,
      refreshContent,
      savePreferredTimetable,
      isAdvancedLevel
    };
  },
  created() {
    this.select = this.classes[this.store.getters.getPreferredTimetable];
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
    },
    getColor(x: number, y: number): string {
      switch (this.colorTheme) {
        case 0:
          return this.meta.find((e: any) => e.subject === this.lessons[x - 1][y - 1])?.color || 'transparent';
        default:
          return TIMETABLE_COLOR_THEME_KEYS[this.colorTheme - 1];
      }
    },
    getDocument() {
      return this.data.documents.find((e: { key: string, uri: string }) => e.key.startsWith('DATA_TIMETABLE_Q' + getLevel()));
    },
    async openDocument() {
      const document = this.getDocument();

      if (document) {
        await openInBrowser(document.uri);
      } else {
        await openToast('Dieses Dokument wurde nicht gefunden.');
      }
    }
  },
  computed: {
    data(): any {
      return this.store.getters.getData;
    },
    timetables(): any {
      return this.data.timetables;
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
    },
    colorTheme(): number {
      return this.store.getters.getTimetableColorTheme;
    }
  },
  watch: {
    timetables: function () {
      this.select = this.classes[this.store.getters.getPreferredTimetable];
    }
  }
});
</script>

<style scoped>
.item_transparent {
  --ion-item-background: transparent;
}

.inner_cell {
  border: 1px solid
}
</style>
