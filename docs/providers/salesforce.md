---
id: salesforce
title: Salesforce
---

## Documentation

https://help.salesforce.com/articleView?id=remoteaccess_authenticate.htm&type=5

## Options

The **Salesforce Provider** comes with a set of default options:

- [Salesforce Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/salesforce.js)

You can override any of the options to suit your own use case.

## Example

```js
import SalesforceProvider from "next-auth/providers/salesforce";
...
providers: [
  SalesforceProvider({
    clientId: process.env.SALESFORCE_CLIENT_ID,
    clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
  })
]
...
```

## Troubleshooting

If you run into an error saying something like `id_token detected in the response...`, you may have to add the scope parameter to your Salesforce config like so:

```js
import NextAuth from "next-auth/next";
import SalesFoceProvider from "next-auth/providers/salesforce";

export default NextAuth({
  ...,
  providers: [
    SalesFoceProvider({
      clientId: "SALESFORCE_CLIENT_ID",
      clientSecret: "SALESFORCE_CLIENT_SECRET",
      authorization: {
        params: {
          scope: "api id web",
        },
      },
    }),
  ],
});
```
      
See: https://github.com/nextauthjs/next-auth/issues/2524#issuecomment-1022544845
