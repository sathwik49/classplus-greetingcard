const getEnv = (key: string, defaultValue?: any) => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue) {
      return defaultValue;
    }
    throw new Error(`Env var for ${key} is not available`);
  }
  return value;
};

export default getEnv;
