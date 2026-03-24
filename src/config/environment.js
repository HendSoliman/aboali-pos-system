const env = {
  API_BASE_URL:  process.env.REACT_APP_API_BASE_URL  || 'http://localhost:8000/api',
  API_TIMEOUT:   parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
  IS_DEV:        process.env.NODE_ENV === 'development',
  IS_PROD:       process.env.NODE_ENV === 'production',
};

export default env;
