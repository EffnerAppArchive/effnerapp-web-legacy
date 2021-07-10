<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>MVV</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-searchbar style="padding: 1rem" v-model="search" @ionChange="queryStops"></ion-searchbar>
      <ion-list v-if="getStops.length > 0">
        <ion-item v-for="(item, i) in getStops" :key="i" button @click="selectStop(item)">
          {{ item.name }}
        </ion-item>
      </ion-list>
      <ion-list class="departure_wrapper">
        <departure-item
            v-for="(item, i) in getDepartures" :key="i"
            :line="item.line"
            :direction="item.direction"
            :time="item.time"
        ></departure-item>
        <div id="disclaimer">
          <ion-item lines="none" style="align-self: center">
            <div id="icon">
              <ion-icon :icon="informationCircleOutline"></ion-icon>
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
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonSearchbar
} from "@ionic/vue";
import {informationCircleOutline} from 'ionicons/icons';
import DepartureItem from "@/components/DepartureItem.vue";
import {findStop, fetchDepartures} from "@/tools/mvv";

import {defineComponent, ref} from 'vue';
import {useStore} from "vuex";
import {saveMVVState} from "@/tools/storage";

export default defineComponent({
  name: "MVV",
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
    IonSearchbar
  },
  data() {
    return {
      informationCircleOutline,
      departures: [] as any[],
      stops: [] as any[],
      currentQuery: undefined as string | undefined
    }
  },
  setup() {
    const search = ref('')

    return {
      search
    }
  },
  created() {
    const store = useStore()
    if (store.getters.getMVVState) {
      const state = store.getters.getMVVState
      console.log(state)
      this.selectStop(state)
    }
  },
  methods: {
    async queryStops(e: any) {
      const query = e.detail.value

      if (query.length >= 4 && !this.currentQuery) {
        this.currentQuery = query
        setTimeout(() => this.runQuery(), 1000)
      } else {
        this.stops = []
      }

    },
    async runQuery() {
      if(!this.currentQuery) return;
      const stops = await findStop(this.currentQuery)
      this.currentQuery = undefined

      this.stops = stops.map((item: { name: any; id: any }) => {
        return {
          name: item.name,
          id: item.id
        }
      })
    },
    async loadDepartures(id: string) {
      const departures = await fetchDepartures(id)

      this.departures = departures.map((item: { line: { number: any }; direction: any; departureLive: any }) => {
        return {
          line: item.line.number,
          direction: item.direction,
          time: item.departureLive
        }
      })
    },
    selectStop(item: { name: string; id: string }) {
      if(item) {
        this.stops = []

        this.search = item.name
        this.loadDepartures(item.id)

        saveMVVState(item)
      }
    }
  },
  computed: {
    getDepartures(): any[] {
      return this.departures
    },
    getStops(): any[] {
      return this.stops.filter(value => value.name !== this.search)
    }
  }
})
</script>

<style scoped>
#icon {
  font-size: 3.5vh;
  padding: 1vh;
}

#disclaimer {
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  --ion-item-background: transparent;
}

.departure_wrapper {
  --ion-item-background: transparent;
}
</style>
