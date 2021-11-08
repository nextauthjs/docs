---
id: initialization
title: Initialization
---

In Next.js, you can define an API route that will catch all requests that begin with a certain path. Conveniently, this is called [Catch all API routes](https://nextjs.org/docs/api-routes/dynamic-api-routes#catch-all-api-routes).

When you define a `/pages/api/[...nextauth]` JS/TS file, you instruct NextAuth.js that every API request beginning with `/api/auth/*` should be handled by the code written in the `[...nextauth]` file.

Depending on your use-case, you can initialize NextAuth.js in two different ways:

## Simple initialization

In most cases, you won't need to worry about what `NextAuth.js` does, and you will get by just fine with the following initialization:

```ts title="/pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"

export default NextAuth({
  ...
})
```

Here, you only need to pass your [options](/configuration/options) to `NextAuth`, and `NextAuth` does the rest.

This is the preferred initialization in tutorials/other parts of the documentation, as it somewhat simplifies the code and there is smaller chances for errors in the authentication flow.

## Advanced initialization

In rare cases, there is just **some extra functionality** that you wish NextAuth.js had, or you need to _preprocess_ the request, but you understand that it is way too specific for your use-case to be introduced as part of the library.

There is an important thing to realize.

:::tip
The `/pages/api/auth/[...nextauth]` file is **just a regular [API Route](https://nextjs.org/docs/api-routes/introduction)**.
:::

That said, you can initialize NextAuth.js like this:

```ts title="/pages/api/auth/[...nextauth].ts"
import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Do whatever you want here, before the request is passed down to `NextAuth`
  return await NextAuth(req, res, {
    ...
  })
}
```

The `...` section will still be your [options](/configuration/options), but you now have the possibility to execute/modify certain things on the request.

You could for example log the request, add headers, read `query` or `body` parameters, whatever you would do in an API route.

:::tip
Since this is a catch-all route, remember to check what kind of NextAuth.js "action" is running. Compare the REST API with the `req.query.nextauth` parameter.

For example to execute something on the "callback" action when the request is a POST method, you can check for `req.query.nextauth.includes("callback") && req.mehod === "POST"`
:::

:::note
`NextAuth` will implicitly close the response (by calling `res.end`, `res.send` or similar), so you should not run code **after** `NextAuth` in the function body. Using `return NextAuth` makes sure you don't forget that.
:::

Any variable you create this way will be available in the `NextAuth` options as well, since they are in the same scope.

```ts title="/pages/api/auth/[...nextauth].ts"
import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

  if(req.query.nextauth.includes("callback") && req.method === "POST") {
    console.log(
      "Handling callback request from my Identity Provider",
      req.body
    )
  }

  // Get a custom cookie value from the request
  const someCookie = req.cookies["some-custom-cookie"]

  return await NextAuth(req, res, {
    ...
    callbacks: {
      session({ session, token }) {
        // Return a cookie value as part of the session
        // This is read when `req.query.nextauth.includes("session") && req.method === "GET"`
        session.someCookie = someCookie
        return session
      }
    }
  })
}
```

A practical example could be to not show a certain provider on the default sign-in page, but still be able to sign in with it. (The idea is taken from [this discussion](https://github.com/nextauthjs/next-auth/discussions/3133)):

```js title="/pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"

export default async function auth(req, res) {
  const providers = [
    CredentialsProvider(...),
    GoogleProvider(...),
  ]

  const isDefaultSigninPage = req.method === "GET" && req.query.nextauth.includes("signin")

  // Will hide the `GoogleProvider` when you visit `/api/auth/signin`
  if (isDefaultSigninPage) providers.pop()

  return await NextAuth(req, res, {
    providers,
    ...
  })
}
```

To completely understand what actions correspond to and what methods are supported, check out the [REST API documentation](/getting-started/rest-api), or look at the [source code](https://github.com/nextauthjs/next-auth/blob/beta/src/core/index.ts).

This way of initializing `NextAuth` is very powerful, but should be used sparingly.

:::warning
Changing parts of the request that is essential to `NextAuth` to do it's job - like messing with the [default cookies](http://localhost:3000/configuration/options#cookies) - can have unforeseen consequences, and have the potential to introduce security holes if done incorrectly. Only change those this if you understand these consequences.
:::
