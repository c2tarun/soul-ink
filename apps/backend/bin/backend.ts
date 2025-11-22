#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack';
import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// Backend stack - Dev environment
new BackendStack(app, 'SoulInkBackendDevStack', {
  environment: 'dev',
  env,
  description: 'Dev backend infrastructure for Soul Ink notes app',
});

// Frontend stack - Dev environment
new FrontendStack(app, 'SoulInkDevStack', {
  environment: 'dev',
  env,
  description: 'Dev frontend hosting for Soul Ink notes app',
});

// Frontend stack - Prod environment (commented out for now)
// new FrontendStack(app, 'SoulInkProdStack', {
//   environment: 'prod',
//   env,
//   description: 'Production frontend hosting for Soul Ink notes app',
// });

app.synth();
