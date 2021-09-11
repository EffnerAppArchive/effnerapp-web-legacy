<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Schulaufgaben</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div v-if="!isAdvancedLevel && sortedExams && sortedExams.length > 0" id="list">
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
      <div v-else-if="!sortedExams || sortedExams.length === 0">
        <ion-grid>
          <ion-row class="text-center">
            <ion-col>
              Keine Einträge!
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <div v-else-if="isAdvancedLevel">
        <ion-grid>
          <ion-row class="text-center">
            <ion-col>
              <!-- TODO: Beautify -->
              <ion-button @click="openDocument(1)">1. Halbjahr</ion-button>
            </ion-col>
            <ion-col>
              <ion-button @click="openDocument(2)">2. Halbjahr</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <div class="row">
        <div id="disclaimer">
          <ion-item lines="none" style="align-self: center">
            <div id="icon">
              <ion-icon :icon="informationOutline"></ion-icon>
            </div>
            <div id="disclaimer-text">
              Alle Angaben sind ohne Gewähr. Es gilt das Wort des Lehrers.<br>
              Zuletzt aktualisiert: {{ moment(data.exams.updatedAt, 'YYYY-MM-DD\'T\'HH:mm:ss').format('DD.MM.YYYY HH:mm:ss') }}
            </div>
          </ion-item>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonGrid,
  IonRow,
  IonCol, IonButton
} from '@ionic/vue';
import {useStore} from 'vuex';
import {informationOutline} from 'ionicons/icons';
import TermItem from '@/components/TermItem.vue';
import moment from 'moment';
import {defineComponent} from 'vue';
import {Browser} from '@capacitor/browser';

export default defineComponent({
  name: 'Exams',
  components: {
    TermItem,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonButton
  },
  setup() {
    const store = useStore();
    const myClass = store.getters.getClass;
    const data = store.getters.getData;

    const exams: Exam[] = [];

    data.exams?.exams?.forEach((exam: Exam) => {
      exams.push({
        name: exam.name,
        date: exam.date,
        color: moment(exam.date, 'DD.MM.YYYY') < moment() ? 'danger' : 'success'
      });
    });

    return {
      store,
      myClass,
      data,
      exams,
      informationOutline,
      moment
    };
  },
  methods: {
    async openDocument(i: number) {
      const myAdvancedLevel = this.getAdvancedLevel();
      const document = this.data.documents.find((e: { key: string, uri: string }) => e.key.startsWith('DATA_TOP_LEVEL_SA_DOC_' + myAdvancedLevel + '_' + i));

      await Browser.open({url: document.uri});
    },
    getAdvancedLevel() {
      return this.myClass.startsWith('11') ? '11' : this.myClass.startsWith('12') ? '12' : null;
    }
  },
  computed: {
    sortedExams(): Exam[] {
      return this.exams.slice().sort((a: Exam, b: Exam) => {
        return moment(b.date, 'DD.MM.YYYY').unix() - moment(a.date, 'DD.MM.YYYY').unix();
      });
    },
    isAdvancedLevel(): boolean {
      // TODO: regex
      return this.myClass.startsWith('11') || this.myClass.startsWith('12');
    }
  }
});
</script>

<style scoped>
#list {
  padding-top: 1vh;
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
