const webCaptureFlag =
  typeof window !== 'undefined' &&
  typeof window.location?.search === 'string' &&
  new URLSearchParams(window.location.search).get('capture') === '1';

export const STORE_CAPTURE_MODE =
  process.env.EXPO_PUBLIC_STORE_CAPTURE === 'true' || webCaptureFlag;
