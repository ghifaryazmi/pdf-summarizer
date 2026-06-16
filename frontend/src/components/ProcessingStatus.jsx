const STAGE_LABELS = {
  uploading: 'Uploading your document...',
  extracting: 'Extracting text content...',
  summarizing: 'Generating summary...',
}

function ProcessingStatus({ status, visible }) {
  if (!visible) return null

  const label = STAGE_LABELS[status] || 'Processing...'

  return (
    <div className="flex flex-col items-center gap-4 py-6" role="status" aria-live="polite">
      {/* Animated gradient spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-purple-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-pink-500 animate-spin"></div>
      </div>
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
  )
}

export default ProcessingStatus
