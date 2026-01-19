// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />
const ses = { actions: ["ses:*"], resources: ["*"] };
export default $config({
  app(input) {
    return {
      name: "catastramite",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
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

    const CLIENT_SECRET = new sst.Secret("CLIENT_SECRET");
    const CLIENT_ID = new sst.Secret("CLIENT_ID");
    const BETTER_AUTH_SECRET = new sst.Secret("BETTER_AUTH_SECRET");

    new sst.aws.Nextjs("CatastramiteWeb", {
      permissions: [ses],
      link: [table, CLIENT_SECRET, CLIENT_ID, BETTER_AUTH_SECRET],
      environment: {
        DB_ADAPTER: "dynamodb",
        NEXT_PUBLIC_BETTER_AUTH_URL: "https://www.catastramite.com",
      },
      server: {
        install: ["better-sqlite3"],
      },
      domain: {
        name: "www.catastramite.com",
        dns: false,
        cert: "arn:aws:acm:us-east-1:372036281433:certificate/39f6af01-7e03-441c-b647-ac4cf178d405",
      },
    });
  },
});
