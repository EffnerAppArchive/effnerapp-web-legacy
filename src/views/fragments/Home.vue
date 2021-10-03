<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="text-center">{{ motd }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="refreshContent($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-grid>
        <ion-row v-if="data?.announcement">
          <ion-col>
            <ion-card class="gradient_0 ion-activatable ripple-parent">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem">
                <ion-icon :icon="warningOutline" class="card_icon" style="margin-right: 0.75rem;"></ion-icon>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">Meldung</ion-label>
              </ion-item>
              <ion-card-content class="text-white pt-2">
                {{ data?.announcement }}
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-card :class="getJulianCss" class="gradient_1 ion-activatable ripple-parent" routerDirection="forward"
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
                    :in-time="nextDeparture.inTime"
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
            <ion-card :class="getJulianCss" class="gradient_2 ion-activatable ripple-parent">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-icon :icon="fileTrayFullOutline" class="card_icon" style="margin-right: 0.75rem;"/>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">News</ion-label>
              </ion-item>

              <ion-card class="drop_shadow card_dark">
                <ion-item v-if="getDocuments && getDocuments[0] != null"
                          class="item_transparent ion-activatable ripple-parent">
                  <ion-icon :icon="documentOutline" class="card_icon"
                            style="margin-right: 0.75rem;"></ion-icon>
                  <ion-label class="card_dark_label" style="text-decoration: none"
                             @click="this.openInBrowser(getDocuments[0]?.uri)">
                    {{ getDocuments[0]?.name }} <i class="fas fa-external-link-alt" style="padding-left: 0.25rem"/>
                  </ion-label>
                  <ion-ripple-effect></ion-ripple-effect>
                </ion-item>

                <ion-item v-if="getExamName != null" class="item_transparent ion-activatable ripple-parent">
                  <ion-icon :icon="schoolOutline" class="card_icon"
                            style="margin-right: 0.75rem;"></ion-icon>
                  <ion-label class="card_dark_label" style="text-decoration: none"
                             @click.prevent="router.push({name: 'Schulaufgaben'})">
                    {{ getExamName }}
                  </ion-label>
                  <ion-ripple-effect></ion-ripple-effect>
                </ion-item>

                <ion-item class="item_transparent ion-activatable ripple-parent" lines="none">
                  <ion-icon :icon="shuffle" class="card_icon text-white"
                            style="margin-right: 0.75rem;"></ion-icon>
                  <ion-label class="card_dark_label" style="text-decoration: none;"
                             @click.prevent="router.push({name: 'Vertretungen'})">
                    {{ getSubstitutionsMessage }}
                  </ion-label>
                  <ion-ripple-effect></ion-ripple-effect>
                </ion-item>

              </ion-card>
              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>
          </ion-col>

          <ion-col>
            <ion-card :class="getJulianCss" class="gradient_3 ion-activatable ripple-parent"
                      @click="router.push({name: 'Stundenplan'})">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-icon :icon="calendarOutline" class="card_icon" style="margin-right: 0.75rem;"/>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">Stundenplan</ion-label>
              </ion-item>
              <ion-card v-if="getNextTimetableLesson()" class="drop_shadow card_dark">
                <ion-item class="item_transparent" lines="none">
                  <ion-icon :icon="calendarClearOutline"
                            class="card_icon"
                            style="margin-right: 0.75rem;"/>
                  <ion-label v-if="data?.timetables[store.getters.getPreferredTimetable]?.lessons"
                             class="card_dark_label" style="text-decoration: none">
                    {{ getNextTimetableLesson() }}
                  </ion-label>
                </ion-item>
              </ion-card>
              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>
          </ion-col>

        </ion-row>

        <ion-row>
          <ion-col>
            <ion-card :class="getJulianCss" class="gradient_4 ion-activatable ripple-parent"
                      @click="this.openInBrowser(data.documents.find(d => d.key === 'DATA_FOOD_PLAN').uri)">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-icon :icon="restaurantOutline" class="card_icon" style="margin-right: 0.75rem;"/>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">Speiseplan <i
                    class="fas fa-external-link-alt"/>
                </ion-label>
              </ion-item>
              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>


            <ion-card :class="getJulianCss" class="gradient_5 ion-activatable ripple-parent"
                      @click="router.push({name: 'Informationen'})">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-icon :icon="clipboardOutline" class="card_icon" style="margin-right: 0.75rem;"/>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">Informationen
                </ion-label>
              </ion-item>
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
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRippleEffect,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/vue';

import {defineComponent} from 'vue';
import {useStore} from 'vuex';

import moment from 'moment';
import DepartureItem from '@/components/DepartureItem.vue';
import {useRouter} from 'vue-router';
import {fetchDepartures} from '@/tools/mvv';

import {refreshContent} from '@/tools/data';
import {
  busOutline,
  calendarClearOutline,
  calendarOutline,
  clipboardOutline,
  documentOutline,
  fileTrayFullOutline,
  informationOutline,
  restaurantOutline,
  schoolOutline,
  shuffle,
  warningOutline
} from 'ionicons/icons';
import {getCurrentSubstitutionDay, openInBrowser, validateClass} from '@/tools/helper';

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
    const julian = store.getters.getJulianMode;

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
      clipboardOutline,

      router,
      store,

      substitutions,
      julian,
      openInBrowser
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
      nextDeparture: undefined as { line: number; direction: string; time: string; } | undefined
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

      this.nextDeparture = departures.map((item: Departure) => {
        const inTime = moment(item.departureLive, 'HH:mm').isSameOrBefore(moment(item.departurePlanned, 'HH:mm'));
        return {
          line: item.line.number,
          direction: item.direction,
          time: item.departureLive,
          inTime
        };
      })[0];
    },
    getNextTimetableLesson(): string | undefined {
      const lessons = this.data?.timetables[this.store.getters.getPreferredTimetable]?.lessons;

      try {
        if (lessons) {
          const now = new Date();
          const dayI = now.getDay() - 1;

          const lessonI = this.getCurrentLessonIndex();

          if (lessonI !== -1 && dayI < 5 && dayI >= 0) {
            const nextLesson = lessons[dayI][lessonI];
            if (nextLesson) {
              return nextLesson + ' beginnt um ' + this.times[lessonI + 1] + ' Uhr';
            }
          }
        }
      } catch (e) {
        return undefined;
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
      if (this.store.getters.getMVVState?.id) {
        await this.loadDeparture(this.store.getters.getMVVState.id);
      }
      await refreshContent(e);
    }
  },
  computed: {
    data(): any {
      return this.store.getters.getData;
    },
    motd(): string {
      return this.data?.motd;
    },
    getSubstitutionsMessage(): string {
      const dates = this.store.getters.getSubstitutions?.items?.dates;
      const days = this.store.getters.getSubstitutions?.items?.days;

      const date = getCurrentSubstitutionDay(dates);
      const today = moment().format('DD.MM.YYYY');
      const myClass = this.store.getters.getClass;

      const substitutions = days?.get(date)?.filter((entry: { name: string; items: any[] }) => validateClass(myClass, entry.name as string))?.map((e: { items: any; }) => e.items);

      let tmp = [] as any[];
      if (substitutions) {
        for (let i = 0; i < substitutions.length; i++) {
          if (substitutions[i]) {
            tmp = tmp.concat(substitutions[i]);
          }
        }
      }

      return (tmp.length > 0 ? tmp.length : 'Keine') + (tmp.length === 1 ? ' Vertretung ' : ' Vertretungen ') + (date === today ? 'heute' : 'am ' + date);
    },
    getDocuments(): any {
      return this.data?.documents?.filter((e: { key: string; }) => e.key.startsWith('DATA_INFORMATION'));
    },
    getJulianCss(): any {
      return {
        gradient_julian: this.store.getters.getJulianMode
      };
    },
    getExamName(): string | null {
      const exam = this.data.exams?.exams?.filter((exam: Exam) => moment(exam.date, 'DD.MM.YYYY') >= moment()).slice().sort((a: Exam, b: Exam) => {
        return moment(a.date, 'DD.MM.YYYY').unix() - moment(b.date, 'DD.MM.YYYY').unix();
      })[0];

      if(!exam) return null;

      const { name, date } = exam;

      const subject = name.split(' in ')[1];

      return (subject + ' am ' + date) || name;
    }
  }
});
</script>

<style scoped>
.gradient_0 {
  background: linear-gradient(135deg, #e73827, #f85032);
}

.gradient_1 {
  background: linear-gradient(135deg, #f8b500, #fceabb);
}

.gradient_2 {
  background: linear-gradient(135deg, #24FE41, #FDFC47);
}

.gradient_3 {
  background: linear-gradient(135deg, #0062ff, #61efff);
}

.gradient_4 {
  background: linear-gradient(135deg, #5f0a87, #f8ceec);
}

.gradient_5 {
  background: linear-gradient(135deg, #D31027, #e1eec3);
}

.gradient_julian {
  background: linear-gradient(315deg, #ffec3d, #00e06c);
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
