<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>{{ period }}.
        Stunde {{ (info === 'entfällt' ? 'entfällt' : 'vertreten durch ' + subTeacher) }}
      </ion-card-title>
      <ion-card-content>
        Ausfall: {{ teacher }}
        <br>
        Raum: {{ room }}
        <br>
        Info: {{ info }}
      </ion-card-content>
    </ion-card-header>
    <ion-card-content>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import {IonCard, IonCardContent, IonCardHeader, IonCardTitle} from "@ionic/vue";
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
    IonCard, IonCardHeader, IonCardContent, IonCardTitle
  }
})
</script>
