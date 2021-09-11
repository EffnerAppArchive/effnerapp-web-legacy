<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ motd }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="refreshContent($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-grid>
        <ion-row v-if="data.announcement">
          <ion-col>
            <ion-card class="gradient_0 ion-activatable ripple-parent">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem">
                <ion-icon :icon="warningOutline" class="card_icon" style="margin-right: 0.75rem;"></ion-icon>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">Meldung</ion-label>
              </ion-item>
              <ion-card-content class="text-white pt-2">
                {{ data.announcement }}
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-card class="gradient_1 ion-activatable ripple-parent" routerDirection="forward"
                      @click="router.push({name: 'MVV'})">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem;">
                <ion-icon :icon="busOutline" class="card_icon" style="margin-right: 0.75rem;"></ion-icon>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">MVV-Abfahrtszeiten
                </ion-label>
              </ion-item>

              <ion-card class="drop_shadow card_dark">
                <departure-item
                    v-if="nextDeparture"
                    :direction="nextDeparture.direction"
                    :line="nextDeparture.line"
                    :time="nextDeparture.time"
                    class="text-white"
                    style="padding-top: 0.5rem; padding-bottom: 0.5rem"
                />
                <div v-else>
                  <ion-item class="item_transparent" lines="none">
                    <ion-icon :icon="informationOutline" class="card_icon"
                              style="margin-right: 0.75rem; font-size: 1.5rem;"></ion-icon>
                    <ion-label class="card_dark_label" style="font-weight: normal; font-size: 1rem">Derzeit keine
                      Abfahrten
                    </ion-label>
                  </ion-item>
                </div>
              </ion-card>
            </ion-card>
            <ion-ripple-effect></ion-ripple-effect>
          </ion-col>

          <ion-col>
            <ion-card class="gradient_2 ion-activatable ripple-parent">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-icon :icon="fileTrayFullOutline" class="card_icon" style="margin-right: 0.75rem;"/>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">News</ion-label>
              </ion-item>

              <ion-card class="drop_shadow card_dark">
                <ion-item v-if="getDocuments && getDocuments[0] != null" class="item_transparent ion-activatable ripple-parent">
                  <ion-icon :icon="documentOutline" class="card_icon"
                            style="margin-right: 0.75rem;"></ion-icon>
                  <ion-label class="card_dark_label" style="text-decoration: none"
                             @click="openInBrowser(getDocuments[0]?.uri)">
                    {{ getDocuments[0]?.name }} <i class="fas fa-external-link-alt" style="padding-left: 0.25rem"/>
                  </ion-label>
                  <ion-ripple-effect></ion-ripple-effect>
                </ion-item>

                <ion-item v-if="data.exams?.exams[0] != null" class="item_transparent ion-activatable ripple-parent">
                  <ion-icon :icon="schoolOutline" class="card_icon"
                            style="margin-right: 0.75rem;"></ion-icon>
                  <ion-label class="card_dark_label" style="text-decoration: none"
                             @click.prevent="router.push({name: 'Schulaufgaben'})">
                    {{ data.exams?.exams[data.exams?.exams.length - 1]?.name }}
                  </ion-label>
                  <ion-ripple-effect></ion-ripple-effect>
                </ion-item>

                <ion-item class="item_transparent ion-activatable ripple-parent" lines="none">
                  <ion-icon :icon="shuffle" class="card_icon text-white"
                            style="margin-right: 0.75rem;"></ion-icon>
                  <ion-label class="card_dark_label" style="text-decoration: none;"
                             @click.prevent="router.push({name: 'Vertretungen'})">
                    {{ getSubstitutions?.length || 0 }} Vertretungen heute
                  </ion-label>
                  <ion-ripple-effect></ion-ripple-effect>
                </ion-item>

              </ion-card>
              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-card class="gradient_3 ion-activatable ripple-parent"
                      @click.prevent="openInBrowser(data.documents.find(d => d.key === 'DATA_FOOD_PLAN').uri)">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">Speiseplan <i
                    class="fas fa-external-link-alt"/>
                </ion-label>
              </ion-item>
              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>
            <ion-card class="gradient_4 ion-activatable ripple-parent" @click="router.push({name: 'Informationen'})">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">Informationen
                </ion-label>
              </ion-item>
              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>
          </ion-col>

          <ion-col>
            <ion-card class="gradient_5 ion-activatable ripple-parent" @click="router.push({name: 'Stundenplan'})">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem;">
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">Stundenplan</ion-label>
              </ion-item>
              <ion-card class="drop_shadow card_dark">
                <ion-item class="item_transparent" lines="none">
                  <ion-icon :icon="getNextTimetableLesson() ? calendarOutline : calendarClearOutline" class="card_icon"
                            style="margin-right: 0.75rem;"></ion-icon>
                  <ion-label v-if="data.timetable?.lessons" class="card_dark_label" style="text-decoration: none">
                    {{ getNextTimetableLesson() || 'Gerade kein Unterricht' }}
                  </ion-label>
                </ion-item>
              </ion-card>
              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage, IonRefresher, IonRefresherContent,
  IonRippleEffect,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/vue';

import {defineComponent} from 'vue';
import {useStore} from 'vuex';

import moment from 'moment';

import {
  busOutline,
  calendarClearOutline,
  calendarOutline,
  documentOutline,
  fileTrayFullOutline,
  informationOutline,
  restaurantOutline,
  schoolOutline,
  shuffle,
  warningOutline
} from 'ionicons/icons';
import DepartureItem from '@/components/DepartureItem.vue';
import {useRouter} from 'vue-router';
import {fetchDepartures} from '@/tools/mvv';
import {Browser} from '@capacitor/browser';

import {refreshContent} from '@/tools/data';

export default defineComponent({
  name: 'Home',
  components: {
    DepartureItem,
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonIcon,
    IonItem,
    IonLabel,
    IonRippleEffect,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCardContent,
    IonRefresher,
    IonRefresherContent
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const substitutions = store.getters.getSubstitutions;

    return {
      busOutline,
      informationOutline,
      schoolOutline,
      documentOutline,
      shuffle,
      fileTrayFullOutline,
      restaurantOutline,
      calendarOutline,
      calendarClearOutline,
      warningOutline,

      router,
      store,

      substitutions
    };
  },
  created() {
    if (this.store.getters.getMVVState) {
      this.loadDeparture(this.store.getters.getMVVState.id);
    }
  },
  data() {
    return {
      // TODO: improve
      times: [
        '7:15',
        '8:00',
        '8:45',
        '9:45',
        '10:30',
        '11:15',
        '12:15',
        '13:00',
        '13:45',
        '14:30',
        '15:15',
        '16:00'
      ],
      nextDeparture: undefined
    };
  },
  watch: {
    '$store.getters.getMVVState': function () {
      this.loadDeparture(this.store.getters.getMVVState.id);
    }
  },
  methods: {
    async loadDeparture(id: string) {
      console.log('Fetching departures ...');
      const departures = await fetchDepartures(id);

      this.nextDeparture = departures.map((item: any) => {
        return {
          line: item.line.number,
          direction: item.direction,
          time: item.departureLive
        };
      })[0];
    },
    async openInBrowser(uri: string) {
      await Browser.open({url: uri});
    },
    getNextTimetableLesson(): string | undefined {
      const {lessons} = this.data.timetable;

      if (lessons) {
        const now = new Date();
        const dayI = now.getDay() - 1;

        const lessonI = this.getCurrentLessonIndex();

        if (lessonI !== -1 && dayI < 5) {
          const nextLesson = lessons[dayI][lessonI];
          if (nextLesson) {
            return nextLesson + ' beginnt um ' + this.times[lessonI + 1] + ' Uhr';
          }
        }
      }

      return undefined;
    },
    getCurrentLessonIndex(): number {
      const now = moment();

      return this.times.findIndex(e => {
        const start = moment(e, 'HH:mm');
        const end = moment(e, 'HH:mm').add(45, 'minutes');
        return now.isBetween(start, end);
      });
    },
    async refreshContent(e: any) {
      console.log('Refreshing data (home) ...');
      await this.loadDeparture(this.store.getters.getMVVState.id);
      await refreshContent(e);
    }
  },
  computed: {
    data(): any {
      return this.store.getters.getData;
    },
    motd(): string {
      return this.data.motd;
    },
    getSubstitutions(): Array<Substitution> {
      const date = this.store.getters.getSubstitutions?.items?.dates[0];
      return this.store.getters.getSubstitutions?.items?.days?.get(date)?.find((entry: any) => entry.name === this.store.getters.getClass)?.items;
    },
    getDocuments(): any {
      return this.data.documents?.filter((e: { key: string; }) => e.key.startsWith('DATA_INFORMATION'));
    }
  }
});
</script>

<style scoped>
.gradient_0 {
  background: linear-gradient(315deg, hsl(354, 64%, 49%) 1%, hsl(4, 85%, 58%) 100%);
}

.gradient_1 {
  background: linear-gradient(315deg, hsla(54, 100%, 62%, 1) 1%, hsla(149, 100%, 44%, 1) 100%);
}

.gradient_2 {
  background: linear-gradient(135deg, hsla(186, 100%, 69%, 1) 0%, hsla(217, 100%, 50%, 1) 100%);
}

.gradient_3 {
  background: linear-gradient(180deg, hsla(78, 56%, 85%, 1) 0%, hsla(359, 84%, 63%, 1) 100%);
}

.gradient_4 {
  background: linear-gradient(90deg, hsla(339, 100%, 55%, 1) 0%, hsla(197, 100%, 64%, 1) 100%);
}

.gradient_5 {
  background: linear-gradient(0deg, hsla(261, 60%, 28%, 1) 0%, hsla(354, 57%, 64%, 1) 100%);
}

.item_transparent {
  --ion-item-background: transparent;
}

.card_icon {
  font-size: 2rem;
  color: white;
}

.drop_shadow {
  --ion-item-background: transparent;
  -webkit-box-shadow: 5px 5px 8px 2px rgba(0, 0, 0, 0.55);
  box-shadow: 5px 5px 8px 2px rgba(0, 0, 0, 0.55);
}

.card_dark {
  --ion-item-background: #121212;
}

.card_dark_label {
  color: white;
}

</style>
