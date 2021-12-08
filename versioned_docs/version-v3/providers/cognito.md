---
id: cognito
title: Amazon Cognito
---

## Documentation

https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-userpools-server-contract-reference.html

## Configuration

https://console.aws.amazon.com/cognito/users/

You need to select your AWS region to go the the Cognito dashboard.

## Options

The **Amazon Cognito Provider** comes with a set of default options:

- [Amazon Cognito Provider options](https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/providers/cognito.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Cognito({
    clientId: process.env.COGNITO_CLIENT_ID,
    clientSecret: process.env.COGNITO_CLIENT_SECRET,
    domain: process.env.COGNITO_DOMAIN,
  })
]
...
```

:::warning
Make sure you select all the appropriate client settings or the OAuth flow will not work.
:::

![cognito](https://user-images.githubusercontent.com/7902980/83951604-cd096e80-a832-11ea-8bd2-c496ec9a16cb.PNG)
