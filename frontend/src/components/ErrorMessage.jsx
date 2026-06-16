function ErrorMessage({ message, onDismiss }) {
  if (!message) return null

  return (
    <div
      className="w-full p-4 bg-red-50/80 border border-red-100 rounded-xl flex items-center gap-3"
      role="alert"
    >
      <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-red-100">
        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd" />
        </svg>
      </div>
      <p className="text-sm text-red-600 flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600 transition-colors"
        aria-label="Dismiss error"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}

export default ErrorMessage
