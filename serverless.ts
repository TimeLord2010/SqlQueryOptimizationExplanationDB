import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import {getDatabaseMetaData} from '@functions/index'

const serverlessConfiguration: AWS = {
  service: 'pb-p2-get-database-info',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    versionFunctions: false,
    stage: 'prod',
    memorySize: 512,
    profile: 'vini',
    timeout: 10,
    region: 'sa-east-1',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      'db_url': '${env:pd-p2-aws-rds-url}',
      'db_user': '${env:pd-p2-aws-rds-user}',
      'db_password': '${env:pd-p2-aws-rds-password}'
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { hello, getDatabaseMetaData },
};

module.exports = serverlessConfiguration;
