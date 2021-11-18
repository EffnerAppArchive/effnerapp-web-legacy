<template>
  <div>
    <p>{{ title }}</p>
  </div>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'NewsCard',
  props: {
    id: Number,
    title: String
  }
});
</script>

<style scoped>

</style>
