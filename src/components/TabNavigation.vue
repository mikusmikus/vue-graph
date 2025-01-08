<template>
  <div class="mb-6 border-b border-gray-200">
    <nav class="flex overflow-x-auto hide-scrollbar" aria-label="Tabs">
      <div class="flex min-w-full sm:min-w-0">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="$emit('update:modelValue', tab.id)"
          class="relative min-w-0 flex-shrink-0 px-6 py-4 text-sm font-medium"
          :class="[modelValue === tab.id ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700']"
        >
          <span class="relative z-10">{{ tab.name }}</span>
          <div
            class="absolute bottom-0 left-0 right-0 h-0.5 transition-transform duration-300 ease-out"
            :class="modelValue === tab.id ? 'bg-blue-500' : 'bg-transparent'"
            :style="{
              transform: `scaleX(${modelValue === tab.id ? 1 : 0})`,
              opacity: modelValue === tab.id ? 1 : 0,
              transformOrigin: 'center',
            }"
          />
          <div
            class="absolute inset-0 transition-colors duration-200"
            :class="modelValue === tab.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'"
          />
        </button>
      </div>
    </nav>
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

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

button {
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}

button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

/* Smooth hover effect */
button::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: currentColor;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

button:hover::before {
  opacity: 0.05;
}
</style>
