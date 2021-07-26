title "Verify S3 Buckets"

control "01-s3-bucket" do
  impact 1.0
  title "Verify S3 Bucket is Private"

  json = inspec.profile.file('outputs.json')
  outputs = JSON.parse(json)

  BUCKET_NAME = outputs['FullStackAppStack']['BucketName']

  describe aws_s3_bucket(BUCKET_NAME) do
    it { should exist }
    it { should_not be_public }
    its('bucket_policy') { should be_empty }
    its('bucket_acl.count') { should eq 1 }
    it { should have_default_encryption_enabled }
  end

end