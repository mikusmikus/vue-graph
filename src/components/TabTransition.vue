<template>
  <div class="relative">
    <Transition
      mode="out-in"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div class="w-full">
        <slot></slot>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TabTransition',
})
</script>

<style scoped>
.relative {
  position: relative;
}

.transition-all {
  transition-property: all;
  will-change: transform, opacity;
}

/* Prevent content jumping */
.w-full {
  transform-origin: top;
  backface-visibility: hidden;
}
</style>
