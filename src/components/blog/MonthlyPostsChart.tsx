import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import type { MonthlyCount } from '../../hooks/useBlogStatistics'
import { formatMonthDisplay } from '../../utils/date'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface MonthlyPostsChartProps {
  data: MonthlyCount[]
  maxBars?: number
}

export function MonthlyPostsChart({
  data,
  maxBars = 12,
}: MonthlyPostsChartProps) {
  // Get the last N months of data
  const displayData = data.slice(-maxBars)

  const chartData = {
    labels: displayData.map((item) => formatMonthDisplay(item.month)),
    datasets: [
      {
        label: '投稿数',
        data: displayData.map((item) => item.count),
        backgroundColor: 'rgba(130, 100, 180, 0.7)',
        borderColor: 'rgba(130, 100, 180, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y
            return value !== null ? `${value}件` : ''
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 10,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }

  if (displayData.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-gray-500 dark:text-gray-400">
        データがありません
      </div>
    )
  }

  return (
    <div className="h-48">
      <Bar data={chartData} options={options} />
    </div>
  )
}
