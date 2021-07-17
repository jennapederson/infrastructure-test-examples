import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';

export class FullStackAppStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const keyPairName = new cdk.CfnParameter(this, "keyPairName", {
      type: "String",
      description: "The name of an existing Amazon EC2 key pair in this region to use to SSH into the Amazon EC2 instances."});

    const vpc = new ec2.Vpc(this, 'full-stack-app-vpc', {
      subnetConfiguration: [
        {
          name: 'full-stack-app-public-subnet',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: 'full-stack-app-isolated-subnet',
          subnetType: ec2.SubnetType.ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: ec2.AmazonLinuxCpuType.X86_64
    });

    const webAppSecurityGroup = new ec2.SecurityGroup(this, 'full-stack-app-web-security-group', {
      vpc,
      description: 'Allow HTTP/HTTPS and SSH inbound and outbound traffic',
      allowAllOutbound: true
    });
    webAppSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH Access');
    webAppSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP Access');
    webAppSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS Access')

    const webAppInstance = new ec2.Instance(this, 'full-stack-app-instance', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ami,
      securityGroup: webAppSecurityGroup,
      keyName: keyPairName.valueAsString
    });

    const eip = new ec2.CfnEIP(this, 'full-stack-app-eip', {
      instanceId: webAppInstance.instanceId,
    });
    cdk.Tags.of(eip).add('Name', 'full-stack-app-eip');

    const webAppDatabase = new rds.DatabaseInstance(this, 'full-stack-app-rds', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.ISOLATED,
      },
      instanceIdentifier: 'full-stack-app-rds',
      engine: rds.DatabaseInstanceEngine.postgres({
        version:rds.PostgresEngineVersion.VER_12_7,
      }),
      allocatedStorage: 5,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.SMALL),
    });
    cdk.Tags.of(webAppDatabase).add('Name', 'full-stack-app-rds');

    webAppDatabase.connections.allowFrom(webAppInstance, ec2.Port.tcp(5432));

    new cdk.CfnOutput(this, 'WebAppDatabaseEndpoint', {
      value: webAppDatabase.instanceEndpoint.hostname,
    });

    new cdk.CfnOutput(this, 'WebServerPublicDNS', {
      value: webAppInstance.instancePublicDnsName
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: `https://${eip.ref}`
    });

    new cdk.CfnOutput(this, 'InstanceId', {
      value: webAppInstance.instanceId
    });

    new cdk.CfnOutput(this, 'DbInstanceIdentifier', {
      value: webAppDatabase.instanceIdentifier
    });

    new cdk.CfnOutput(this, 'WebSecurityGroupId', {
      value: webAppSecurityGroup.securityGroupId
    });

    new cdk.CfnOutput(this, 'DbSecurityGroupId', {
      value: webAppDatabase.connections.securityGroups[0].securityGroupId
    });


  }
}
