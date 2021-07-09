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

<script>
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
import DepartureItem from "@/components/DepartureItem";
import {findStop, fetchDepartures} from "@/tools/mvv";

import {ref} from 'vue';

export default {
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
      departures: [],
      stops: []
    }
  },
  setup() {
    const search = ref('')

    return {
      search
    }
  },
  // async created() {
  //   await this.loadDepartures('de:09174:6800')
  // },
  methods: {
    async queryStops(e) {
      const stops = await findStop(e.detail.value)

      console.log(stops)

      this.stops = stops.map(item => {
        return {
          name: item.name,
          id: item.id
        }
      })
    },
    async loadDepartures(id) {
      const departures = await fetchDepartures(id)

      this.departures = departures.map(item => {
        return {
          line: item.line.number,
          direction: item.direction,
          time: item.departureLive
        }
      })
    },
    selectStop(item) {
      this.stops = []

      console.log(item)

      this.search = item.name

      this.loadDepartures(item.id)
    }
  },
  computed: {
    getDepartures() {
      return this.departures
    },
    getStops() {
      return this.stops.filter(value => value.name !== this.search)
    }
  }
}
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
  padding-top: 1rem;
  padding-bottom: 0.5rem;
  --ion-item-background: transparent;
}

.departure_wrapper {
  --ion-item-background: transparent;
}
</style>
