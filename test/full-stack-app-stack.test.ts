import { expect as expectCDK, countResources, haveResource, haveOutput } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as fullStackAppStack from '../lib/full-stack-app-stack';

test('stack creates an EC2 instance with elastic IP', () => {
  const app = new cdk.App();

  const stack = new fullStackAppStack.FullStackAppStack(app, 'FullStackAppStack');

  expectCDK(stack).to(haveResource('AWS::EC2::Instance', {
    KeyName: {
      "Ref": "keyPairName"
    },
    InstanceType: "t2.micro"
  }));

  expectCDK(stack).to(haveResource('AWS::EC2::EIP', {
    Tags: [
      {
        "Key": "Name",
        "Value": "full-stack-app-eip"
      }
    ]
  }));

});

test('stack creates an RDS instance', () => {
  const app = new cdk.App();

  const stack = new fullStackAppStack.FullStackAppStack(app, 'FullStackAppStack');

  expectCDK(stack).to(haveResource('AWS::RDS::DBInstance', {
    DBInstanceClass: "db.t2.small",
    Engine: "postgres",
    EngineVersion: "12.7",
    Tags: [
      {
        "Key": "Name",
        "Value": "full-stack-app-rds"
      }
    ]
  }));
});

test('stack outputs WebAppDatabaseEndpoint', () => {
  const app = new cdk.App();

  const stack = new fullStackAppStack.FullStackAppStack(app, 'FullStackAppStack');

  expectCDK(stack).to(haveOutput({
    outputName: "WebAppDatabaseEndpoint",
    outputValue: {
      "Fn::GetAtt": [
        "fullstackapprdsFBF09CFA",
        "Endpoint.Address"
      ]
    },
  }));
});

test('stack outputs WebServerPublicDNS', () => {
  const app = new cdk.App();

  const stack = new fullStackAppStack.FullStackAppStack(app, 'FullStackAppStack');

  expectCDK(stack).to(haveOutput({
    outputName: "WebServerPublicDNS",
    outputValue: {
      "Fn::GetAtt": [
        "fullstackappinstanceEF5DDB6A",
        "PublicDnsName"
      ]
    },
  }));
});

test('stack outputs WebsiteURL', () => {
  const app = new cdk.App();

  const stack = new fullStackAppStack.FullStackAppStack(app, 'FullStackAppStack');

  expectCDK(stack).to(haveOutput({
    outputName: "WebsiteURL",
    outputValue: {
      "Fn::Join": [
        "",
        [
          "https://",
          {
            "Ref": "fullstackappeip"
          }
        ]
      ]
    },
  }));

});

test('stack outputs InstanceId', () => {
  const app = new cdk.App();

  const stack = new fullStackAppStack.FullStackAppStack(app, 'FullStackAppStack');

  expectCDK(stack).to(haveOutput({
    outputName: "InstanceId",
    outputValue: {
      "Ref": "fullstackappinstanceEF5DDB6A"
    },
  }));
});

test('stack outputs WebSecurityGroupId', () => {
  const app = new cdk.App();

  const stack = new fullStackAppStack.FullStackAppStack(app, 'FullStackAppStack');

  expectCDK(stack).to(haveOutput({
    outputName: "WebSecurityGroupId",
    outputValue: {
      "Fn::GetAtt": [
        "fullstackappwebsecuritygroup8D23C35D",
        "GroupId"
      ]
    },
  }));
});

test('stack outputs DbInstanceIdentifier', () => {
  const app = new cdk.App();

  const stack = new fullStackAppStack.FullStackAppStack(app, 'FullStackAppStack');

  expectCDK(stack).to(haveOutput({
    outputName: "DbInstanceIdentifier",
    outputValue: {
      "Ref": "fullstackapprdsFBF09CFA"
    },
  }));
});

test('stack outputs DbSecurityGroupId', () => {
  const app = new cdk.App();

  const stack = new fullStackAppStack.FullStackAppStack(app, 'FullStackAppStack');

  expectCDK(stack).to(haveOutput({
    outputName: "DbSecurityGroupId",
    outputValue: {
      "Fn::GetAtt": [
        "fullstackapprdsSecurityGroup50856175",
        "GroupId"
      ]
    },
  }));
});