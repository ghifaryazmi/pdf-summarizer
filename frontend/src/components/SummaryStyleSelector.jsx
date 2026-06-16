const OPTIONS = [
  { value: 'executive', label: 'Executive Summary', icon: '📋' },
  { value: 'student', label: 'Student Notes', icon: '📝' },
  { value: 'action_items', label: 'Action Items', icon: '✅' },
]

function SummaryStyleSelector({ value, onChange, disabled }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-600 mb-3">
        Summary Style
      </label>
      <div className="grid grid-cols-3 gap-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all duration-200
              ${value === option.value
                ? 'border-purple-400 bg-purple-50 shadow-sm'
                : 'border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50/30'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="text-xl">{option.icon}</span>
            <span className={`text-xs font-medium ${value === option.value ? 'text-purple-700' : 'text-gray-600'}`}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SummaryStyleSelector
