const isProduction = import.meta.env.PROD;

const logger = {
  log: (...args) => {
    if (!isProduction) {
      console.log(...args);
    }
  },
  info: (...args) => {
    if (!isProduction) {
      console.info(...args);
    }
  },
  warn: (...args) => {
    if (!isProduction) {
      console.warn(...args);
    }
  },
  error: (...args) => {
    // In production, we might want to send this to an error reporting service
    console.error(...args);
  },
};

export default logger;
