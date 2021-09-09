<template>
  <ion-card class="substitution_card ion-activatable ripple-parent">
    <div v-if="teacher === 'info'">
      <ion-card-header>
        <ion-card-subtitle style="color: #69e369">Allgemeine Infos
        </ion-card-subtitle>
      </ion-card-header>
      <ion-card-content style="margin-left: 0.5rem" class="text-white">
        {{ info }}
      </ion-card-content>
    </div>

    <div v-else>
      <ion-card-header>
        <ion-card-subtitle class="text-white">
          {{ period }}. Stunde
          {{ (info === 'entfällt' ? 'entfällt' : 'vertreten durch ' + subTeacher) }}
          <ion-badge v-if="fullClass !== myClass" style="margin-left: 0.3rem; padding: 0.3rem; min-width: 2rem; background: #e85b5b" class="inline">
            {{ fullClass }}
          </ion-badge>
        </ion-card-subtitle>
      </ion-card-header>
      <ion-card-content style="margin-left: 1.5rem" class="text-white">
        <ul>
          <li v-if="teacher">Ausfall: {{ teacher }}</li>
          <li v-if="room">Raum: {{ room }}</li>
          <li v-if="info">Info: {{ info }}</li>
        </ul>
      </ion-card-content>
    </div>
    <ion-ripple-effect></ion-ripple-effect>
  </ion-card>
</template>

<script lang="ts">
import {IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonBadge, IonRippleEffect} from '@ionic/vue';
import {defineComponent} from 'vue';
import {useStore} from 'vuex';

export default defineComponent({
  name: 'SubstitutionItem',
  props: {
    teacher: String,
    period: String,
    subTeacher: String,
    room: String,
    info: String,
    fullClass: String
  },
  components: {
    IonCard, IonCardHeader, IonCardContent, IonRippleEffect, IonCardSubtitle, IonBadge
  },
  setup() {
    const store = useStore();

    const myClass = store.getters.getClass;

    return {
      myClass
    };
  }
});
</script>

<style scoped>
.substitution_card {
  margin-top: 1rem;
  margin-bottom: 1rem;
}

li {
  list-style: disc;
}
</style>
