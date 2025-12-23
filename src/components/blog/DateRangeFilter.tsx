import DatePicker, { registerLocale } from 'react-datepicker'
import { ja } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

// Register Japanese locale
registerLocale('ja', ja)

interface DateRangeFilterProps {
  fromDate: Date | null
  toDate: Date | null
  onFromDateChange: (date: Date | null) => void
  onToDateChange: (date: Date | null) => void
  onClear: () => void
  isFiltered: boolean
}

export function DateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onClear,
  isFiltered,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
      <div className="flex items-center gap-2">
        <svg
          className="h-5 w-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          期間で絞り込み
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <DatePicker
            selected={fromDate}
            onChange={onFromDateChange}
            selectsStart
            startDate={fromDate ?? undefined}
            endDate={toDate ?? undefined}
            maxDate={toDate ?? new Date()}
            placeholderText="開始日"
            locale="ja"
            dateFormat="yyyy/MM/dd"
            isClearable
            className="w-32 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-nogi-500 focus:outline-none focus:ring-1 focus:ring-nogi-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-nogi-400"
          />
        </div>

        <span className="text-gray-500 dark:text-gray-400">〜</span>

        <div className="relative">
          <DatePicker
            selected={toDate}
            onChange={onToDateChange}
            selectsEnd
            startDate={fromDate ?? undefined}
            endDate={toDate ?? undefined}
            minDate={fromDate ?? undefined}
            maxDate={new Date()}
            placeholderText="終了日"
            locale="ja"
            dateFormat="yyyy/MM/dd"
            isClearable
            className="w-32 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-nogi-500 focus:outline-none focus:ring-1 focus:ring-nogi-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-nogi-400"
          />
        </div>

        {isFiltered && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            クリア
          </button>
        )}
      </div>
    </div>
  )
}
