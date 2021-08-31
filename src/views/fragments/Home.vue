<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-grid>

        <ion-row>
          <ion-col>
            <p style="font-size: x-large; text-align: center">{{ motd }}</p>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-card class="gradient_1" routerDirection="forward" @click="router.push({name: 'MVV'})">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem;">
                <ion-icon :icon="busOutline" class="card_icon" style="margin-right: 0.75rem;"></ion-icon>
                <ion-label style="font-weight: bold; font-size: 1.3rem">MVV-Abfahrtszeiten</ion-label>
              </ion-item>

              <ion-card-content>
                <ion-card>
                  <departure-item
                      v-if="nextDeparture"
                      :direction="nextDeparture.direction"
                      :line="nextDeparture.line"
                      :time="nextDeparture.time"
                      style="padding-top: 0.5rem; padding-bottom: 0.5rem"
                  ></departure-item>
                  <div v-else>
                    <ion-item class="item_transparent" lines="none">
                      <ion-icon :icon="informationOutline"
                                style="margin-right: 0.75rem; font-size: 1.5rem; color: white"></ion-icon>
                      <ion-label style="font-weight: normal; font-size: 1rem">Derzeit keine Abfahrten</ion-label>
                    </ion-item>
                  </div>
                </ion-card>
              </ion-card-content>
            </ion-card>
          </ion-col>


          <ion-col>
            <ion-card class="gradient_2">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-icon :icon="fileTrayFullOutline" class="card_icon" style="margin-right: 0.75rem;"/>
                <ion-label style="font-weight: bold; font-size: 1.3rem">News</ion-label>
              </ion-item>

              <ion-card-content>
                <ion-list class="news_item">
                  <ion-item>
                    <ion-icon :icon="documentOutline" class="card_icon" style="margin-right: 0.75rem;"></ion-icon>
                    <ion-label style="text-decoration: none" @click.prevent="openInBrowser(data.documents[0].uri)">
                      {{ data.documents[0].name }} <i class="fas fa-external-link-alt" style="padding-left: 0.25rem"/>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon :icon="schoolOutline" class="card_icon" style="margin-right: 0.75rem;"></ion-icon>
                    <ion-label style="text-decoration: none" @click.prevent="router.push({name: 'Schulaufgaben'})">
                      {{ data.exams.exams[data.exams.exams.length - 1].name }}
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-icon :icon="shuffle" class="card_icon"
                              style="margin-right: 0.75rem;"></ion-icon>
                    <ion-label style="text-decoration: none" @click.prevent="router.push({name: 'Vertretungen'})">
                      {{ getSubstitutions.length }} Vertretungen heute
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col>
            <ion-card class="gradient_3"
                      @click.prevent="openInBrowser(data.documents.find(d => d.key === 'DATA_FOOD_PLAN').uri)">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-label style="font-weight: bold; font-size: 1.3rem">Speiseplan <i class="fas fa-external-link-alt"/>
                </ion-label>
              </ion-item>
            </ion-card>
            <ion-card class="gradient_4">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-label style="font-weight: bold; font-size: 1.3rem">Informationen</ion-label>
              </ion-item>
            </ion-card>
          </ion-col>

          <ion-col>
            <ion-card class="gradient_5">
              <ion-item class="item_transparent" lines="none" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-label style="font-weight: bold; font-size: 1.3rem">Stundenplan</ion-label>
              </ion-item>

              <ion-card-content>
                <span style="color: white">Nächste Stunde</span>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow
} from '@ionic/vue';

import {defineComponent} from "vue";
import {useStore} from "vuex";

import {
  busOutline,
  documentOutline,
  fileTrayFullOutline,
  informationOutline,
  restaurantOutline,
  schoolOutline,
  shuffle
} from 'ionicons/icons'
import DepartureItem from "@/components/DepartureItem.vue";
import {useRouter} from "vue-router";
import {fetchDepartures} from "@/tools/mvv";
import {Browser} from "@capacitor/browser";

export default defineComponent({
  name: 'Home',
  components: {
    DepartureItem,
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonIcon,
    IonItem,
    IonLabel,
    IonList
  },
  setup() {
    const router = useRouter()
    const store = useStore()

    const substitutions = store.getters.getSubstitutions
    console.log(substitutions)

    return {
      busOutline,
      informationOutline,
      schoolOutline,
      documentOutline,
      shuffle,
      fileTrayFullOutline,
      restaurantOutline,

      router,
      store,

      substitutions
    }
  },
  created() {
    const data = this.store.getters.getData

    this.data = data

    console.log(data)

    if (this.store.getters.getMVVState) {
      this.loadDeparture(this.store.getters.getMVVState.id)
    }
  },
  data() {
    return {
      data: {
        motd: ''
      },
      nextDeparture: undefined
    }
  },
  methods: {
    async loadDeparture(id: string) {
      const departures = await fetchDepartures(id)

      this.nextDeparture = departures.map((item: any) => {
        return {
          line: item.line.number,
          direction: item.direction,
          time: item.departureLive
        }
      })[0]

      console.log(this.nextDeparture)
    },
    async openInBrowser(uri: string) {
      await Browser.open({url: uri})
    }
  },
  computed: {
    motd(): string {
      return this.data.motd
    },
    getSubstitutions(): Array<Substitution> {
      const date = this.substitutions.items?.dates[0];
      return this.substitutions.items?.days?.get(date)?.find((entry: any) => entry.name === this.store.getters.getClass)?.items;
    }
  }
})
</script>

<style scoped>
.gradient_1 {
  background: linear-gradient(315deg, hsla(54, 100%, 62%, 1) 1%, hsla(149, 100%, 44%, 1) 100%);
}

.gradient_2 {
  background: linear-gradient(135deg, hsla(186, 100%, 69%, 1) 0%, hsla(217, 100%, 50%, 1) 100%);
}

.gradient_3 {
  background: linear-gradient(180deg, hsla(78, 56%, 85%, 1) 0%, hsla(359, 84%, 63%, 1) 100%);
}

.gradient_4 {
  background: linear-gradient(90deg, hsla(339, 100%, 55%, 1) 0%, hsla(197, 100%, 64%, 1) 100%);
}

.gradient_5 {
  background: linear-gradient(0deg, hsla(261, 60%, 28%, 1) 0%, hsla(354, 57%, 64%, 1) 100%);
}

.item_transparent {
  --ion-item-background: transparent;
}

.card_icon {
  font-size: 2rem;
  color: white;
}

.news_item {
  -webkit-box-shadow: 5px 5px 8px 2px rgba(0, 0, 0, 0.55);
  box-shadow: 5px 5px 8px 2px rgba(0, 0, 0, 0.55);
  border: none;
  border-radius: 2%;
}
</style>
