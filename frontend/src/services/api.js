import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || ''

/**
 * Sends a PDF file to the backend for summarization.
 * @param {File} file - The PDF file to summarize
 * @param {string} styleOption - Summary style: 'executive', 'student', or 'action_items'
 * @param {function} onUploadProgress - Axios progress callback
 * @returns {Promise<{summary: string, page_count: number, original_length: number}>}
 */
export async function summarizePdf(file, styleOption, onUploadProgress) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('style', styleOption)

  const response = await axios.post(`${API_BASE}/api/summarize`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
    onUploadProgress,
  })

  return response.data
}
