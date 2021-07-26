# Infrastructure Test Examples

This repository contains examples for testing your infrastructure code written with the AWS CDK. Unit tests are written with the [Jest testing framework](https://jestjs.io/). Integration tests are written with the [InSpec testing and auditing framework](https://docs.chef.io/inspec/).

## Getting Started

1. Install the AWS CDK  
`npm install -g aws-cdk`  
You can find more CDK setup details [here](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html). The examples in this project are written with Typescript.
1. Install InSpec using [these instructions](https://docs.chef.io/inspec/install/#install-chef-inspec).
1. Install dependencies  
`npm install`
1. Run unit tests  
`npm run build && npm run test`
1. Setup your AWS credentials for InSpec  
Following the instructions here, you can use environment variables or a profile in `~/.aws/credentials`.
1. Synthesize
`cdk synth`
1. Deploy your changes  
`cdk deploy --all --parameters FullStackAppStack:keyPairName=<your key pair name> --parameters S3BucketStack:bucketName=<your bucket name> --outputs-file inspec/outputs.json`
1. Run InSpec tests  
`inspec exec inspec -t aws://`  
If you get an error about the lockfile, delete `inspec/inspec.lock` and rerun the command.

## Other useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk destroy`     destroys the stack and all associated resources
 * `inspec exec inspec -t aws://` runs the inspec integration tests for the inspec test profile
