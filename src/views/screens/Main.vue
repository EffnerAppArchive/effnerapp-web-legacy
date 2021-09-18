<template>
  <ion-page>
    <ion-tabs v-if="renderComponent">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/main/home" class="ion-activatable ripple-parent">
          <ion-icon :icon="homeOutline"/>
          <ion-label>Home</ion-label>
          <ion-ripple-effect/>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/main/substitutions" class="ion-activatable ripple-parent">
          <ion-icon :icon="listOutline"/>
          <ion-label>Vertretungen</ion-label>
          <ion-ripple-effect/>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/main/exams" class="ion-activatable ripple-parent">
          <ion-icon :icon="schoolOutline"/>
          <ion-label>Schulaufgaben</ion-label>
          <ion-ripple-effect/>
        </ion-tab-button>

        <ion-tab-button href="/main/settings" tab="tab4" class="ion-activatable ripple-parent">
          <ion-icon :icon="settingsOutline"/>
          <ion-label>Einstellungen</ion-label>
          <ion-ripple-effect/>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
    <div v-else>
      Loading ...
    </div>
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
import {useRouter} from 'vue-router';

export default defineComponent({
  name: 'Main',
  components: {IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet, IonRippleEffect},
  async setup() {
    const router = useRouter();

    let renderComponent = false;

    try {
      await loadData();

      App.addListener('appStateChange', async ({isActive}) => {
        console.log('appStateChanged: isActive -> ' + isActive);

        if (isActive) {
          await refreshContentIfNeeded();
        }
      });
      renderComponent = true;
    } catch (e) {
      console.log('Error while loading data, pushing to login ...');
      await router.push({name: 'Login'});
    }

    return {
      router,
      renderComponent,
      homeOutline,
      listOutline,
      schoolOutline,
      settingsOutline
    };

  },
  watch: {
    $route(to, from) {
      if (from.name === 'Login' && to.fullPath.startsWith('/main')) {
        console.log('Reattached to main component, reloading data ...');
        loadData()
            .then(() => {
              this.renderComponent = true;
            })
            .catch(() => {
          this.router.push({name: 'Login'});
        });
      }
    }
  }
});
</script>
