<template>
  <div class="mb-6">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('update:modelValue', tab.id)"
          :class="[
            modelValue === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
          ]"
        >
          {{ tab.name }}
        </button>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export interface Tab {
  id: string
  name: string
}

export default defineComponent({
  name: 'TabNavigation',
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    tabs: {
      type: Array as () => Tab[],
      required: true,
    },
  },
  emits: ['update:modelValue'],
})
</script>
