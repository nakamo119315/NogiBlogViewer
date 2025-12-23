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
import type { MemberStatistics } from '../../hooks/useAllMembersStatistics'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface MemberPostsChartProps {
  members: MemberStatistics[]
  maxBars?: number
}

export function MemberPostsChart({ members, maxBars = 15 }: MemberPostsChartProps) {
  // Sort by total posts and take top N
  const sortedMembers = [...members]
    .sort((a, b) => b.totalPosts - a.totalPosts)
    .slice(0, maxBars)

  const chartData = {
    labels: sortedMembers.map((m) => m.memberName),
    datasets: [
      {
        label: '投稿数',
        data: sortedMembers.map((m) => m.totalPosts),
        backgroundColor: 'rgba(130, 100, 180, 0.7)',
        borderColor: 'rgba(130, 100, 180, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.x
            return value !== null ? `${value}件` : ''
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  }

  if (sortedMembers.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg bg-white shadow-md dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">データがありません</p>
      </div>
    )
  }

  const chartHeight = Math.max(300, sortedMembers.length * 32)

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          メンバー別投稿数
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          上位{maxBars}名
        </p>
      </div>
      <div className="p-4">
        <div style={{ height: chartHeight }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}
