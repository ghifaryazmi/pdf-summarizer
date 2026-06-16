import { useState } from 'react'

function SummaryDisplay({ result, visible }) {
  const [copyFeedback, setCopyFeedback] = useState(null)

  if (!visible || !result) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.summary)
      setCopyFeedback('Copied!')
      setTimeout(() => setCopyFeedback(null), 3000)
    } catch {
      setCopyFeedback('Failed to copy')
      setTimeout(() => setCopyFeedback(null), 3000)
    }
  }

  const handleDownload = () => {
    const now = new Date()
    const timestamp = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') + '_' +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0')
    const filename = `summary_${timestamp}.txt`

    const blob = new Blob([result.summary], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full">
      {/* Metadata pills */}
      <div className="flex gap-2 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600">
          {result.page_count} page{result.page_count !== 1 ? 's' : ''}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-50 text-pink-600">
          {result.original_length.toLocaleString()} chars
        </span>
      </div>

      {/* Summary text */}
      <div
        className="w-full min-w-[300px] max-h-80 overflow-y-auto p-5 bg-gray-50/50 border border-gray-100 rounded-xl"
        style={{ whiteSpace: 'pre-wrap' }}
      >
        <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg
            hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </button>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-pink-600 bg-pink-50 rounded-lg
            hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
        {copyFeedback && (
          <span className="text-xs font-medium text-green-500 animate-pulse">{copyFeedback}</span>
        )}
      </div>
    </div>
  )
}

export default SummaryDisplay
