---
id: github
title: GitHub
---

## Documentation

https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps

## Configuration

https://github.com/settings/apps

## Options

The **GitHub Provider** comes with a set of default options:

- [GitHub Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/github.js)

You can override any of the options to suit your own use case.

## Example

```js
import GitHubProvider from `next-auth/providers/github`
...
providers: [
  GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  })
]
...
```

:::warning
Only allows one callback URL per Client ID / Client Secret.
:::

:::tip
Email address is not returned if privacy settings are enabled.
:::
