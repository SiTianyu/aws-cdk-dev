#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { DevCdkStack } = require('../lib/dev-cdk-stack');

const app = new cdk.App();
new DevCdkStack(app, 'DevCdkStack');
