/**
 * Get userId from the form input
 * @returns userId string
 * @throws Error if userId input element is not found
 */
export function getUserId(): string {
  const userIdInput = document.getElementById('userId') as HTMLInputElement;
  if (!userIdInput) {
    throw new Error('userId input element not found');
  }
  return userIdInput.value.trim();
}
