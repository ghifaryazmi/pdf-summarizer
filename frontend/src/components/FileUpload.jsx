import { useRef } from 'react'
import { formatFileSize } from '../utils/formatFileSize'

function FileUpload({ onFileSelect, onSubmit, disabled, selectedFile }) {
  const inputRef = useRef(null)

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all duration-200
          ${disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
            : 'border-purple-200 bg-purple-50/30 cursor-pointer hover:border-purple-400 hover:bg-purple-50/60'
          }`}
      >
        <svg className="w-10 h-10 text-purple-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>

        {selectedFile ? (
          <div className="text-center">
            <p className="text-sm font-medium text-purple-700">{selectedFile.name}</p>
            <p className="text-xs text-purple-500 mt-1">{formatFileSize(selectedFile.size)}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600">Drop your file here or <span className="text-purple-600 font-medium">browse</span></p>
            <p className="text-xs text-gray-400 mt-1">PDF or HTML files</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.html,.htm"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />
      </div>

      {/* Submit button */}
      <button
        onClick={onSubmit}
        disabled={disabled || !selectedFile}
        className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-xl
          hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-300
          disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-purple-200/50"
      >
        Summarize
      </button>
    </div>
  )
}

export default FileUpload
