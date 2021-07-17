import { expect as expectCDK, countResources, haveResource } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as s3BucketStack from '../lib/s3-bucket-stack';

test('stack creates an S3 bucket with server-side encryption enabled', () => {
  const app = new cdk.App();

  const stack = new s3BucketStack.S3BucketStack(app, 'S3BucketStack');

  expectCDK(stack).to(haveResource('AWS::S3::Bucket', {
    BucketName: "cdk-test-bucket-jenna",
    BucketEncryption: {
      ServerSideEncryptionConfiguration: [
        {
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: "aws:kms"
          }
        }
      ]
    },
  }));

  expectCDK(stack).to(countResources('AWS::S3::Bucket', 1));
});