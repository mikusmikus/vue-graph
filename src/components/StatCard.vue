<template>
  <Motion
    :initial="{ opacity: 0, scale: 0.95 }"
    :animate="{ opacity: 1, scale: 1 }"
    :transition="{ duration: 0.3 }"
    :class="[
      'bg-gray-50 rounded-lg p-4 transition-colors duration-300',
      { 'bg-orange-50': isWarning },
    ]"
  >
    <h4 class="text-sm text-gray-600">{{ title }}</h4>
    <div :class="['text-2xl font-bold my-2', isWarning ? 'text-red-500' : 'text-gray-800']">
      <AnimatedNumber :value="currentValue" />
    </div>
    <div class="text-xs text-gray-500">Vidēji: <AnimatedNumber :value="averageValue" /></div>
  </Motion>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AnimatedNumber from './AnimatedNumber.vue'
import { Motion } from '@oku-ui/motion'

export default defineComponent({
  name: 'StatCard',
  components: {
    AnimatedNumber,
    Motion,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    currentValue: {
      type: String,
      required: true,
    },
    averageValue: {
      type: String,
      required: true,
    },
    isWarning: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
