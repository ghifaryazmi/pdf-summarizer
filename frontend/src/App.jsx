import { useState } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import SummaryStyleSelector from './components/SummaryStyleSelector'
import ProcessingStatus from './components/ProcessingStatus'
import SummaryDisplay from './components/SummaryDisplay'
import ErrorMessage from './components/ErrorMessage'
import { useSummarize } from './hooks/useSummarize'

function App() {
  const [file, setFile] = useState(null)
  const [summaryStyle, setSummaryStyle] = useState('executive')
  const { status, result, error, submit, reset } = useSummarize()

  const isProcessing = status !== 'idle' && status !== 'done' && status !== 'error'

  const handleSubmit = () => {
    if (file) {
      submit(file, summaryStyle)
    }
  }

  const handleReset = () => {
    setFile(null)
    setSummaryStyle('executive')
    reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col items-center justify-start pt-16 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 bg-clip-text text-transparent">
          PDF Summarizer
        </h1>
        <p className="mt-3 text-gray-500 text-lg">Transform your documents into concise insights</p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-2xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-purple-100/50 border border-white/60 p-8 space-y-6">
          <FileUpload
            onFileSelect={setFile}
            onSubmit={handleSubmit}
            disabled={isProcessing}
            selectedFile={file}
          />

          <SummaryStyleSelector
            value={summaryStyle}
            onChange={setSummaryStyle}
            disabled={isProcessing}
          />

          <ProcessingStatus
            status={status}
            visible={isProcessing}
          />

          <ErrorMessage
            message={error}
            onDismiss={handleReset}
          />
        </div>

        {/* Results Card */}
        {status === 'done' && (
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-purple-100/50 border border-white/60 p-8">
            <SummaryDisplay
              result={result}
              visible={status === 'done'}
            />

            <button
              onClick={handleReset}
              className="mt-6 w-full px-4 py-3 text-sm font-medium text-purple-600 bg-purple-50 rounded-xl
                hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-200"
            >
              Summarize Another Document
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-12 text-xs text-gray-400">Supports PDF and HTML files up to 20 MB</p>
    </div>
  )
}

export default App
