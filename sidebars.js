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
        "configuration/initialization",
        "configuration/options",
        {
          type: "category",
          label: "Providers",
          collapsed: true,
          items: [
            "configuration/providers/oauth",
            "configuration/providers/email",
            "configuration/providers/credentials",
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
      label: "Providers",
      collapsed: true,
      items: [
        "providers/overview",
        // TODO: Overview included twice due to autogeneration
        {
          type: "autogenerated",
          dirName: "providers",
        },
      ],
    },
    {
      type: "category",
      label: "Adapters",
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
        "adapters/neo4j",
        "adapters/typeorm",
        "adapters/sequelize",
        "adapters/mikro-orm"
      ],
    },
    "warnings",
    "errors",
  ],
}
