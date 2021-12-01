---
id: beyondidentity
title: Beyond Identity
---

## Documentation

https://developer.beyondidentity.com

## Configuration

If you don't have access to a tenant, please request one here https://developer.beyondidentity.com/docs/create-a-tenant

If your tenant is in the US region, go to https://admin.byndid.com/

for EU tenants, go to https://admin-eu.byndid.com/

You can configure an OIDC client within the admin console or following the guide here:
https://developer.beyondidentity.com/docs/oidc-configuration

## Options

The **Beyond Identity Provider** comes with a set of default options:

- [Beyond Identity Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/beyondidentity.js)

You can override any of the options to suit your own use case.

## Example

```js
import BeyondIdentityProvider from `next-auth/providers/beyondidentity`
...
providers: [
  BeyondIdentityProvider({
    clientId: process.env.BEYOND_CLIENT_ID,
    clientSecret: process.env.BEYOND_CLIENT_SECRET,
  })
]
...
```
