module.exports = {
  title: "NextAuth.js",
  tagline: "Authentication for Next.js",
  url: "https://next-auth.js.org",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "nextauthjs",
  projectName: "next-auth",
  themeConfig: {
    prism: {
      theme: require("prism-react-renderer/themes/vsDark"),
    },
    algolia: {
      apiKey: "b81e3ca39a920b7815e880aea49c00ec",
      indexName: "next-auth",
      searchParameters: {},
    },
    navbar: {
      title: "NextAuth.js",
      logo: {
        alt: "NextAuth Logo",
        src: "img/logo/logo-xs.png",
      },
      items: [
        {
          to: "/getting-started/introduction",
          activeBasePath: "docs",
          label: "Documentation",
          position: "left",
        },
        {
          to: "/tutorials",
          activeBasePath: "docs",
          label: "Tutorials",
          position: "left",
        },
        {
          to: "/faq",
          activeBasePath: "docs",
          label: "FAQ",
          position: "left",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              to: "https://github.com/nextauthjs/next-auth/releases",
              label: "All Releases",
            },
          ],
        },
        {
          to: "https://www.npmjs.com/package/next-auth",
          label: "npm",
          position: "right",
        },
        {
          to: "https://github.com/nextauthjs/next-auth",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    announcementBar: {
      id: "new-major-announcement",
      content:
        "You are looking at the v4 documentation (currently in beta). 🎉 If you need the old (v3) documentation, check it out <a href='/v3/getting-started/introduction'>here</a>.",
      backgroundColor: "#1786fb",
      textColor: "#fff",
    },
    footer: {
      links: [
        {
          title: "About NextAuth.js",
          items: [
            {
              label: "Introduction",
              to: "/getting-started/introduction",
            },
            {
              label: "Unreleased documentation",
              to: "https://docs-git-next-nextauthjs.vercel.app/",
            },
          ],
        },
        {
          title: "Download",
          items: [
            {
              label: "GitHub",
              to: "https://github.com/nextauthjs/next-auth",
            },
            {
              label: "NPM",
              to: "https://www.npmjs.com/package/next-auth",
            },
          ],
        },
        {
          title: "Acknowledgements",
          items: [
            {
              label: "Contributors",
              to: "/contributors",
            },
            {
              label: "Sponsors",
              to: "https://opencollective.com/nextauth",
            },
            {
              label: "Images by unDraw",
              to: "https://undraw.co/",
            },
            {
              html: `
            <a target="_blank" rel="noopener noreferrer" href="https://vercel.com?utm_source=nextauthjs&utm_campaign=oss">
              <img
                alt="Powered by Vercel"
                style="margin-top: 8px"
                height="32"
                src="https://raw.githubusercontent.com/nextauthjs/next-auth/main/www/static/img/powered-by-vercel.svg"
              />
            </a>`,
            },
          ],
        },
      ],
      copyright: "NextAuth.js &copy; Iain Collins 2021",
    },
    colorMode: {
      respectPrefersColorScheme: true,
      switchConfig: {
        darkIcon: "🌑️",
        lightIcon: "💡",
      },
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          routeBasePath: "/",
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/nextauthjs/docs",
          lastVersion: "current",
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          remarkPlugins: [
            require("remark-mermaid-dataurl"),
            require("remark-github"),
          ],
          versions: {
            current: {
              label: "v4",
            },
            v3: {
              label: "v3",
            },
          },
        },
        theme: {
          customCss: require.resolve("./src/css/index.css"),
        },
      },
    ],
  ],
}
