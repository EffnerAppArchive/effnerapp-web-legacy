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
      <div v-else-if="isAdvancedLevel">
        <ion-grid>
          <ion-row class="text-center">
            <ion-col class="p-8">
              Bitte wähle das entsprechende Dokument aus, um die Schulaufgaben anzuzeigen
            </ion-col>
          </ion-row>
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
      <div v-else-if="!sortedExams || sortedExams.length === 0">
        <ion-grid>
          <ion-row class="text-center">
            <ion-col>
              Keine Einträge!
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>


    </ion-content>
    <ion-footer>
      <div class="row pb-4 px-4">
        <ion-item class="item_transparent" lines="none">
          <ion-icon :icon="informationOutline" color="black"
                    style="margin-right: 0.75rem; font-size: 1.5rem;"></ion-icon>
          <ion-label text-wrap style="font-weight: normal; font-size: 1rem">
              Alle Angaben sind ohne Gewähr. Es gilt das Wort des Lehrers.<br>
              <div v-if="data.exams?.updatedAt">
                Zuletzt aktualisiert:
                {{ moment(data.exams?.updatedAt, 'YYYY-MM-DD\'T\'HH:mm:ss').format('DD.MM.YYYY HH:mm:ss') }}
              </div>
          </ion-label>
        </ion-item>
      </div>
    </ion-footer>
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
  IonCol, IonButton, toastController, IonFooter, IonLabel
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
    IonButton,
    IonFooter,
    IonLabel
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

      if (document) {
        await Browser.open({url: document.uri});
      } else {
        await this.openToast('Dieses Dokument wurde nicht gefunden.');
      }

    },
    getAdvancedLevel() {
      return this.myClass.startsWith('11') ? '11' : this.myClass.startsWith('12') ? '12' : null;
    },
    async openToast(message: string) {
      const toast = await toastController
          .create({
            message: message,
            duration: 2000
          });
      return toast.present();
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

.item_transparent {
  --ion-item-background: transparent;
}
</style>
