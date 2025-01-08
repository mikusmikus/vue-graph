<template>
  <div class="bg-white rounded-lg p-4 shadow-md">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-700">{{ title }}</h3>
        <p class="text-sm text-gray-500">{{ description }}</p>
      </div>
      <div class="text-right flex flex-col">
        <div class="text-2xl font-bold" :class="{ 'text-red-500': isWarning }">
          <AnimatedNumber :value="currentValue" />
        </div>
        <div class="text-sm text-gray-500 flex items-center justify-end gap-1">
          <span class="inline-flex items-center"> Max: <AnimatedNumber :value="maxValue" /> </span>
          <span class="opacity-50">|</span>
          <span class="inline-flex items-center"> Min: <AnimatedNumber :value="minValue" /> </span>
        </div>
      </div>
    </div>

    <div class="h-[300px]">
      <LineChart
        v-if="chartData.datasets[0].data.length > 0"
        :data="chartData"
        :options="options"
      />
    </div>

    <div class="mt-4 grid grid-cols-3 gap-4 text-sm">
      <div class="p-2 bg-gray-50 rounded">
        <div class="text-gray-500">Vidēji</div>
        <div class="font-semibold flex items-center">
          <AnimatedNumber :value="averageValue" />
        </div>
      </div>
      <div class="p-2 bg-gray-50 rounded">
        <div class="text-gray-500">Tendence</div>
        <div class="font-semibold" :class="trendClass">{{ trend }}</div>
      </div>
      <div class="p-2 bg-gray-50 rounded">
        <div class="text-gray-500">Atjaunots</div>
        <div class="font-semibold">{{ lastUpdate }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import { Line as LineChart } from 'vue-chartjs'
import type { ChartData, ChartOptions } from 'chart.js'
import AnimatedNumber from './AnimatedNumber.vue'

export default defineComponent({
  name: 'ChartCard',
  components: {
    LineChart,
    AnimatedNumber,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    chartData: {
      type: Object as PropType<ChartData<'line', number[], unknown>>,
      required: true,
    },
    options: {
      type: Object as PropType<ChartOptions<'line'>>,
      required: true,
    },
    currentValue: {
      type: [String, Number],
      required: true,
    },
    averageValue: {
      type: [String, Number],
      required: true,
    },
    isWarning: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const maxValue = computed(() => {
      const data = props.chartData.datasets[0].data as number[]
      return Math.max(...data).toFixed(1)
    })

    const minValue = computed(() => {
      const data = props.chartData.datasets[0].data as number[]
      return Math.min(...data).toFixed(1)
    })

    const trend = computed(() => {
      const data = props.chartData.datasets[0].data as number[]
      if (data.length < 2) return '―'
      const last = data[data.length - 1]
      const prev = data[data.length - 2]
      const diff = (((last - prev) / prev) * 100).toFixed(1)
      return diff > 0 ? `+${diff}%` : `${diff}%`
    })

    const trendClass = computed(() => {
      if (trend.value === '―') return 'text-gray-500'
      return parseFloat(trend.value) > 0 ? 'text-green-500' : 'text-red-500'
    })

    const lastUpdate = computed(() => {
      const labels = props.chartData.labels as string[]
      return labels[labels.length - 1] || '―'
    })

    return {
      maxValue,
      minValue,
      trend,
      trendClass,
      lastUpdate,
    }
  },
})
</script>
