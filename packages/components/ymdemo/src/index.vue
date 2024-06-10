<template>
  <div class="ymdemo">
    <slot>Ymdemo</slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { YmdemoProps } from './Ymdemo'
export default defineComponent({
  name: "ymdemo",
  props: YmdemoProps,
  setup() {
    return {
    };
  },
})
</script>

