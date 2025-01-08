<template>
  <motion
    :initial="{ opacity: 0, y: 20 }"
    :animate="{ opacity: 1, y: 0 }"
    :exit="{ opacity: 0, y: -20 }"
    :transition="{
      duration: 0.3,
      ease: 'easeInOut',
    }"
  >
    <slot></slot>
  </motion>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { motion } from 'framer-motion-vue'

export default defineComponent({
  name: 'MotionTransition',
  components: {
    motion,
  },
})
</script>
