<template>
  <span class="inline-flex items-baseline font-mono">
    <TransitionGroup name="number">
      <span
        v-for="(digit, index) in formattedValue"
        :key="`${index}-${digit}`"
        class="inline-block select-none"
      >
        {{ digit }}
      </span>
    </TransitionGroup>
    <span class="ml-1 text-[0.8em] opacity-80 select-none">%</span>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'AnimatedNumber',
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
  },
  setup(props) {
    const formattedValue = computed(() => {
      return Number(props.value).toFixed(1)
    })

    return {
      formattedValue,
    }
  },
})
</script>

<style scoped>
.number-move,
.number-enter-active,
.number-leave-active {
  transition: all 0.3s ease;
}

.number-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.number-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.number-leave-active {
  position: absolute;
}

/* Prevent text selection */
.select-none {
  user-select: none;
  -webkit-user-select: none;
}
</style>
