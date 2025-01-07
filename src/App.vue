<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="container-custom">
      <h1 class="mb-6">Reālā laika datu vizualizācija</h1>

      <SpeedControl
        v-model="updateInterval"
        :is-paused="isPaused"
        @toggle-pause="togglePause"
        class="mb-6"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div class="chart-wrapper">
          <ChartCard title="CPU Noslodze" :chart-data="chartData" :options="chartOptions" />
        </div>
        <div class="chart-wrapper">
          <ChartCard
            title="RAM Izmantošana"
            :chart-data="memoryChartData"
            :options="memoryChartOptions"
          />
        </div>
        <div class="chart-wrapper">
          <ChartCard
            title="Tīkla Aktivitāte"
            :chart-data="networkChartData"
            :options="networkChartOptions"
          />
        </div>
      </div>

      <div class="stats-grid">
        <StatCard
          title="CPU Noslodze"
          :current-value="currentValue"
          :average-value="averageValue"
          :is-warning="Number(currentValue) > 70"
        />
        <StatCard
          title="RAM Izmantošana"
          :current-value="currentMemoryValue"
          :average-value="averageMemoryValue"
          :is-warning="Number(currentMemoryValue) > 70"
        />
        <StatCard
          title="Tīkla Noslodze"
          :current-value="currentNetworkValue"
          :average-value="averageNetworkValue"
          :is-warning="Number(currentNetworkValue) > 70"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import ChartCard from './components/ChartCard.vue'
import StatCard from './components/StatCard.vue'
import SpeedControl from './components/SpeedControl.vue'
import { createChartOptions, generateMockValue } from './utils/chartHelpers'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface DataPoint {
  value: number
  timestamp: string
}

export default defineComponent({
  name: 'App',
  components: {
    ChartCard,
    StatCard,
    SpeedControl,
  },
  data() {
    return {
      dataPoints: [] as DataPoint[],
      memoryDataPoints: [] as DataPoint[],
      networkDataPoints: [] as DataPoint[],
      lastValue: null as number | null,
      lastMemoryValue: null as number | null,
      lastNetworkValue: null as number | null,
      interval: null as number | null,
      isPaused: false,
      updateInterval: 1000,
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'CPU Noslodze (%)',
            data: [],
            borderColor: '#2196f3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      memoryChartData: {
        labels: [],
        datasets: [
          {
            label: 'RAM Izmantošana (%)',
            data: [],
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      networkChartData: {
        labels: [],
        datasets: [
          {
            label: 'Tīkla Noslodze (%)',
            data: [],
            borderColor: '#9c27b0',
            backgroundColor: 'rgba(156, 39, 176, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
    }
  },
  computed: {
    chartOptions() {
      return createChartOptions()
    },
    memoryChartOptions() {
      return createChartOptions()
    },
    networkChartOptions() {
      return createChartOptions()
    },
    currentValue(): string {
      if (!this.dataPoints.length) return '0'
      return this.dataPoints[this.dataPoints.length - 1].value.toFixed(1)
    },
    averageValue(): string {
      if (!this.dataPoints.length) return '0'
      const sum = this.dataPoints.reduce((acc, point) => acc + point.value, 0)
      return (sum / this.dataPoints.length).toFixed(1)
    },
    currentMemoryValue(): string {
      if (!this.memoryDataPoints.length) return '0'
      return this.memoryDataPoints[this.memoryDataPoints.length - 1].value.toFixed(1)
    },
    averageMemoryValue(): string {
      if (!this.memoryDataPoints.length) return '0'
      const sum = this.memoryDataPoints.reduce((acc, point) => acc + point.value, 0)
      return (sum / this.memoryDataPoints.length).toFixed(1)
    },
    currentNetworkValue(): string {
      if (!this.networkDataPoints.length) return '0'
      return this.networkDataPoints[this.networkDataPoints.length - 1].value.toFixed(1)
    },
    averageNetworkValue(): string {
      if (!this.networkDataPoints.length) return '0'
      const sum = this.networkDataPoints.reduce((acc, point) => acc + point.value, 0)
      return (sum / this.networkDataPoints.length).toFixed(1)
    },
  },
  watch: {
    updateInterval() {
      this.restartInterval()
    },
  },
  mounted() {
    this.startGeneratingData()
  },
  methods: {
    togglePause(): void {
      this.isPaused = !this.isPaused
      if (this.isPaused) {
        if (this.interval) clearInterval(this.interval)
      } else {
        this.startGeneratingData()
      }
    },
    restartInterval(): void {
      if (this.interval) clearInterval(this.interval)
      if (!this.isPaused) {
        this.startGeneratingData()
      }
    },
    startGeneratingData(): void {
      this.addNewDataPoint()
      this.interval = window.setInterval(() => {
        this.addNewDataPoint()
      }, this.updateInterval)
    },
    addNewDataPoint(): void {
      const timestamp = new Date().toISOString()

      // CPU data (high volatility)
      const newValue = generateMockValue(this.lastValue, 5)
      this.lastValue = newValue
      this.dataPoints.push({ value: newValue, timestamp })

      // Memory data (medium volatility)
      const newMemoryValue = generateMockValue(this.lastMemoryValue, 3)
      this.lastMemoryValue = newMemoryValue
      this.memoryDataPoints.push({ value: newMemoryValue, timestamp })

      // Network data (highest volatility)
      const newNetworkValue = generateMockValue(this.lastNetworkValue, 8)
      this.lastNetworkValue = newNetworkValue
      this.networkDataPoints.push({ value: newNetworkValue, timestamp })

      // Maintain data points limit
      if (this.dataPoints.length > 15) this.dataPoints.shift()
      if (this.memoryDataPoints.length > 15) this.memoryDataPoints.shift()
      if (this.networkDataPoints.length > 15) this.networkDataPoints.shift()

      this.updateChartData()
    },
    updateChartData(): void {
      const timeLabels = this.dataPoints.map((point) => {
        const date = new Date(point.timestamp)
        return date.toLocaleTimeString('lv-LV', { second: '2-digit' })
      })

      this.chartData = {
        labels: timeLabels,
        datasets: [
          { ...this.chartData.datasets[0], data: this.dataPoints.map((point) => point.value) },
        ],
      }

      this.memoryChartData = {
        labels: timeLabels,
        datasets: [
          {
            ...this.memoryChartData.datasets[0],
            data: this.memoryDataPoints.map((point) => point.value),
          },
        ],
      }

      this.networkChartData = {
        labels: timeLabels,
        datasets: [
          {
            ...this.networkChartData.datasets[0],
            data: this.networkDataPoints.map((point) => point.value),
          },
        ],
      }
    },
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
})
</script>
