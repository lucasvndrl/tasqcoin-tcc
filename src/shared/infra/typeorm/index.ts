import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();
  const getHost = () => {
    const node_env = process.env.NODE_ENV;
    if (node_env === 'dev') return 'database';
    if ('host' in defaultOptions) return defaultOptions.host;
    return undefined;
  };

  return createConnection(
    Object.assign(defaultOptions, {
      database:
        process.env.NODE_ENV === 'test'
          ? 'tasqcoin_test'
          : defaultOptions.database,
      host: getHost(),
    })
  );
};
