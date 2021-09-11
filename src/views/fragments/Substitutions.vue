<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Vertretungen</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
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
              :absent-classes="getAbsentClasses" />
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
  IonPage, IonRippleEffect, IonRow,
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
    IonRippleEffect
  },
  async setup() {
    const store = useStore();

    let timetable, select;

    try {
      timetable = await store.getters.getSubstitutions;
      select = ref(timetable.items?.dates[0]);
    } catch (e) {
      console.error(e);
    }


    return {
      timetable: timetable as TimetableResponse,
      select,
      store,
      informationOutline
    };
  },
  created() {
    // improve this ugly shit
    if (this.timetable) {
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
    getSubstitutions(): Substitution[] {
      return this.substitutions;
    },
    getInformation(): string | undefined {
      return this.information;
    },
    getAbsentClasses(): string[] | undefined {
      console.log(this.timetable?.items?.absentClasses);
      return this.timetable?.items?.absentClasses?.filter((e) => e.date === this.currentDate).map((e: AbsentClass) => e.class + ': ' + e.period);
    }
    // isNative() {
    //   return (isPlatform('ios') || isPlatform('android')) && !isPlatform('mobileweb')
    // }
  }
});
</script>

<style scoped>
.substitutions_wrapper {
  --ion-item-background: transparent;
}
</style>
