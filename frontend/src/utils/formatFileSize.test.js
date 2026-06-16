import { describe, it, expect } from 'vitest';
import { formatFileSize } from './formatFileSize';

describe('formatFileSize', () => {
  it('returns size in KB for files under 1 MB', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(500000)).toBe('488 KB');
  });

  it('rounds small byte values to nearest KB', () => {
    expect(formatFileSize(512)).toBe('1 KB');
    expect(formatFileSize(1025)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('2 KB');
  });

  it('returns size in MB with one decimal place for files 1 MB and above', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(1572864)).toBe('1.5 MB');
    expect(formatFileSize(20971520)).toBe('20.0 MB');
  });

  it('handles the boundary at exactly 1 MB', () => {
    // 1 MB = 1048576 bytes, should display as MB
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    // Just below 1 MB should display as KB
    expect(formatFileSize(1048575)).toBe('1024 KB');
  });

  it('handles zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 KB');
  });
});
