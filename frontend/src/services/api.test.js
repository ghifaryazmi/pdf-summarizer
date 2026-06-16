import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { summarizePdf } from './api';

vi.mock('axios');

describe('summarizePdf', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sends a POST request to /api/summarize with correct form data', async () => {
    const mockResponse = {
      data: { summary: 'Test summary', page_count: 3, original_length: 5000 },
    };
    axios.post.mockResolvedValue(mockResponse);

    const file = new File(['fake pdf content'], 'test.pdf', { type: 'application/pdf' });
    const result = await summarizePdf(file, 'standard', undefined);

    expect(axios.post).toHaveBeenCalledTimes(1);
    const [url, formData, config] = axios.post.mock.calls[0];

    expect(url).toBe('http://localhost:5000/api/summarize');
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get('file')).toBe(file);
    expect(formData.get('length')).toBe('standard');
    expect(result).toEqual(mockResponse.data);
  });

  it('sets timeout to 120000ms', async () => {
    axios.post.mockResolvedValue({ data: {} });

    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
    await summarizePdf(file, 'brief', undefined);

    const config = axios.post.mock.calls[0][2];
    expect(config.timeout).toBe(120000);
  });

  it('sets Content-Type header to multipart/form-data', async () => {
    axios.post.mockResolvedValue({ data: {} });

    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
    await summarizePdf(file, 'detailed', undefined);

    const config = axios.post.mock.calls[0][2];
    expect(config.headers['Content-Type']).toBe('multipart/form-data');
  });

  it('passes onUploadProgress callback to axios config', async () => {
    axios.post.mockResolvedValue({ data: {} });

    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
    const progressCallback = vi.fn();
    await summarizePdf(file, 'standard', progressCallback);

    const config = axios.post.mock.calls[0][2];
    expect(config.onUploadProgress).toBe(progressCallback);
  });

  it('includes the length option in form data', async () => {
    axios.post.mockResolvedValue({ data: {} });

    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });

    await summarizePdf(file, 'brief', undefined);
    expect(axios.post.mock.calls[0][1].get('length')).toBe('brief');

    await summarizePdf(file, 'detailed', undefined);
    expect(axios.post.mock.calls[1][1].get('length')).toBe('detailed');
  });

  it('returns response.data from the axios response', async () => {
    const expectedData = { summary: 'A summary', page_count: 5, original_length: 10000 };
    axios.post.mockResolvedValue({ data: expectedData });

    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
    const result = await summarizePdf(file, 'standard', undefined);

    expect(result).toEqual(expectedData);
  });

  it('propagates errors from axios', async () => {
    const error = new Error('Network Error');
    axios.post.mockRejectedValue(error);

    const file = new File(['content'], 'doc.pdf', { type: 'application/pdf' });

    await expect(summarizePdf(file, 'standard', undefined)).rejects.toThrow('Network Error');
  });
});
