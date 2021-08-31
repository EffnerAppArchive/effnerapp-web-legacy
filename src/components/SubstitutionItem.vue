<template>
  <ion-card>
    <div v-if="teacher === 'info'">
      <ion-card-header>
        <ion-card-title style="color: limegreen">Allgemeine Infos
        </ion-card-title>
      </ion-card-header>
      <ion-card-content style="margin-left: 1rem">
        {{ info }}
      </ion-card-content>
    </div>

    <div v-else>
      <ion-card-header>
        <ion-card-title>{{ period }}.
          Stunde {{ (info === 'entfällt' ? 'entfällt' : 'vertreten durch ' + subTeacher) }}
        </ion-card-title>
      </ion-card-header>
      <ion-card-content style="margin-left: 1rem">
        Ausfall: {{ teacher }}
        <br>
        Raum: {{ room }}
        <br>
        Info: {{ info }}
      </ion-card-content>
    </div>

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
