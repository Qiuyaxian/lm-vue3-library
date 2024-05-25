<template>
  <div class="ymdemo">
    Ymdemo
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { YmdemoProps } from './Ymdemo.ts'
export default defineComponent({
  name: "ymdemo",
  props: YmdemoProps,
  setup() {
    return {
    };
  },
})
</script>

