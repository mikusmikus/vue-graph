<template>
  <div class="relative min-h-[400px]">
    <Motion
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -20 }"
      :transition="{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }"
    >
      <slot></slot>
    </Motion>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Motion } from '@oku-ui/motion'

export default defineComponent({
  name: 'TabTransition',
  components: {
    Motion,
  },
})
</script>

<style scoped>
.relative {
  position: relative;
  min-height: 400px;
}
</style>
