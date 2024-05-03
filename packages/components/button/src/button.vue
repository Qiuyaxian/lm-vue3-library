<template>
  <button class="lm-button" @click="handlerClick">Primary</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { buttonProps } from "./button";
export default defineComponent({
  name: "lm-button",
  props: buttonProps,
  components: {
  },
  setup() {
    const handlerClick = () => {
      alert("WQ!!!!!!");
    };

    return {
      handlerClick,
    };
  },
});
</script>
