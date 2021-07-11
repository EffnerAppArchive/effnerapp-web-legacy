<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ period + '. Stunde' }}</ion-card-title>
      <ion-card-subtitle>{{ teacher + ' > ' + subTeacher + ' @' + room + (info ? ' (' + info + ')' : '') }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import {IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonCardTitle} from "@ionic/vue";
import {defineComponent} from "vue";

export default defineComponent({
  name: 'SubstitutionItem',
  props: {
    teacher: String,
    period: String,
    subTeacher: String,
    room: String,
    info: String

  },
  components: {
    IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonCardTitle
  }
})
</script>
