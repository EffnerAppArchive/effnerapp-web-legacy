<template>
  <ion-grid>
    <ion-row>
      <ion-col size="2" sizeMd="1">
        <ion-badge :style="`color: white; padding: 0.5rem;--background:var(${color});`">{{ line }}</ion-badge>
      </ion-col>
      <ion-col size="5">
        <span class="ellipsis" style="color: white">{{ direction }}</span>
      </ion-col>
      <ion-col class="ion-text-end">
        <span style="color: var(--ion-color-success)">{{ time }}</span>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
<script lang="ts">
import {IonGrid, IonRow, IonCol, IonBadge} from "@ionic/vue";
import {defineComponent} from "vue";

export default defineComponent({
  name: "DepartureItem",
  props: {
    line: String,
    direction: String,
    time: String
  },
  components: {
    IonGrid, IonRow, IonCol, IonBadge
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
    }
  }
})
</script>

<style scoped>
.departure_item {
  --ion-item-background: transparent;
}

ion-grid {
  height: 100%;
}

ion-row {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
