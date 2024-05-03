<template>
  <div class="library-rollup-template">
    设个是demo组件
    <slot />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { selectProps } from './select'
export default defineComponent({
  name: "lm-select",
  props: selectProps,
  setup() {
    return {
      info: {
      	name: '设个是demo组件'
      }
    };
  },
})
</script>
