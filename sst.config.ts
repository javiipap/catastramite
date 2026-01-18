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
    };
  },
  async run() {
    new sst.aws.Nextjs("CatastramiteWeb", {
      permissions: [ses],
      domain: {
        name: "www.catastramite.com",
        dns: false,
        cert: "arn:aws:acm:us-east-1:372036281433:certificate/39f6af01-7e03-441c-b647-ac4cf178d405",
      },
    });
  },
});
