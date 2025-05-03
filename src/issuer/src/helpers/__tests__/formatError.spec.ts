import { describe, it, expect } from 'vitest';
import { formatError } from '../formatError';

describe('formatError', () => {
  it('should format Error object with prefix', () => {
    const error = new Error('Test error message');
    const result = formatError('Test', error);
    expect(result).toBe('Example VC Issuer Test: Test error message');
  });

  it('should format string error with prefix', () => {
    const error = 'Test error message';
    const result = formatError('Test', error);
    expect(result).toBe('Example VC Issuer Test: Test error message');
  });

  it('should format number error with prefix', () => {
    const error = 404;
    const result = formatError('Test', error);
    expect(result).toBe('Example VC Issuer Test: 404');
  });

  it('should format null error with prefix', () => {
    const error = null;
    const result = formatError('Test', error);
    expect(result).toBe('Example VC Issuer Test: null');
  });

  it('should format undefined error with prefix', () => {
    const error = undefined;
    const result = formatError('Test', error);
    expect(result).toBe('Example VC Issuer Test: undefined');
  });
});
