import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';

export class S3BucketStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucketName = new cdk.CfnParameter(this, "bucketName", {
      type: "String",
      description: "The name of the S3 bucket to create. Must be globally unique."});

    new s3.Bucket(this, 'cdk-test-bucket', {
      bucketName: bucketName.valueAsString,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.KMS_MANAGED
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: bucketName.valueAsString
    });

  }
}
