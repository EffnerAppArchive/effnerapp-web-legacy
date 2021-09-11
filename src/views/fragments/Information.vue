<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-title>Informationen</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="refreshContent($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-card class="item_transparent pt-4 pb-4 pr-4">
        <information-item
            v-for="(item, i) in getDocuments" :key="i"
            :title="item.name"
            :uri="item.uri"
        ></information-item>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonCard,
  IonPage,
  IonTitle,
  IonToolbar, IonRefresher, IonRefresherContent
} from '@ionic/vue';
import InformationItem from '@/components/InformationItem.vue';
import {useStore} from 'vuex';

import {refreshContent} from '@/tools/data';

export default defineComponent({
  name: 'Information',
  components: {
    InformationItem,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonCard,
    IonPage,
    IonTitle,
    IonToolbar,
    IonRefresher,
    IonRefresherContent
  },
  setup() {
    const store = useStore();

    return {
      store,
      refreshContent
    };
  },
  computed: {
    documents(): any {
      return this.store.getters.getData.documents;
    },
    getDocuments(): any {
      return this.documents?.filter((e: { key: string; }) => e.key.startsWith('DATA_INFORMATION'));
    }
  }
});
</script>

<style scoped>
.item_transparent {
  --ion-item-background: transparent;
}
</style>
