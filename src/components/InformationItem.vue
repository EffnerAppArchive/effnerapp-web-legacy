<template>
  <ion-item class="ion-activatable ripple-parent text-white" @click="openDocument">
    <ion-icon :icon="documentOutline" slot="start"/>
    <ion-label>{{ title }}</ion-label>
    <i class="fas fa-external-link-alt"/>
    <ion-ripple-effect/>
  </ion-item>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {IonItem, IonRippleEffect, IonIcon, IonLabel} from '@ionic/vue';

import {documentOutline, arrowForward} from 'ionicons/icons';
import {Browser} from '@capacitor/browser';

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
      await Browser.open({url: this.uri});
    }
  }
});
</script>

<style scoped>

</style>
