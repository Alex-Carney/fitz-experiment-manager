import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: parseInt(process.env.NEST_PORT, 10) || 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Fitz Experiment Manager',
    description: 'Manage ongoing experiments in FitzLab',
    version: '1.5',
    path: 'api',
  },
};

export default (): Config => config;
