<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col>
            <p style="font-size: x-large; text-align: center">{{ motd }}</p>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-card class="gradient_1" @click="router.push({name: 'MVV'})">
              <ion-item lines="none" class="item_transparent" style="padding-top: 0.5rem">
                <ion-icon class="card_icon" :icon="bus" style="margin-right: 0.75rem;"></ion-icon>
                <ion-label style="font-weight: bold; font-size: 1.3rem">MVV-Abfahrtszeiten</ion-label>
              </ion-item>

              <ion-card-content>
                <ion-card>
                  <departure-item
                      v-for="(item, i) in [{line: '721', direction: 'Dachau', time: '13:37'}]" :key="i"
                      :line="item.line"
                      :direction="item.direction"
                      :time="item.time"
                  ></departure-item>
                </ion-card>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col>
            <ion-card>
              <ion-item lines="none" class="item_transparent" style="padding-top: 0.5rem; padding-bottom: 0.5rem">
                <ion-icon class="card_icon" :icon="grid" style="margin-right: 0.75rem;"></ion-icon>
                <ion-label style="font-weight: bold; font-size: 1.3rem">Vertretungen</ion-label>
              </ion-item>

              <ion-card-content class="gradient_2">
                <span style="font-size: 4rem; color: white">5</span>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-card>
              <ion-card-header>
                <ion-card-title>Another card</ion-card-title>
              </ion-card-header>

              <ion-card-content class="gradient_3">
                <span style="color: white">Another card content bla lol</span>
              </ion-card-content>
            </ion-card>
          </ion-col>
          <ion-col>
            <ion-card>
              <ion-card-header>
                <ion-card-title>Another card</ion-card-title>
              </ion-card-header>

              <ion-card-content class="gradient_4">
                <span style="color: white">Another card content bla lol</span>
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
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon
} from '@ionic/vue';

import {defineComponent} from "vue";
import {useStore} from "vuex";

import {bus, grid} from 'ionicons/icons'
import DepartureItem from "@/components/DepartureItem.vue";
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'Home',
  components: {
    DepartureItem,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon
  },
  setup() {
    const router = useRouter()
    return {
      bus,
      grid,
      router
    }
  },
  created() {
    const store = useStore()

    const data = store.getters.getData

    console.log(data)


    this.data = data
  },
  data() {
    return {
      data: {
        motd: ''
      },
    }
  },
  computed: {
    motd(): string {
      return this.data.motd
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
  background: linear-gradient(90deg, hsla(33, 100%, 53%, 1) 0%, hsla(58, 100%, 68%, 1) 100%);
}

.gradient_4 {
  background: linear-gradient(90deg, hsla(339, 100%, 55%, 1) 0%, hsla(197, 100%, 64%, 1) 100%);
}

.item_transparent {
  --ion-item-background: transparent;
}

.card_icon {
  font-size: 2rem;
  color: white;
}
</style>
