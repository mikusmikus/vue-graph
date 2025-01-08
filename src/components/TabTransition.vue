<template>
  <div class="relative min-h-[400px]">
    <TransitionGroup
      tag="div"
      :enter-active-class="'transition-all duration-300 ease-out'"
      :enter-from-class="'opacity-0 translate-y-4'"
      :enter-to-class="'opacity-100 translate-y-0'"
      :leave-active-class="'transition-all duration-200 ease-in'"
      :leave-from-class="'opacity-100 translate-y-0'"
      :leave-to-class="'opacity-0 -translate-y-4'"
    >
      <slot></slot>
    </TransitionGroup>
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
  min-height: 400px;
}
</style>
