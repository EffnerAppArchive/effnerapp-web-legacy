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
          ></substitution-item>
        </ion-list>
      </div>
      <div v-else>Native feature only! Fuck CORS!</div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {defineComponent, ref} from "vue";
import {useStore} from "vuex";
import SubstitutionItem from "@/components/SubstitutionItem.vue";

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
    IonItem
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
      store
    }
  },
  created() {
    // improve this ugly shit
    if (this.timetable) {
      this.selectDate(this.timetable.items?.dates[0] as string)
    }
  },
  data() {
    return {
      substitutions: [] as Substitution[]
    }
  },
  methods: {
    selectDate(date: string) {
      const days = this.timetable?.items?.days

      const substitutions = days?.get(date)?.find(entry => entry.name === this.store.getters.getClass)?.items

      console.log(substitutions)
      this.substitutions = substitutions as Substitution[]
    }
  },
  computed: {
    getSubstitutions(): Substitution[] {
      return this.substitutions
    },
    // isNative() {
    //   return (isPlatform('ios') || isPlatform('android')) && !isPlatform('mobileweb')
    // }
  }
})
</script>

<style scoped>
.substitutions_wrapper {
  --ion-item-background: transparent;
}
</style>
