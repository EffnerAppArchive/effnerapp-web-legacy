<template>
  <ion-grid>
    <ion-row class="center">
      <ion-col size="2" sizeMd="2" sizeXs="2">
        <div class="center">
          <ion-badge :style="`padding: 0.5rem; min-width: 2rem; --background:var(${color});`">
            <span class="center">{{ line }}</span>
          </ion-badge>
        </div>
      </ion-col>
      <ion-col size="6">
        <ion-label class="ellipsis">{{ direction }}</ion-label>
      </ion-col>
      <ion-col class="ion-text-end" style="padding-right: 1rem">
        <span :style="'color: var(' + (inTime ? '--ion-color-success' : '--ion-color-danger') + ')'">{{ time }}</span>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
<script lang="ts">
import {IonBadge, IonCol, IonGrid, IonLabel, IonRow} from '@ionic/vue';
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'DepartureItem',
  props: {
    line: String,
    direction: String,
    time: String,
    inTime: Boolean
  },
  components: {
    IonGrid, IonRow, IonCol, IonBadge, IonLabel
  },
  setup(props) {
    let color;

    if (props.line) {
      if (props.line.startsWith('S')) {
        color = '--ion-color-mvv-badge-train';
      } else if (props.line.startsWith('RB')) {
        color = '--ion-color-mvv-badge-regio';
      } else {
        color = '--ion-color-mvv-badge-bus';
      }
    }

    return {
      color
    };
  }
});
</script>

<style scoped>
ion-grid {
  height: 100%;
}

.center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
