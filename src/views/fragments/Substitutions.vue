<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vertretungen</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="refreshContent($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div v-if="timetable">
        <ion-item>
          <ion-label>Datum</ion-label>
          <ion-select v-model="select" @ionChange="selectDate(select)">
            <ion-select-option v-for="date in timetable.items?.dates" :key="date" :value="date">
              {{ date }}
            </ion-select-option>
          </ion-select>
        </ion-item>

        <ion-list class="substitutions_wrapper">
          <substitution-item
              v-for="(item, i) in getSubstitutions"
              :key="i"
              :info="item.info"
              :period="item.period"
              :room="item.room"
              :sub-teacher="item.subTeacher"
              :teacher="item.teacher"
              :full-class="item.fullClass"/>
          <substitution-item
              v-if="getInformation"
              key="info"
              :info="getInformation"
              teacher="info"/>
          <substitution-item
              v-if="getAbsentClasses && getAbsentClasses.length > 0"
              key="absent_classes"
              :absent-classes="getAbsentClasses"/>
        </ion-list>
      </div>
      <div v-else>Could not fetch data from dsbmobile!</div>
      <ion-grid>
        <ion-row>
          <ion-col>
            <div class="pr-4 pb-6">
              <ion-item class="item_transparent" lines="none">
                <ion-icon :icon="informationOutline" color="black"
                          style="margin-right: 0.75rem; font-size: 1.5rem;"></ion-icon>
                <ion-label style="font-weight: normal; font-size: 1rem">Zuletzt aktualisiert:
                  {{ timetable.time }}
                </ion-label>
              </ion-item>
            </div>
          </ion-col>
          <ion-col>
            <div class="text-right pr-4 pb-6 pt-2">
              <div class="ripple-parent ion-activatable">
                <a class="text-blue-800" @click="showFullPlan">Gesamten Vertretungsplan anzeigen</a>
                <ion-ripple-effect/>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonCol,
  IonContent, IonGrid,
  IonHeader, IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage, IonRefresher, IonRefresherContent, IonRippleEffect, IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {defineComponent, ref} from 'vue';
import {useStore} from 'vuex';
import SubstitutionItem from '@/components/SubstitutionItem.vue';
import {Browser} from '@capacitor/browser';

import {informationOutline} from 'ionicons/icons';

import {refreshContent} from '@/tools/data';

export default defineComponent({
  name: 'Substitutions',
  components: {
    SubstitutionItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonList,
    IonLabel,
    IonItem,
    IonIcon,
    IonRow,
    IonCol,
    IonGrid,
    IonRippleEffect,
    IonRefresher,
    IonRefresherContent
  },
  async setup() {
    const store = useStore();

    const select = ref('');

    return {
      select,
      store,
      informationOutline,
      refreshContent
    };
  },
  created() {
    // improve this ugly shit
    if (this.timetable) {
      this.select = this.timetable.items?.dates[0] as string;
      this.selectDate(this.timetable.items?.dates[0] as string);
    }
  },
  data() {
    return {
      substitutions: [] as Substitution[],
      information: undefined as string | undefined,
      currentDate: undefined as string | undefined
    };
  },
  methods: {
    selectDate(date: string) {
      const days = this.timetable?.items?.days;

      const substitutions = days?.get(date)?.filter(entry => this.matchesClass(entry.name as string))?.map(e => e.items);

      let tmp = [] as any[];
      if (substitutions) {
        for (let i = 0; i < substitutions.length; i++) {
          if (substitutions[i]) {
            tmp = tmp.concat(substitutions[i]);
          }
        }
      }

      this.substitutions = tmp as Substitution[];
      this.information = this.timetable?.items?.information?.get(date);
      this.currentDate = date;
    },
    matchesClass(sClass: string): boolean {
      const myClass = this.store.getters.getClass;
      if (myClass.startsWith('11') && sClass === '11Q') {
        return true;
      }

      if (myClass.startsWith('12') && sClass === '12Q') {
        return true;
      }

      return myClass === sClass;
    },
    async showFullPlan() {
      await Browser.open({url: this.timetable.url});
    }
  },
  computed: {
    timetable(): TimetableResponse {
      return this.store.getters.getSubstitutions;
    },
    getSubstitutions(): Substitution[] {
      return this.substitutions;
    },
    getInformation(): string | undefined {
      return this.information;
    },
    getAbsentClasses(): string[] | undefined {
      return this.timetable?.items?.absentClasses?.filter((e) => e.date === this.currentDate).map((e: AbsentClass) => e.class + ': ' + e.period);
    }
  },
  watch: {
    timetable: function () {
      this.select = this.timetable.items?.dates[0] as string;
    }
  }
});
</script>

<style scoped>
.substitutions_wrapper {
  --ion-item-background: transparent;
}
</style>
