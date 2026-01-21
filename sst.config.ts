// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />
const ses = { actions: ["ses:*"], resources: ["*"] };
export default $config({
  app(input) {
    return {
      name: "catastramite",
      removal: input?.stage === "prod" ? "retain" : "remove",
      protect: ["prod"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "eu-west-1",
        },
        "aws-native": "1.49.0",
      },
    };
  },
  async run() {
    const table = new sst.aws.Dynamo("CatastramiteTable", {
      fields: {
        PK: "string",
        SK: "string",
        GSI1PK: "string",
        GSI1SK: "string",
      },
      primaryIndex: {
        hashKey: "PK",
        rangeKey: "SK",
      },
      globalIndexes: {
        GSI1: {
          hashKey: "GSI1PK",
          rangeKey: "GSI1SK",
        },
      },
    });

    const AUTH_DOMAIN =
      $app.stage === "prod"
        ? "auth.catastramite.com"
        : "auth.test.catastramite.com";
    const AUTH_URL = "https://" + AUTH_DOMAIN;
    const AUTH_CERT =
      $app.stage === "prod"
        ? "arn:aws:acm:us-east-1:372036281433:certificate/ea25206e-1b2b-41a7-91ed-e1c337b94433"
        : "arn:aws:acm:us-east-1:372036281433:certificate/309219cd-3c1d-4a71-8936-35d9de042894";

    const CLIENT_SECRET = new sst.Secret("CLIENT_SECRET");
    const CLIENT_ID = new sst.Secret("CLIENT_ID");
    const BETTER_AUTH_SECRET = new sst.Secret("BETTER_AUTH_SECRET");

    const auth = new sst.aws.Auth("Auth", {
      issuer: {
        handler: "src/functions/auth.handler",
        link: [CLIENT_ID, CLIENT_SECRET, table, BETTER_AUTH_SECRET],
        environment: {
          DB_ADAPTER: "dynamodb",
          NEXT_PUBLIC_AUTH_URL: AUTH_URL,
        },
        runtime: "nodejs22.x",
      },
      domain: {
        name: AUTH_DOMAIN,
        dns: false,
        cert: AUTH_CERT,
      },
    });

    new sst.aws.Nextjs("CatastramiteWeb", {
      permissions: [ses],
      link: [table, CLIENT_SECRET, CLIENT_ID, auth, BETTER_AUTH_SECRET],
      environment: {
        DB_ADAPTER: "dynamodb",
        NEXT_PUBLIC_AUTH_URL: AUTH_URL,
      },
      server: {
        runtime: "nodejs22.x",
      },
      domain: {
        name: "www.catastramite.com",
        dns: false,
        cert: "arn:aws:acm:us-east-1:372036281433:certificate/39f6af01-7e03-441c-b647-ac4cf178d405",
      },
    });
  },
});
