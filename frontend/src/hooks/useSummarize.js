import { useState } from 'react'
import { summarizePdf } from '../services/api'

/**
 * Custom hook managing the summarization workflow state.
 * Handles file upload, status transitions, result/error state.
 */
export function useSummarize() {
  const [state, setState] = useState({
    file: null,
    summaryStyle: 'executive',
    status: 'idle',
    result: null,
    error: null,
  })

  const submit = async (file, styleOption) => {
    setState(prev => ({ ...prev, status: 'uploading', error: null, result: null }))
    try {
      const result = await summarizePdf(file, styleOption, (progressEvent) => {
        if (progressEvent.loaded === progressEvent.total) {
          setState(prev => ({ ...prev, status: 'extracting' }))
          setTimeout(() => setState(prev => {
            if (prev.status === 'extracting') return { ...prev, status: 'summarizing' }
            return prev
          }), 3000)
        }
      })
      setState(prev => ({ ...prev, status: 'done', result }))
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Network error. Please try again.'
      setState(prev => ({ ...prev, status: 'error', error: errorMsg }))
    }
  }

  const reset = () => setState({
    file: null,
    summaryStyle: 'executive',
    status: 'idle',
    result: null,
    error: null,
  })

  return { ...state, submit, reset }
}
