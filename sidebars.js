module.exports = {
  docs: [
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "getting-started/introduction",
        "getting-started/example",
        "getting-started/client",
        "getting-started/rest-api",
        "getting-started/typescript",
        "getting-started/upgrade-v4",
      ],
    },
    {
      type: "category",
      label: "Configuration",
      collapsed: true,
      items: [
        "configuration/options",
        {
          type: "category",
          label: "Providers",
          collapsed: true,
          items: [
            "configuration/providers/oauth-provider",
            "configuration/providers/email-provider",
            "configuration/providers/credentials-provider",
          ],
        },
        "configuration/databases",
        "configuration/pages",
        "configuration/callbacks",
        "configuration/events",
      ],
    },
    {
      type: "category",
      label: "Database Adapters",
      collapsed: true,
      items: [
        "adapters/overview",
        "adapters/models",
        "adapters/prisma",
        "adapters/fauna",
        "adapters/dynamodb",
        "adapters/firebase",
        "adapters/pouchdb",
        "adapters/mongodb",
        "adapters/typeorm",
      ],
    },
    {
      type: "category",
      label: "Authentication Providers",
      collapsed: true,
      items: [
        {
          type: "autogenerated",
          dirName: "providers",
        },
      ],
    },
    "warnings",
    "errors",
  ],
}
