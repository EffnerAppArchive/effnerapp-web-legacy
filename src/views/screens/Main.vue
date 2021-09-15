<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button class="ion-activatable ripple-parent" href="/main/home" tab="tab1">
          <ion-icon :icon="homeOutline"/>
          <ion-label>Home</ion-label>
          <ion-ripple-effect/>
        </ion-tab-button>

        <ion-tab-button class="ion-activatable ripple-parent" href="/main/substitutions" tab="tab2">
          <ion-icon :icon="listOutline"/>
          <ion-label>Vertretungen</ion-label>
          <ion-ripple-effect/>
        </ion-tab-button>

        <ion-tab-button class="ion-activatable ripple-parent" href="/main/exams" tab="tab3">
          <ion-icon :icon="schoolOutline"/>
          <ion-label>Schulaufgaben</ion-label>
          <ion-ripple-effect/>
        </ion-tab-button>

        <ion-tab-button class="ion-activatable ripple-parent" href="/main/settings" tab="tab4">
          <ion-icon :icon="settingsOutline"/>
          <ion-label>Einstellungen</ion-label>
          <ion-ripple-effect/>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import {
  IonIcon,
  IonLabel,
  IonPage,
  IonRippleEffect,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/vue';
import {homeOutline, listOutline, schoolOutline, settingsOutline} from 'ionicons/icons';
import {defineComponent} from 'vue';
import {loadData, refreshContentIfNeeded} from '@/tools/data';
import {App} from '@capacitor/app';

export default defineComponent({
  name: 'Main',
  components: {
    IonLabel,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage,
    IonRouterOutlet,
    IonRippleEffect
  },
  async setup() {

    await loadData();

    App.addListener('appStateChange', async ({isActive}) => {
      console.log('appStateChanged: isActive -> ' + isActive);

      if (isActive) {
        await refreshContentIfNeeded();
      }
    });

    return {
      homeOutline, listOutline, schoolOutline, settingsOutline
    };
  }
});
</script>
