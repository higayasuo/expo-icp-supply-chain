/**
 * Get the authenticate form element
 * @returns HTMLFormElement
 * @throws Error if authenticate form element is not found
 */
export function getAuthenticateForm(): HTMLFormElement {
  const form = document.getElementById('authenticate-form') as HTMLFormElement;
  if (!form) {
    throw new Error('authenticate form element not found');
  }
  return form;
}
