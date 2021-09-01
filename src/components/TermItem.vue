<template>
  <ion-card class="ion-activatable ripple-parent">
    <ion-card-header>
      <ion-card-subtitle :color="color">{{ date }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      {{ name }}
    </ion-card-content>
    <ion-ripple-effect />
  </ion-card>
</template>

<script lang="ts">
import {IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonRippleEffect} from '@ionic/vue';
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'TermItem',
  props: {
    date: String,
    name: String,
    color: String
  },
  components: {
    IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonRippleEffect
  }
});
</script>

<style scoped>
:root {
  --ion-color-green: #69bb7b;
  --ion-color-green-rgb: 105,187,123;
  --ion-color-green-contrast: #000000;
  --ion-color-green-contrast-rgb: 0,0,0;
  --ion-color-green-shade: #5ca56c;
  --ion-color-green-tint: #78c288;
  --ion-color-red: #e45353;
  --ion-color-red-rgb: 228,83,83;
  --ion-color-red-contrast: #ffffff;
  --ion-color-red-contrast-rgb: 255,255,255;
  --ion-color-red-shade: #c94949;
  --ion-color-red-tint: #e76464;
}
.ion-color-green {
  --ion-color-base: var(--ion-color-green);
  --ion-color-base-rgb: var(--ion-color-green-rgb);
  --ion-color-contrast: var(--ion-color-green-contrast);
  --ion-color-contrast-rgb: var(--ion-color-green-contrast-rgb);
  --ion-color-shade: var(--ion-color-green-shade);
  --ion-color-tint: var(--ion-color-green-tint);
}
.ion-color-red {
  --ion-color-base: var(--ion-color-red);
  --ion-color-base-rgb: var(--ion-color-red-rgb);
  --ion-color-contrast: var(--ion-color-red-contrast);
  --ion-color-contrast-rgb: var(--ion-color-red-contrast-rgb);
  --ion-color-shade: var(--ion-color-red-shade);
  --ion-color-tint: var(--ion-color-red-tint);
}
</style>
