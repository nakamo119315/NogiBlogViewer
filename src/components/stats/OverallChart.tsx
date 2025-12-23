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

interface OverallChartProps {
  data: MonthlyCount[]
  title?: string
}

export function OverallChart({ data, title = '月別投稿数' }: OverallChartProps) {
  // Show last 12 entries
  const displayData = data.slice(-12)

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
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 11,
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
      <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-md dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">データがありません</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          全メンバー合計
        </p>
      </div>
      <div className="p-4">
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}
