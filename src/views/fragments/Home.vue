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
            <ion-card class="theme_alert ion-activatable ripple-parent">
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
            <ion-card :class="theme || 'theme_1'" class="ion-activatable ripple-parent" routerDirection="forward"
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
            <ion-card :class="theme || 'theme_2'" class="ion-activatable ripple-parent">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-icon :icon="fileTrayFullOutline" class="card_icon" style="margin-right: 0.75rem;"/>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">News</ion-label>
              </ion-item>

              <ion-card class="drop_shadow card_dark">
                <ion-item v-if="getNews && getNews[0] != null"
                          class="item_transparent ion-activatable ripple-parent">
                  <ion-icon :icon="newspaperOutline" class="card_icon"
                            style="margin-right: 0.75rem;"></ion-icon>
                  <ion-label class="card_dark_label" style="text-decoration: none"
                             @click="router.push({name: 'Aktuelles'})">
                    {{ getNews[0]?.title.rendered }}
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
            <ion-card :class="theme || 'theme_3'" class="ion-activatable ripple-parent"
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
            <ion-card :class="theme || 'theme_4'" class="ion-activatable ripple-parent"
                      @click="this.openInBrowser(data.documents.find(d => d.key === 'DATA_FOOD_PLAN').uri)">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-icon :icon="restaurantOutline" class="card_icon" style="margin-right: 0.75rem;"/>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">Speiseplan <i
                    class="fas fa-external-link-alt"/>
                </ion-label>
              </ion-item>
              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>

            <ion-card :class="theme || 'theme_5'" class="ion-activatable ripple-parent"
                      @click="router.push({name: 'Aktuelles'})">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-icon :icon="clipboardOutline" class="card_icon" style="margin-right: 0.75rem;"/>
                <ion-label class="card_dark_label" style="font-weight: bold; font-size: 1.3rem">Aktuelles
                </ion-label>
              </ion-item>
              <ion-ripple-effect></ion-ripple-effect>
            </ion-card>

            <ion-card :class="theme || 'theme_6'" class="ion-activatable ripple-parent"
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
  newspaperOutline,
  fileTrayFullOutline,
  informationOutline,
  restaurantOutline,
  schoolOutline,
  shuffle,
  warningOutline
} from 'ionicons/icons';
import {getCurrentSubstitutionDay, groupBy, openInBrowser, validateClass} from '@/tools/helper';

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
      newspaperOutline,
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
              return nextLesson + ' beginnt um ' + this.data?.timetableSchedule[lessonI + 1] + ' Uhr';
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

      return this.data?.timetableSchedule.findIndex((e: string) => {
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
    getNews(): any {
      return this.store.getters.getNews;
    },
    theme(): any {
      const theme = this.store.getters.getTheme;
      const obj: any = {};

      if (theme > 0) {
        obj['theme_' + this.store.getters.getTheme] = true;
        return obj;
      }

      return null;
    },
    getExamName(): string | null {
      const exams = this.data.exams?.exams?.filter((exam: Exam) => moment(exam.date, 'DD.MM.YYYY') >= moment()).slice().sort((a: Exam, b: Exam) => {
        return moment(a.date, 'DD.MM.YYYY').unix() - moment(b.date, 'DD.MM.YYYY').unix();
      });

      const grouped = Array.from(groupBy(exams, item => item.date));

      const nextExams = grouped[0];

      if (!nextExams) return null;

      const date = nextExams[0];

      if(nextExams[1].length === 1) {
        const {name} = nextExams[1][0];

        const subject = name.split(' in ')[1];

        return (subject + ' am ' + date) || name;
      }

      return date + ': ' + nextExams[1].map((item: any) => item.course.match(/\d+([a-z]+)\d+/)[1].toUpperCase()).join(', ');
    }
  }
});
</script>

<style scoped>
.theme_alert {
  background: linear-gradient(135deg, #e73827, #f85032);
}

.theme_1 {
  background: linear-gradient(135deg, #f8b500, #fceabb);
}

.theme_2 {
  background: linear-gradient(135deg, #24FE41, #FDFC47);
}

.theme_3 {
  background: linear-gradient(135deg, #0062ff, #61efff);
}

.theme_4 {
  background: linear-gradient(135deg, #5f0a87, #f8ceec);
}

.theme_5 {
  background: linear-gradient(135deg, #D31027, #e1eec3);
}

.theme_6 {
  background: linear-gradient(135deg, #50d1e0, #69e369);
}

.theme_7 {
  background: linear-gradient(135deg, #f1e73a, #86ff6c);
}

.theme_8 {
  background: linear-gradient(90deg, #f00000, #ff8000, #ffff00, #007940, #4040ff, #a000c0) fixed;
  background-size: 400% 400%;
  -webkit-animation: animate-gradient 2s ease infinite alternate;
  animation: animate-gradient 2s ease infinite alternate;
}

.theme_9 {
  background: #0d0d0d;
}

.theme_10 {
  background-image: url("https://www.vku.de/fileadmin/_processed_/b/c/csm_SparteWasser_ndrey_Armyagov_Adobe_6e6e746c7e.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  color: black !important;
}

@keyframes animate-gradient {
  0% {
    background-position: left;
  }
  100% {
    background-position: right;
  }
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
