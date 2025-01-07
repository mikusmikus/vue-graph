import type { ChartOptions } from 'chart.js'

export const generateMockValue = (previousValue: number | null, volatility = 5): number => {
  const MIN_VALUE = 20
  const MAX_VALUE = 80
  const MAX_CHANGE = volatility

  if (previousValue === null) {
    return Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE) + MIN_VALUE)
  }

  const targetValue = (MAX_VALUE + MIN_VALUE) / 2
  const tendency = (targetValue - previousValue) * 0.1
  const randomChange = (Math.random() - 0.5) * MAX_CHANGE
  const newValue = previousValue + tendency + randomChange

  return Math.min(Math.max(newValue, MIN_VALUE), MAX_VALUE)
}

export const createChartOptions = (): ChartOptions<'line'> => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 300,
    easing: 'easeInOutQuart',
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        stepSize: 20,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      animation: {
        duration: 200,
      },
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
})
