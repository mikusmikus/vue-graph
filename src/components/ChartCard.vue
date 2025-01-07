<template>
  <div class="bg-white rounded-lg p-4 shadow-md">
    <h3 class="text-lg font-semibold text-gray-700 mb-4">{{ title }}</h3>
    <div class="h-[300px]">
      <LineChart
        v-if="chartData.datasets[0].data.length > 0"
        :data="chartData"
        :options="options"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'

export default defineComponent({
  name: 'ChartCard',
  components: {
    LineChart,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    chartData: {
      type: Object as PropType<ChartData<'line', number[], unknown>>,
      required: true,
    },
    options: {
      type: Object as PropType<ChartOptions<'line'>>,
      required: true,
    },
  },
})
</script>
