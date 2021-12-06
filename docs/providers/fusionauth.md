---
id: fusionauth
title: FusionAuth
---

## Documentation

https://fusionauth.io/docs/v1/tech/oauth/

## Options

The **FusionAuth Provider** comes with a set of default options:

- [FusionAuth Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/fusionauth.js)

You can override any of the options to suit your own use case.

## Example

```js
import FusionAuthProvider from `next-auth/providers/fusionauth`
...
providers: [
  FusionAuthProvider({
    id: "fusionauth",
    name: "FusionAuth",
    idToken: true,
    jwks_endpoint: process.env.FUSIONAUTH_JWKS_ENDPOINT,
    wellKnown: process.env.FUSIONAUTH_WELLKNOWN,
    issuer:  process.env.FUSIONAUTH_ISSUER,
    clientId: process.env.FUSIONAUTH_CLIENT_ID,
    clientSecret: process.env.FUSIONAUTH_SECRET,
    tenantId: process.env.FUSIONAUTH_TENANT_ID // Only required if you're using multi-tenancy
  }),
]
...
```

:::warning
If you're using multi-tenancy, you need to pass in the `tenantId` option to apply the proper theme.
:::

## Instructions

### Configuration

:::tip
An application can be created at https://your-fusionauth-server-url/admin/application.

For more information, follow the [FusionAuth 5-minute setup guide](https://fusionauth.io/docs/v1/tech/5-minute-setup-guide).
:::

Next-Auth uses `RS256` algorithm to decrypt the Id Token, but FusionAuth uses `HS256` algorithm by default. You have to make sure your FusionAuth application's Id Token signing key is RS256 key pair for Next-Auth to work.

In **Settings/Key Master**, create new `RS256` signing key if you don't have one:

- Choose Generate RSA
- Name the key, .e.g. _RS256_
- Set the Algorithm to _RSA using SHA-256_
- Submit

After having your RS256 key pair, go to your application JWT settings, set the `Id Token signing key` to your RS256 key pair.

In the OAuth settings for your application, configure the following.

- Redirect URL
  - http://localhost:3000/api/auth/callback/fusionauth
- Enabled grants
  - Make sure _Authorization Code_ is enabled.
