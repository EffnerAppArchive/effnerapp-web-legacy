<template>
  <ion-item class="ion-activatable ripple-parent" @click="openDocument">
    <ion-icon slot="start" :icon="documentOutline"/>
    <ion-label>{{ title }}</ion-label>
    <i class="fas fa-external-link-alt"/>
    <ion-ripple-effect/>
  </ion-item>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {IonIcon, IonItem, IonLabel, IonRippleEffect} from '@ionic/vue';

import {arrowForward, documentOutline} from 'ionicons/icons';
import {openInBrowser} from '@/tools/helper';

export default defineComponent({
  name: 'InformationItem',
  props: {
    title: String,
    uri: String
  },
  components: {IonItem, IonRippleEffect, IonIcon, IonLabel},
  setup() {
    return {
      documentOutline,
      arrowForward
    };
  },
  methods: {
    async openDocument() {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await openInBrowser(this.uri!);
    }
  }
});
</script>

<style scoped>

</style>
