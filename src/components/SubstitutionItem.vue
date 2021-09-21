<template>
  <ion-card class="substitution_card ion-activatable ripple-parent">
    <div v-if="teacher === 'info'">
      <ion-card-header>
        <ion-card-subtitle style="color: #69e369">Allgemeine Infos</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content class="text_dark" style="margin-left: 0.5rem">
        {{ info }}
      </ion-card-content>
    </div>
    <div v-else-if="absentClasses">
      <ion-card-header>
        <ion-card-subtitle style="color: #e85b5b">Abwesende Klassen</ion-card-subtitle>
      </ion-card-header>
      <ion-card-content class="text_dark" style="margin-left: 1.5rem">
        <ul>
          <li v-for="c in absentClasses" :key="c">
            {{ c }}
          </li>
        </ul>
      </ion-card-content>
    </div>
    <div v-else>
      <ion-card-header>
        <ion-card-subtitle color="dark">
          {{ period }}. Stunde
          {{ (info === 'entfällt' || info === 'Bibliotheksarbeit' ? info : 'vertreten durch ' + subTeacher) }}
          <ion-badge v-if="fullClass !== myClass"
                     class="inline" style="margin-left: 0.3rem; padding: 0.3rem; min-width: 2rem; background: #e85b5b">
            {{ fullClass }}
          </ion-badge>
        </ion-card-subtitle>
      </ion-card-header>
      <ion-card-content class="text_dark" style="margin-left: 1.5rem">
        <ul>
          <li v-if="teacher">Ausfall: {{ teacher }}</li>
          <li v-if="room">Raum: {{ room }}</li>
          <li v-if="info">Info: {{ info }}</li>
        </ul>
      </ion-card-content>
    </div>
  </ion-card>
</template>

<script lang="ts">
import {IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle} from '@ionic/vue';
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
    fullClass: String,
    absentClasses: Array
  },
  components: {
    IonCard, IonCardHeader, IonCardContent, IonCardSubtitle, IonBadge
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

.text_dark {
  color: var(--ion-text-color)
}
</style>
