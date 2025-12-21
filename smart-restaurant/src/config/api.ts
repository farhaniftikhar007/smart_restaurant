// Get the API base URL dynamically
const getApiBaseUrl = (): string => {
  // If there's an environment variable, use it
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  
  // Otherwise, use the same host as the frontend but port 8000
  const hostname = window.location.hostname;
  return `http://${hostname}:8000`;
};

export const API_BASE_URL = getApiBaseUrl();
export const WS_BASE_URL = API_BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://');

console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔗 WebSocket Base URL:', WS_BASE_URL);
