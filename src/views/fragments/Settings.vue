<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>


  </ion-page>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {IonHeader, IonPage, IonTitle, IonToolbar} from '@ionic/vue';

export default defineComponent({
  name: "Settings",
  components: {IonPage, IonHeader, IonToolbar, IonTitle}
});
</script>

<style scoped>

</style>
