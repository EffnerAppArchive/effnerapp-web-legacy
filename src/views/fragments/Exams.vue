<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Schulaufgaben</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="list">
        <div v-for="(item, i) in sortedExams" :key="i">
          <div class="row">
            <term-item
                :name="item.name"
                :date="item.date"
                :color="item.color"
            ></term-item>
          </div>
        </div>
      </div>
      <div class="row">
        <div id="disclaimer">
          <ion-item lines="none" style="align-self: center">
            <div id="icon">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
            </div>
            <div id="disclaimer-text">
              Alle Angaben sind ohne Gewähr. Es gilt das Wort des Lehrers.
            </div>
          </ion-item>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, IonItem} from '@ionic/vue';
import {useStore} from "vuex";
import {informationCircleOutline} from 'ionicons/icons';
import TermItem from "@/components/TermItem.vue";
import moment from "moment";
import {defineComponent} from "vue";

export default defineComponent({
  name: 'Exams',
  components: {TermItem, IonIcon, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonItem},
  created() {
    const store = useStore()

    const data = store.getters.getData

    const exams: Exam[] = []

    data.exams.exams.forEach((exam: Exam) => {
      exams.push({
        name: exam.name,
        date: exam.date,
        color: moment(exam.date, "DD.MM.YYYY") < moment() ? "danger" : "success"
      })
    })

    this.exams = exams

  },
  data() {
    return {
      exams: [] as Exam[],
      informationCircleOutline
    }
  },
  computed: {
    sortedExams(): Exam[] {
      return this.exams.slice().sort((a: Exam, b: Exam) => {
        return moment(b.date, "DD.MM.YYYY").unix() - moment(a.date, "DD.MM.YYYY").unix();
      })
    }
  }
})
</script>

<style scoped>
#list {
  padding-top: 1vh;
}
/* Clear floats after the columns */
.row:after {
  content: '';
  display: table;
  clear: both;
}
#icon {
  font-size: 3.5vh;
  padding: 1vh;
}
#disclaimer {
  --ion-item-background: transparent;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>
