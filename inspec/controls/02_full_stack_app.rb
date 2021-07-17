title "Verify full stack webapp"

control "02-full-stack" do
  impact 1.0
  title "Verify full stack webapp"

  json = inspec.profile.file('outputs.json')
  outputs = JSON.parse(json)

  INSTANCE_ID = outputs['FullStackAppStack']['InstanceId']
  WEB_SECURITY_GROUP_ID = outputs['FullStackAppStack']['WebSecurityGroupId']
  DB_INSTANCE_IDENTIFIER = outputs['FullStackAppStack']['DbInstanceIdentifier']
  DB_SECURITY_GROUP_ID = outputs['FullStackAppStack']['DbSecurityGroupId']

  describe aws_ec2_instance(INSTANCE_ID) do
    it { should be_running }
    its('instance_type') { should eq 't2.micro' }
    its('image_id') { should eq 'ami-0dc2d3e4c0f9ebd18' }
  end

  describe aws_security_group(group_id: WEB_SECURITY_GROUP_ID) do
    it { should exist }
    it { should allow_in(port: 80, protocol: 'tcp') }
    it { should allow_in(port: 443, protocol: 'tcp') }
    it { should allow_in(port: 22, protocol: 'tcp') }
    it { should allow_out(ipv4_range: '0.0.0.0/0') }
  end

  describe aws_security_group(group_id: DB_SECURITY_GROUP_ID) do
    it { should exist }
    it { should allow_in(port: 5432, protocol: 'tcp') }
  end

  describe aws_rds_instance(db_instance_identifier: DB_INSTANCE_IDENTIFIER) do
    its('engine') { should eq 'postgres' }
    its('engine_version') { should eq '12.7' }
    its('db_instance_class') { should eq 'db.t2.small' }
  end

end