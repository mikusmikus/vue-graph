<template>
  <div class="flex items-center gap-4">
    <button
      @click="$emit('toggle-pause')"
      :class="[
        'px-4 py-2 rounded-md transition-colors',
        isPaused ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600',
      ]"
      class="text-white"
    >
      {{ isPaused ? 'Atsākt' : 'Pauzēt' }}
    </button>
    <div class="flex items-center gap-2">
      <label class="text-gray-700">Ātrums:</label>
      <select
        v-model="selectedInterval"
        class="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option :value="2000">Lēns</option>
        <option :value="1000">Normāls</option>
        <option :value="500">Ātrs</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SpeedControl',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    isPaused: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue', 'toggle-pause'],
  computed: {
    selectedInterval: {
      get() {
        return this.modelValue
      },
      set(value: number) {
        this.$emit('update:modelValue', value)
      },
    },
  },
})
</script>
