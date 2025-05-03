import { renderError } from './helpers/renderError';
import { formatError } from './helpers/formatError';
import { ERROR_MESSAGES } from './constants';
import { getAuthenticateForm } from './helpers/getAuthenticateForm';
import { getUserId } from './helpers/getUserId';
import { parseParams } from './helpers/parseParams';
const main = async (): Promise<void> => {
  try {
    const { deepLink } = parseParams();
    const form = getAuthenticateForm();
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const userId = getUserId();
      window.open(`${deepLink}#user-id=${userId}`, '_self');
    });
  } catch (error) {
    renderError(formatError(ERROR_MESSAGES.INITIALIZATION, error));
  }
};

window.addEventListener('DOMContentLoaded', () => {
  main();
});
