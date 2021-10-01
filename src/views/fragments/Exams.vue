<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Schulaufgaben</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="refreshContent($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <div v-if="sortedExams && sortedExams.length > 0" id="list">
        <div v-for="(item, i) in sortedExams" :key="i">
          <div class="row">
            <term-item
                :color="item.color"
                :date="item.date"
                :name="item.name"
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
      <div>
        <ion-item class="item_transparent" lines="none">
          <ion-icon :icon="informationOutline" color="black"
                    style="margin-right: 0.75rem; font-size: 1.5rem;"></ion-icon>
          <ion-label style="font-weight: normal; font-size: 1rem" text-wrap>
            Alle Angaben sind ohne Gewähr. Es gilt das Wort des Lehrers.<br>
            <div v-if="data.exams?.updatedAt">
              Zuletzt aktualisiert:
              {{ moment(data.exams?.updatedAt, 'YYYY-MM-DD\'T\'HH:mm:ss').format('DD.MM.YYYY HH:mm:ss') }}
            </div>
          </ion-label>
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
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
import {useStore} from 'vuex';
import {informationOutline} from 'ionicons/icons';
import TermItem from '@/components/TermItem.vue';
import moment from 'moment';
import {defineComponent} from 'vue';

import {refreshContent} from '@/tools/data';
import {getLevel, isAdvancedLevel, openInBrowser, openToast} from '@/tools/helper';

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
    IonLabel,
    IonRefresher,
    IonRefresherContent,
    IonRippleEffect
  },
  setup() {
    const store = useStore();
    const myClass = store.getters.getClass;

    return {
      store,
      myClass,
      informationOutline,
      moment,
      refreshContent,
      isAdvancedLevel
    };
  },
  methods: {
    getDocument() {
      return this.data.documents.find((e: { key: string, uri: string }) => e.key.startsWith('DATA_EXAMS_Q' + getLevel()));
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
    exams(): Exam[] {
      const exams: Exam[] = [];

      this.data.exams?.exams?.forEach((exam: Exam) => {
        exams.push({
          name: exam.name,
          date: exam.date,
          color: moment(exam.date, 'DD.MM.YYYY') < moment() ? 'danger' : 'success'
        });
      });

      return exams;
    },
    sortedExams(): Exam[] {
      return this.exams.slice().sort((a: Exam, b: Exam) => {
        return moment(a.date, 'DD.MM.YYYY').unix() - moment(b.date, 'DD.MM.YYYY').unix();
      });
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
