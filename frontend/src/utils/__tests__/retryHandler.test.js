/**
 * Tests for Retry Handler
 * Verifies exponential backoff and rate limiting behavior
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { 
  retryWithBackoff, 
  fetchWithRetry, 
  isRateLimitError, 
  getRateLimitMessage,
  calculateDelay 
} from '../retryHandler';

describe('Retry Handler', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('calculateDelay', () => {
    it('should calculate exponential backoff correctly', () => {
      const delay0 = calculateDelay(0);
      const delay1 = calculateDelay(1);
      const delay2 = calculateDelay(2);

      // First attempt: ~1000ms
      expect(delay0).toBeGreaterThanOrEqual(900);
      expect(delay0).toBeLessThanOrEqual(1100);

      // Second attempt: ~2000ms
      expect(delay1).toBeGreaterThanOrEqual(1800);
      expect(delay1).toBeLessThanOrEqual(2200);

      // Third attempt: ~4000ms
      expect(delay2).toBeGreaterThanOrEqual(3600);
      expect(delay2).toBeLessThanOrEqual(4400);
    });

    it('should cap delay at maximum', () => {
      const delay = calculateDelay(10); // Very high attempt number
      expect(delay).toBeLessThanOrEqual(11000); // Max 10000ms + 10% jitter
    });
  });

  describe('isRateLimitError', () => {
    it('should detect 429 errors', () => {
      const error = new Error('HTTP error! status: 429');
      expect(isRateLimitError(error)).toBe(true);
    });

    it('should detect rate limit messages', () => {
      const error1 = new Error('Too many requests');
      const error2 = new Error('Rate limit exceeded');
      
      expect(isRateLimitError(error1)).toBe(true);
      expect(isRateLimitError(error2)).toBe(true);
    });

    it('should not detect non-rate-limit errors', () => {
      const error = new Error('Server error');
      expect(isRateLimitError(error)).toBe(false);
    });
  });

  describe('getRateLimitMessage', () => {
    it('should format seconds correctly', () => {
      expect(getRateLimitMessage(5000)).toContain('5 seconds');
      expect(getRateLimitMessage(1000)).toContain('1 second');
    });

    it('should format minutes correctly', () => {
      expect(getRateLimitMessage(120000)).toContain('2 minutes');
      expect(getRateLimitMessage(60000)).toContain('1 minute');
    });

    it('should handle no retry-after value', () => {
      const message = getRateLimitMessage(null);
      expect(message).toContain('Too many requests');
      expect(message).toContain('wait a moment');
    });
  });

  describe('retryWithBackoff', () => {
    it('should succeed on first attempt if response is ok', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ success: true })
      });

      const response = await retryWithBackoff(mockFetch);
      
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(response.ok).toBe(true);
    });

    it('should retry on 429 status', async () => {
      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          headers: new Map([['Retry-After', '1']]),
          json: async () => ({ message: 'Too many requests' })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true })
        });

      const promise = retryWithBackoff(mockFetch, { maxRetries: 1 });
      
      // Fast-forward time to trigger retry
      await vi.advanceTimersByTimeAsync(2000);
      
      const response = await promise;
      
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(response.ok).toBe(true);
    });

    it('should retry on 500 status', async () => {
      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Server error' })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true })
        });

      const promise = retryWithBackoff(mockFetch, { maxRetries: 1 });
      
      await vi.advanceTimersByTimeAsync(2000);
      
      const response = await promise;
      
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(response.ok).toBe(true);
    });

    it('should not retry on 404 status', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' })
      });

      const response = await retryWithBackoff(mockFetch, { maxRetries: 3 });
      
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(404);
    });

    it('should respect maxRetries limit', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        headers: new Map(),
        json: async () => ({ message: 'Too many requests' })
      });

      const promise = retryWithBackoff(mockFetch, { maxRetries: 2 });
      
      // Fast-forward through all retries
      await vi.advanceTimersByTimeAsync(10000);
      
      const response = await promise;
      
      // Initial attempt + 2 retries = 3 total calls
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(response.status).toBe(429);
    });

    it('should handle network errors with retry', async () => {
      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true })
        });

      const promise = retryWithBackoff(mockFetch, { maxRetries: 1 });
      
      await vi.advanceTimersByTimeAsync(2000);
      
      const response = await promise;
      
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(response.ok).toBe(true);
    });

    it('should respect Retry-After header', async () => {
      const mockFetch = vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          headers: new Map([['Retry-After', '5']]), // 5 seconds
          json: async () => ({ message: 'Too many requests' })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true })
        });

      const promise = retryWithBackoff(mockFetch, { maxRetries: 1 });
      
      // Should wait approximately 5 seconds (5000ms)
      await vi.advanceTimersByTimeAsync(5000);
      
      const response = await promise;
      
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(response.ok).toBe(true);
    });
  });

  describe('fetchWithRetry', () => {
    it('should wrap fetch with retry logic', async () => {
      globalThis.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 429,
          headers: new Map(),
          json: async () => ({ message: 'Too many requests' })
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ success: true })
        });

      const promise = fetchWithRetry('https://api.example.com/test', {}, { maxRetries: 1 });
      
      await vi.advanceTimersByTimeAsync(2000);
      
      const response = await promise;
      
      expect(globalThis.fetch).toHaveBeenCalledTimes(2);
      expect(response.ok).toBe(true);
    });
  });
});
