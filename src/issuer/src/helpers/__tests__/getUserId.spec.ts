import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getUserId } from '../getUserId';

describe('getUserId', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="userId" value="test-user" />
    `;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return userId when input exists', () => {
    const result = getUserId();
    expect(result).toBe('test-user');
  });

  it('should throw error when input does not exist', () => {
    document.body.innerHTML = '';
    expect(() => getUserId()).toThrow('userId input element not found');
  });

  it('should trim whitespace from userId', () => {
    const input = document.getElementById('userId') as HTMLInputElement;
    input.value = '  test-user  ';
    const result = getUserId();
    expect(result).toBe('test-user');
  });
});
