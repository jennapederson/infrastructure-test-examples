#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { FullStackAppStack } from '../lib/full-stack-app-stack';
import { S3BucketStack } from '../lib/s3-bucket-stack';

const app = new cdk.App();
new FullStackAppStack(app, 'FullStackAppStack');
new S3BucketStack(app, 'S3BucketStack');
