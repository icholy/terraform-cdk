// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import { Testing, TerraformStack } from "../lib";
import * as b from "../lib/backends";

test("local backend", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  const localBackend = new b.LocalBackend(stack, {
    path: "relative/path/to/terraform.tfstate",
    workspaceDir: "unused",
  });
  localBackend.addOverride("workspace_dir", "local_workspace");

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("remote backend single ws", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.RemoteBackend(stack, {
    hostname: "app.terraform.io",
    organization: "company",

    workspaces: {
      name: "my-app-prod",
    },
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("remote backend multi ws", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.RemoteBackend(stack, {
    hostname: "app.terraform.io",
    organization: "company",
    token: "aToken",

    workspaces: new b.PrefixedRemoteWorkspaces("my-app-"),
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("azurerm backend cli/sp", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.AzurermBackend(stack, {
    resourceGroupName: "StorageAccount-ResourceGroup",
    storageAccountName: "abcd1234",
    containerName: "tfstate",
    key: "prod.terraform.tfstate",
    clientId: "ARM_CLIENT_ID",
    clientSecret: "ARM_CLIENT_SECRET",
    endpoint: "ARM_ENDPOINT",
    environment: "public",
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("azurerm backend msi", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.AzurermBackend(stack, {
    storageAccountName: "abcd1234",
    containerName: "tfstate",
    key: "prod.terraform.tfstate",
    useMsi: true,
    subscriptionId: "00000000-0000-0000-0000-000000000000",
    tenantId: "00000000-0000-0000-0000-000000000000",
    msiEndpoint: "ARM_MSI_ENDPOINT",
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("azurerm backend access key", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.AzurermBackend(stack, {
    storageAccountName: "abcd1234",
    containerName: "tfstate",
    key: "prod.terraform.tfstate",
    accessKey: "abcdefghijklmnopqrstuvwxyz0123456789...",
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("azurerm backend sas", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.AzurermBackend(stack, {
    storageAccountName: "abcd1234",
    containerName: "tfstate",
    key: "prod.terraform.tfstate",
    sasToken: "abcdefghijklmnopqrstuvwxyz0123456789...",
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("consul backend", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.ConsulBackend(stack, {
    address: "demo.consul.io",
    scheme: "https",
    path: "full/path",
    accessToken: "CONSUL_HTTP_TOKEN",
    caFile: "CONSUL_CACERT",
    certFile: "CONSUL_CLIENT_CERT",
    datacenter: "agent",
    gzip: true,
    httpAuth: "CONSUL_HTTP_AUTH",
    keyFile: "CONSUL_CLIENT_KEY",
    lock: true,
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("cos backend", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.CosBackend(stack, {
    region: "ap-guangzhou",
    bucket: "bucket-for-terraform-state-1258798060",
    prefix: "terraform/state",
    secretId: "TENCENTCLOUD_SECRET_ID",
    secretKey: "TENCENTCLOUD_SECRET_KEY",
    acl: "private",
    encrypt: true,
    key: "terraform.tfstate",
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("gcs backend", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.GcsBackend(stack, {
    bucket: "tf-state-prod",
    prefix: "terraform/state",
    accessToken: "Authorization: Bearer",
    credentials: "GOOGLE_BACKEND_CREDENTIALS",
    encryptionKey: "GOOGLE_ENCRYPTION_KEY",
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("http backend", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.HttpBackend(stack, {
    address: "http://myrest.api.com/foo",
    lockAddress: "http://myrest.api.com/foo",
    unlockAddress: "http://myrest.api.com/foo",
    lockMethod: "LOCK",
    password: "HTTP basic auth password",
    retryMax: 2,
    retryWaitMax: 30,
    retryWaitMin: 1,
    skipCertVerification: false,
    unlockMethod: "UNLOCK",
    updateMethod: "POST",
    username: "HTTP basic auth user",
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("oss backend", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.OssBackend(stack, {
    bucket: "bucket-for-terraform-state",
    prefix: "path/mystate",
    key: "version-1.tfstate",
    region: "cn-beijing",
    tablestoreEndpoint: "https://terraform-remote.cn-hangzhou.ots.aliyuncs.com",
    tablestoreTable: "statelock",
    accessKey: "ALICLOUD_ACCESS_KEY",
    secretKey: "ALICLOUD_SECRET_KEY",
    securityToken: "ALICLOUD_SECURITY_TOKEN",
    ecsRoleName: "RAM Role Name",
    acl: "object acl",
    assumeRole: {
      roleArn: "ALICLOUD_ASSUME_ROLE_ARN",
      policy: "restrictive policy",
      sessionName: "ALICLOUD_ASSUME_ROLE_SESSION_NAME",
      sessionExpiration: 3600,
    },
    encrypt: true,
    endpoint: "ALICLOUD_OSS_ENDPOINT",
    profile: "ALICLOUD_PROFILE",
    sharedCredentialsFile: "ALICLOUD_SHARED_CREDENTIALS_FILE",
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("pg backend", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.PgBackend(stack, {
    connStr: "postgres://user:pass@db.example.com/terraform_backend",
    schemaName: "terraform_remote_state",
    skipSchemaCreation: true,
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});

test("s3 backend", () => {
  const app = Testing.app();
  const stack = new TerraformStack(app, "test");

  new b.S3Backend(stack, {
    bucket: "mybucket",
    key: "path/to/my/key",
    region: "us-east-1",
    endpoint: "AWS_S3_ENDPOINT",
    encrypt: true,
    acl: "Canned ACL",
    accessKey: "AWS_ACCESS_KEY_ID",
    secretKey: "AWS_SECRET_ACCESS_KEY",
    kmsKeyId: "ARN of a KMS Key",
    dynamodbTable: "DynamoDB table",
    profile: "AWS_PROFILE",
    sharedCredentialsFile: "~/.aws/credentials",
    token: "AWS_SESSION_TOKEN",
    roleArn: "role to be assumed",
    assumeRolePolicy: "permissions for assuming role",
    externalId: "external ID",
    sessionName: "role session name",
    workspaceKeyPrefix: "env:",
    dynamodbEndpoint: "AWS_DYNAMODB_ENDPOINT",
    iamEndpoint: "AWS_IAM_ENDPOINT",
    stsEndpoint: "AWS_STS_ENDPOINT",
    forcePathStyle: false,
    skipCredentialsValidation: false,
    skipMetadataApiCheck: true,
    sseCustomerKey: "AWS_SSE_CUSTOMER_KEY",
    maxRetries: 5,
  });

  expect(Testing.synth(stack)).toMatchSnapshot();
});
