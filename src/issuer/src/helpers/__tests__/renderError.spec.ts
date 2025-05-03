import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderError } from '../renderError';

describe('renderError', () => {
  beforeEach(() => {
    // Setup error element
    document.body.innerHTML = `
      <p id="error"></p>
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should display error message when provided', () => {
    const message = 'Test error message';
    renderError(message);

    const errorElement = document.querySelector(
      '#error',
    ) as HTMLParagraphElement;
    expect(errorElement.textContent).toBe(message);
    expect(errorElement.style.display).toBe('block');
  });

  it('should hide error element when empty message is provided', () => {
    renderError('');

    const errorElement = document.querySelector(
      '#error',
    ) as HTMLParagraphElement;
    expect(errorElement.textContent).toBe('');
    expect(errorElement.style.display).toBe('none');
  });

  it('should log error when error element is not found', () => {
    document.body.innerHTML = ''; // Remove error element
    const consoleSpy = vi.spyOn(console, 'error');

    renderError('Test message');

    expect(consoleSpy).toHaveBeenCalledWith('Error element not found');
  });
});
