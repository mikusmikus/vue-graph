<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="container-custom">
      <h1 class="mb-6">Reālā laika datu vizualizācija</h1>

      <TabNavigation
        v-model="activeTab"
        :tabs="[
          { id: 'overview', name: 'Pārskats' },
          { id: 'cpu', name: 'CPU Analīze' },
          { id: 'memory', name: 'Atmiņas Analīze' },
          { id: 'network', name: 'Tīkla Analīze' },
        ]"
      />

      <SpeedControl
        v-model="updateInterval"
        :is-paused="isPaused"
        @toggle-pause="togglePause"
        class="mb-6"
      />

      <!-- Overview Tab -->
      <TabTransition>
        <div v-show="activeTab === 'overview'" key="overview" class="tab-content">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <ChartCard
              title="CPU Noslodze"
              description="Procesora noslodzes līmenis procentos"
              :chart-data="chartData"
              :options="chartOptions"
              :current-value="currentValue"
              :average-value="averageValue"
              :is-warning="Number(currentValue) > 70"
            />
            <ChartCard
              title="RAM Izmantošana"
              description="Operatīvās atmiņas izmantošanas līmenis"
              :chart-data="memoryChartData"
              :options="chartOptions"
              :current-value="currentMemoryValue"
              :average-value="averageMemoryValue"
              :is-warning="Number(currentMemoryValue) > 70"
            />
            <ChartCard
              title="Tīkla Aktivitāte"
              description="Tīkla noslodzes līmenis"
              :chart-data="networkChartData"
              :options="chartOptions"
              :current-value="currentNetworkValue"
              :average-value="averageNetworkValue"
              :is-warning="Number(currentNetworkValue) > 70"
            />
          </div>

          <div class="stats-grid">
            <StatCard v-for="stat in overviewStats" :key="stat.title" v-bind="stat" />
          </div>
        </div>
      </TabTransition>

      <!-- CPU Tab -->
      <TabTransition>
        <div v-show="activeTab === 'cpu'" key="cpu" class="tab-content">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="CPU Noslodze (Reālā laikā)"
              description="Detalizēta procesora noslodzes analīze"
              :chart-data="cpuDetailedChartData"
              :options="detailedChartOptions"
              :current-value="currentValue"
              :average-value="averageValue"
              :is-warning="Number(currentValue) > 70"
            />
            <ChartCard
              title="CPU Tendences"
              description="CPU noslodzes izmaiņu tendences"
              :chart-data="cpuTrendData"
              :options="detailedChartOptions"
              :current-value="currentValue"
              :average-value="averageValue"
              :is-warning="Number(currentValue) > 70"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard v-for="stat in cpuStats" :key="stat.title" v-bind="stat" />
          </div>
        </div>
      </TabTransition>

      <!-- Memory Tab -->
      <TabTransition>
        <div v-show="activeTab === 'memory'" key="memory" class="tab-content">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="RAM Izmantošana (Reālā laikā)"
              description="Detalizēta atmiņas izmantošanas analīze"
              :chart-data="memoryDetailedChartData"
              :options="detailedChartOptions"
              :current-value="currentMemoryValue"
              :average-value="averageMemoryValue"
              :is-warning="Number(currentMemoryValue) > 70"
            />
            <ChartCard
              title="Atmiņas Tendences"
              description="RAM izmantošanas izmaiņu tendences"
              :chart-data="memoryTrendData"
              :options="detailedChartOptions"
              :current-value="currentMemoryValue"
              :average-value="averageMemoryValue"
              :is-warning="Number(currentMemoryValue) > 70"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard v-for="stat in memoryStats" :key="stat.title" v-bind="stat" />
          </div>
        </div>
      </TabTransition>

      <!-- Network Tab -->
      <TabTransition>
        <div v-show="activeTab === 'network'" key="network" class="tab-content">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Tīkla Aktivitāte (Reālā laikā)"
              description="Detalizēta tīkla aktivitātes analīze"
              :chart-data="networkDetailedChartData"
              :options="detailedChartOptions"
              :current-value="currentNetworkValue"
              :average-value="averageNetworkValue"
              :is-warning="Number(currentNetworkValue) > 70"
            />
            <ChartCard
              title="Tīkla Tendences"
              description="Tīkla noslodzes izmaiņu tendences"
              :chart-data="networkTrendData"
              :options="detailedChartOptions"
              :current-value="currentNetworkValue"
              :average-value="averageNetworkValue"
              :is-warning="Number(currentNetworkValue) > 70"
            />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard v-for="stat in networkStats" :key="stat.title" v-bind="stat" />
          </div>
        </div>
      </TabTransition>
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
import TabNavigation from './components/TabNavigation.vue'
import TabTransition from './components/TabTransition.vue'

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
    TabNavigation,
    TabTransition,
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
      activeTab: 'overview',
      cpuDetailedChartData: {
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
      memoryDetailedChartData: {
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
      networkDetailedChartData: {
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
      cpuTrendData: {
        labels: [],
        datasets: [
          {
            label: 'CPU Tendence',
            data: [],
            borderColor: '#2196f3',
            backgroundColor: 'rgba(33, 150, 243, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      memoryTrendData: {
        labels: [],
        datasets: [
          {
            label: 'RAM Tendence',
            data: [],
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      networkTrendData: {
        labels: [],
        datasets: [
          {
            label: 'Tīkla Tendence',
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
    detailedChartOptions() {
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
    overviewStats() {
      return [
        {
          title: 'CPU Noslodze',
          currentValue: this.currentValue,
          averageValue: this.averageValue,
          isWarning: Number(this.currentValue) > 70,
        },
        {
          title: 'RAM Izmantošana',
          currentValue: this.currentMemoryValue,
          averageValue: this.averageMemoryValue,
          isWarning: Number(this.currentMemoryValue) > 70,
        },
        {
          title: 'Tīkla Noslodze',
          currentValue: this.currentNetworkValue,
          averageValue: this.averageNetworkValue,
          isWarning: Number(this.currentNetworkValue) > 70,
        },
      ]
    },
    cpuStats() {
      return [
        {
          title: 'Pašreizējā Noslodze',
          currentValue: this.currentValue,
          averageValue: this.averageValue,
          isWarning: Number(this.currentValue) > 70,
        },
        {
          title: 'Maksimālā Noslodze',
          currentValue: Math.max(...this.dataPoints.map((p) => p.value)).toFixed(1),
          averageValue: this.averageValue,
          isWarning: false,
        },
        {
          title: 'Minimālā Noslodze',
          currentValue: Math.min(...this.dataPoints.map((p) => p.value)).toFixed(1),
          averageValue: this.averageValue,
          isWarning: false,
        },
        {
          title: 'Vidējā Noslodze',
          currentValue: this.averageValue,
          averageValue: this.averageValue,
          isWarning: Number(this.averageValue) > 70,
        },
      ]
    },
    memoryStats() {
      return [
        {
          title: 'Pašreizējā Izmantošana',
          currentValue: this.currentMemoryValue,
          averageValue: this.averageMemoryValue,
          isWarning: Number(this.currentMemoryValue) > 70,
        },
        {
          title: 'Maksimālā Izmantošana',
          currentValue: Math.max(...this.memoryDataPoints.map((p) => p.value)).toFixed(1),
          averageValue: this.averageMemoryValue,
          isWarning: false,
        },
        {
          title: 'Minimālā Izmantošana',
          currentValue: Math.min(...this.memoryDataPoints.map((p) => p.value)).toFixed(1),
          averageValue: this.averageMemoryValue,
          isWarning: false,
        },
        {
          title: 'Vidējā Izmantošana',
          currentValue: this.averageMemoryValue,
          averageValue: this.averageMemoryValue,
          isWarning: Number(this.averageMemoryValue) > 70,
        },
      ]
    },
    networkStats() {
      return [
        {
          title: 'Pašreizējā Aktivitāte',
          currentValue: this.currentNetworkValue,
          averageValue: this.averageNetworkValue,
          isWarning: Number(this.currentNetworkValue) > 70,
        },
        {
          title: 'Maksimālā Aktivitāte',
          currentValue: Math.max(...this.networkDataPoints.map((p) => p.value)).toFixed(1),
          averageValue: this.averageNetworkValue,
          isWarning: false,
        },
        {
          title: 'Minimālā Aktivitāte',
          currentValue: Math.min(...this.networkDataPoints.map((p) => p.value)).toFixed(1),
          averageValue: this.averageNetworkValue,
          isWarning: false,
        },
        {
          title: 'Vidējā Aktivitāte',
          currentValue: this.averageNetworkValue,
          averageValue: this.averageNetworkValue,
          isWarning: Number(this.averageNetworkValue) > 70,
        },
      ]
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

      // Update main charts
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

      // Update detailed charts
      this.cpuDetailedChartData = {
        labels: timeLabels,
        datasets: [
          { ...this.chartData.datasets[0], data: this.dataPoints.map((point) => point.value) },
        ],
      }

      this.memoryDetailedChartData = {
        labels: timeLabels,
        datasets: [
          {
            ...this.memoryChartData.datasets[0],
            data: this.memoryDataPoints.map((point) => point.value),
          },
        ],
      }

      this.networkDetailedChartData = {
        labels: timeLabels,
        datasets: [
          {
            ...this.networkChartData.datasets[0],
            data: this.networkDataPoints.map((point) => point.value),
          },
        ],
      }

      // Update trend data
      this.cpuTrendData = {
        labels: timeLabels,
        datasets: [
          { ...this.chartData.datasets[0], data: this.dataPoints.map((point) => point.value) },
        ],
      }

      this.memoryTrendData = {
        labels: timeLabels,
        datasets: [
          {
            ...this.memoryChartData.datasets[0],
            data: this.memoryDataPoints.map((point) => point.value),
          },
        ],
      }

      this.networkTrendData = {
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

<style>
.tab-content {
  min-height: 400px; /* Adjust based on your content */
  width: 100%;
}

/* Container for all tab contents */
.container-custom {
  position: relative;
  overflow-x: hidden; /* Prevent horizontal scrolling during transitions */
}

/* Ensure charts maintain size during transition */
.chart-wrapper {
  height: 100%;
  transition: all 0.3s ease;
}

/* Prevent layout shifts for stats grid */
.stats-grid {
  min-height: 100px; /* Adjust based on your content */
}
</style>
