<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-title>MVV</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="refreshContent($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-searchbar v-model="search" style="padding: 1rem" @ionChange="queryStops"></ion-searchbar>
      <ion-list v-if="getStops.length > 0">
        <ion-item v-for="(item, i) in getStops" :key="i" button @click="selectStop(item)">
          {{ item.name }}
        </ion-item>
      </ion-list>
      <ion-list class="departure_wrapper">
        <departure-item
            v-for="(item, i) in getDepartures" :key="i"
            :direction="item.direction"
            :line="item.line"
            :time="item.time"
            :in-time="item.inTime"
        ></departure-item>
        <div id="disclaimer" class="py-4 px-2">
          <ion-item lines="none" style="align-self: center">
            <div id="icon">
              <ion-icon :icon="informationOutline"></ion-icon>
            </div>
            <div id="disclaimer-text">
              Alle Angaben sind ohne Gewähr. Die Daten stammen von mvv-muenchen.de.
            </div>
          </ion-item>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage, IonRefresher, IonRefresherContent,
  IonSearchbar,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import {informationOutline} from 'ionicons/icons';
import DepartureItem from '@/components/DepartureItem.vue';
import {fetchDepartures, findStop} from '@/tools/mvv';

import {defineComponent, ref} from 'vue';
import {useStore} from 'vuex';
import {saveMVVState} from '@/tools/storage';
import {refreshContent} from '@/tools/data';

import moment from 'moment';

export default defineComponent({
  name: 'MVV',
  components: {
    DepartureItem,
    IonIcon,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonItem,
    IonList,
    IonSearchbar,
    IonBackButton,
    IonButtons,
    IonRefresher,
    IonRefresherContent
  },
  data() {
    return {
      informationOutline,
      departures: [] as any[],
      stops: [] as any[],
      currentQuery: undefined as string | undefined
    };
  },
  setup() {
    const store = useStore();
    const search = ref('');

    return {
      store,
      search
    };
  },
  created() {
    if (this.store.getters.getMVVState) {
      const state = this.store.getters.getMVVState;
      this.selectStop(state);
    }
  },
  methods: {
    async queryStops(e: any) {
      const query = e.detail.value;

      if (query.length >= 4 && !this.currentQuery) {
        this.currentQuery = query;
        setTimeout(() => this.runQuery(), 1000);
      } else {
        this.stops = [];
      }

    },
    async runQuery() {
      if (!this.currentQuery) return;
      const stops = await findStop(this.currentQuery);
      this.currentQuery = undefined;

      this.stops = stops.map((item: { name: any; id: any }) => {
        return {
          name: item.name,
          id: item.id
        };
      });
    },
    async loadDepartures(id: string) {
      const departures = await fetchDepartures(id);

      this.departures = departures.map((item: { line: { number: any }; direction: any; departureLive: any; departurePlanned: any }) => {
        const inTime = moment(item.departureLive, 'HH:mm').isSameOrBefore(moment(item.departurePlanned, 'HH:mm'));
        return {
          line: item.line.number,
          direction: item.direction,
          time: item.departureLive,
          inTime
        };
      });
    },
    selectStop(item: { name: string; id: string }) {
      if (item) {
        this.stops = [];

        this.search = item.name;
        this.loadDepartures(item.id);

        saveMVVState(item);
      }
    },
    async refreshContent(e: any) {
      if (this.store.getters.getMVVState) {
        const state = this.store.getters.getMVVState;
        this.selectStop(state);
      }

      await refreshContent(e);
    }
  },
  computed: {
    getDepartures(): any[] {
      return this.departures;
    },
    getStops(): any[] {
      return this.stops;
    }
  }
});
</script>

<style scoped>
#icon {
  font-size: 3.5vh;
  padding: 1vh;
}

#disclaimer {
  --ion-item-background: transparent;
}

.departure_wrapper {
  --ion-item-background: transparent;
}
</style>
