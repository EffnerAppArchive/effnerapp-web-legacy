<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="home"></ion-back-button>
        </ion-buttons>
        <ion-title>Aktuelles</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false">
      <ion-refresher slot="fixed" @ionRefresh="refreshContent($event)">
        <ion-refresher-content>
        </ion-refresher-content>
      </ion-refresher>

      <NewsCard v-for="news in getNews"
                :id="news.id"
                :key="news.id"
                :title="news.title.rendered"
                :excerpt="news.excerpt.rendered"
                :content="news.content.rendered"
                :uri="news.guid.rendered">
      </NewsCard>
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
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar
} from '@ionic/vue';
import NewsCard from '@/components/NewsCard.vue';
import {useStore} from 'vuex';
import {refreshContent} from '@/tools/data';

export default defineComponent({
  name: 'News',
  components: {
    NewsCard,
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonRefresher,
    IonRefresherContent,
    IonBackButton,
    IonButtons
  },
  setup() {
    const store = useStore();

    return {
      store,
      refreshContent
    };
  },
  computed: {
    getNews(): [] {
      return this.store.getters.getNews;
    }
  }
});
</script>

<style scoped>
.text_dark {
  color: var(--ion-text-color)
}
</style>
