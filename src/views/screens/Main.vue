<template>
  <ion-page>
    <ion-tabs v-if="renderComponent" @ionTabsDidChange="onTabChange">
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button href="/main/home" tab="tab1">
          <ion-icon :icon="currentTab === 'tab1' ? home : homeOutline"/>
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button href="/main/substitutions" tab="tab2">
          <ion-icon :icon="currentTab === 'tab2' ? shuffle : shuffleOutline"/>
          <ion-label>Vertretungen</ion-label>
        </ion-tab-button>

        <ion-tab-button href="/main/exams" tab="tab3">
          <ion-icon :icon="currentTab === 'tab3' ? school : schoolOutline"/>
          <ion-label>Schulaufgaben</ion-label>
        </ion-tab-button>

        <ion-tab-button href="/main/settings" tab="tab4">
          <ion-icon :icon="currentTab === 'tab4' ? settings : settingsOutline"/>
          <ion-label>Einstellungen</ion-label>
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
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs
} from '@ionic/vue';
import {home, homeOutline, school, schoolOutline, settings, settingsOutline, shuffle, shuffleOutline} from 'ionicons/icons';
import {defineComponent} from 'vue';
import {loadData, refreshContentIfNeeded} from '@/tools/data';
import {App} from '@capacitor/app';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';

export default defineComponent({
  name: 'Main',
  components: {IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet},
  async setup() {
    const router = useRouter();
    const store = useStore();

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
      home,
      homeOutline,
      shuffle,
      shuffleOutline,
      school,
      schoolOutline,
      settings,
      settingsOutline,
      store
    };
  },
  methods: {
    onTabChange(e: any) {
      this.store.commit('setRoute', e.tab);
    }
  },
  computed: {
    currentTab(): string {
      return this.store.getters.getRoute;
    }
  },
  watch: {
    $route(to, from) {
      if (from.name === 'Login' && to.fullPath.startsWith('/main')) {
        console.log('Reattached to main component, reloading data ...');
        loadData().then(() => {
          this.renderComponent = true;
        }).catch(() => {
          this.router.push({name: 'Login'});
        });
      }
    }
  }
});
</script>

<style scoped>

body.dark ion-tab-button {
  --color-selected: white;
}

</style>
