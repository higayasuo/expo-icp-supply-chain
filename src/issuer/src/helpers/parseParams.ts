type ParsedParamsResult = {
  deepLink: string;
};

export const parseParams = (): ParsedParamsResult => {
  const searchParams = new URLSearchParams(window.location.search);
  const deepLink = searchParams.get('deep-link');

  if (!deepLink) {
    throw new Error('Deep link is required');
  }

  return { deepLink };
};
