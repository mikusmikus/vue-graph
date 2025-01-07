<template>
  <div
    :class="[
      'bg-gray-50 rounded-lg p-4 transition-all duration-300',
      { 'bg-orange-50': isWarning },
    ]"
  >
    <h4 class="text-sm text-gray-600">{{ title }}</h4>
    <div
      :class="[
        'text-2xl font-bold my-2',
        isWarning ? 'text-red-500 animate-pulse' : 'text-gray-800',
      ]"
    >
      {{ currentValue }}%
    </div>
    <div class="text-xs text-gray-500">Vidēji: {{ averageValue }}%</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StatCard',
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
