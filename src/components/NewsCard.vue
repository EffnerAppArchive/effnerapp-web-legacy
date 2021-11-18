<template>
  <ion-card class="ion-activatable ripple-parent" @click="openInBrowser(uri)">
    <ion-card-header>
      <ion-card-subtitle style="color: #fff">{{ title }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content class="text_dark" v-if="excerpt || getImage">
      <ion-grid>
        <ion-row>
          <ion-col v-if="getImage" class="mb-4">
            <img class="rounded-2xl" :src="getImage" style="margin: auto">
          </ion-col>
        </ion-row>
        <ion-row v-if="excerpt">
          <ion-col>
            <div v-html="excerpt"/>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-card-content>
    <ion-ripple-effect/>
  </ion-card>
</template>

<script>
import {defineComponent} from 'vue';
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonGrid, IonRow, IonCol, IonRippleEffect} from '@ionic/vue';

import {openInBrowser} from '@/tools/helper';

export default defineComponent({
  name: 'NewsCard',
  components: {
    IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonGrid, IonRow, IonCol, IonRippleEffect
  },
  props: {
    id: Number,
    title: String,
    excerpt: String,
    content: String,
    uri: String
  },
  computed: {
    getImage() {
      const parser = new DOMParser();

      const html = parser.parseFromString(this.content, 'text/html');

      return html.querySelector('img')?.src || null;
    }
  },
  data() {
    return {
      openInBrowser
    };
  }
});
</script>

<style scoped>
.text_dark {
  color: var(--ion-text-color)
}
</style>
