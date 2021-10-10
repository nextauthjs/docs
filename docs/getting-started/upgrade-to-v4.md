---
id: upgrade-v4
title: Upgrade Guide (v4)
---

NextAuth.js version 4 includes a few breaking changes from the last major version (3.x). So we're here to help you upgrade your applications as smoothly as possible. It should be possible to upgrade from any version of 3.x to the latest 4 release by following the next few migration steps.

:::note
Version 4 is currently in beta. We encourage users to try it out as we don't plan to change the API any more, but be aware that if a bug-fix requires so, we will do that without further notice.
:::

You can upgrade to the new version by running:

```bash npm2yarn
npm install next-auth@beta
```

#### Verify the correct version

:::warning
Due to an [unfortunate publish on npm](https://www.npmjs.com/package/next-auth/v/4.0.0), there is a `4.0.0` version out there that is **NOT** suitable for use. During the beta release phase, please make sure/double check your `node_modules/next-auth/package.json` version to be exactly `4.0.0-beta.1` (or `beta.2` etc.), instead of `4.0.0`. (Adapters might try to install the wrong version in some cases for example.)

In your project's `package.json`, make sure you don't have a `^` character before the version number. Read more in the [npm docs](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies).

We are sorry for this inconvenience, and we will remedy this issue as soon as v4 goes stable.
:::


## Adapters

You can find the official Adapters in the [nextauthjs/adapter](https://github.com/nextauthjs/adapters) repository. Although you can still [create your own](/tutorials/creating-a-database-adapter) with a new, [simplified Adapter API](https://github.com/nextauthjs/next-auth/pull/2361).

1.1. If you use the built-in TypeORM or Prisma adapters, these have been removed from the core `next-auth` package to not balloon the package size for users who do not need a database. Thankfully the migration is super easy; you just need to install the external packages for your database and change the import in your `[...nextauth].js`.

The `database` option is gone, you can do the following instead:

```diff
// [...nextauth].js
import NextAuth from "next-auth"
+ import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"

...
export default NextAuth({
-  database: "yourconnectionstring",
+  adapter: TypeORMLegacyAdapter("yourconnectionstring")
})
```

1.2. The `prisma-legacy` adapter has been removed, please use the [`@next-auth/prisma-adapter`](https:/npmjs.com/package/@next-auth/prisma-adapter) instead.

1.3. The `typeorm-legacy` adapter will stay as-is for the time being, however we do aim to migrate this to individual lighter weight adapters for each database type in the future, or switch out `typeorm`.

1.4 MongoDB has been moved to its own adapter under `@next-auth/mongodb-adapter`. See the [MongoDB Adapter docs](/adapters/mongodb).

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.8 and https://github.com/nextauthjs/next-auth/pull/2361

:::warning
When using the **NextAuth v4 beta**, please make sure to use the `next` tagged version of your adapter. For example, to use the appropriate `typeorm` version with NextAuth v4, you would install `@next-auth/typeorm-legacy-adapter@next`.
:::

### Adapter API

The Adapter API has been rewritten and significantly simplified in NextAuth v4. The adapters now have less work to do as some functionality has been migrated to the core of NextAuth, like hashing the [verification token](/adapters/models/#verification-token).

**This does not require any changes from the user**, however if you are an adapter maintainer or are interested in writing your own adapter, you can find more information about this change in https://github.com/nextauthjs/next-auth/pull/2361 and release https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.22.

### Schema changes

The way we save data with adapters have slightly changed. With the new Adapter API, we wanted to make it easier to extend your database with additional fields. For example if your User needs an extra `phone` field, it should be enough to add that to your database's schema, and no changes will be necessary in your adapter.

- `created_at`/`createdAt` and `updated_at`/`updatedAt` fields are removed from all Models.
- `user_id`/`userId` consistently named `userId`.
- `compound_id`/`compundId` is removed from Account.
- `access_token`/`accessToken` is removed from Session.
- `email_verified`/`emailVerified` on User is consistently named `emailVerified`.
- `provider_id`/`providerId` renamed to `provider` on Account
- `provider_type`/`providerType` renamed to `type` on Account
- `provider_account_id`/`providerAccountId` on Account is consistently named `providerAccountId`
- `access_token_expires`/`accessTokenExpires` on Account renamed to `expires_in`
- New fields on Account: `expires_at`, `token_type`, `scope`, `id_token`, `oauth_token_secret`, `oauth_token`, `session_state`
  

<!-- REVIEW: Would something like this below be helpful? -->
<details>
<summary>
See the changes
</summary>
<pre>

```diff
User {
  id
  name
  email
- emailVerified
+ email_verified
  image
-  created_at
-  updated_at
}

Account {
  id
- compound_id
- user_id
+ userId
-  provider_type
+ type
- provider_id
+ provider
- provider_account_id
+ providerAccountId
  refresh_token
  access_token
- access_token_expires
+ expires_in
+ expires_at
+ token_type
+ scope
+ id_token
+ oauth_token_secret
+ oauth_token
+ session_state
- created_at
- updated_at
}

Session {
  id
  userId
  expires
  sessionToken
- access_token
- created_at
- updated_at
}

VerificationToken {
  id
  token
  expires
  identifier
-  created_at
-  updated_at
}
```
</pre>
</details>


For more info, see the [Models page](/adapters/models).

## `next-auth/jwt`

We no longer have a default export in `next-auth/jwt`.
To comply with this, change the following:

```diff
- import jwt from "next-auth/jwt"
+ import { getToken } from "next-auth/jwt"
```

## `next-auth/react`

We've renamed the client-side import source to `next-auth/react`. To comply with this change, you will simply have to rename anywhere you were using `next-auth/client`.

For example:

```diff
- import { useSession } from "next-auth/client"
+ import { useSession } from "next-auth/react"
```

We've also made the following changes to the names of the exports:

- `setOptions`: Not exposed anymore, use [`SessionProvider` props](https://next-auth.js.org/getting-started/client#options)
- `options`: Not exposed anymore, [use `SessionProvider` props](https://next-auth.js.org/getting-started/client#options)
- `session`: Renamed to `getSession`
- `providers`: Renamed to `getProviders`
- `csrfToken`: Renamed to `getCsrfToken`
- `signin`: Renamed to `signIn`
- `signout`: Renamed to `signOut`
- `Provider`: Renamed to `SessionProvider`

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.12

## `SessionProvider`

Version 4 makes using the `SessionProvider` mandatory. This means that you will have to wrap any part of your application using `useSession` in this provider, if you were not doing so already. The `SessionProvider` has also undergone a few further changes:

- `Provider` is renamed to `SessionProvider`
- The options prop is now flattened as the props of SessionProvider.
- `keepAlive` has been renamed to `refetchInterval`.
- `clientMaxAge` has been removed in favor of `refetchInterval`, as they overlap in functionality, with the difference that `refetchInterval` will keep re-fetching the session periodically in the background.

The best practice for wrapping your app in Providers is to do so in your `pages/_app.jsx` file.

An example use-case with these new changes:

```jsx
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    // `session` comes from `getServerSideProps` or `getInitialProps`.
    // Avoids flickering/session loading on first load.
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.12

## Providers

Providers now need to be imported individually.

```diff
- import Provider from "next-auth/providers"
- Providers.Auth0({...})
- Providers.Google({...})
+ import Auth0Provider from "next-auth/providers/auth0"
+ import GoogleProvider from "next-auth/providers/google"
+ Auth0Provider({...})
+ GoogleProvider({...})
```

1. The `AzureADB2C` provider has been renamed `AzureAD`.
2. The `Basecamp` provider has been removed, see explanation [here](https://github.com/basecamp/api/blob/master/sections/authentication.md#on-authenticating-users-via-oauth).
3. The GitHub provider by default now will not request full write access to user profiles. If you need this scope, please add `user` to the scope option manually.

The following new options are available when defining your Providers in the configuration:

1. `authorization` (replaces `authorizationUrl`, `authorizationParams`, `scope`)
2. `token` replaces (`accessTokenUrl`, `headers`, `params`)
3. `userinfo` (replaces `profileUrl`)
4. `issuer`(replaces `domain`)

For more details on their usage, please see [using a custom provider](/configuration/providers/oauth-provider#using-a-custom-provider) or checkout this PR: https://github.com/nextauthjs/next-auth/pull/2411

When submitting a new OAuth provider to the repository, the `profile` callback is expected to only return these fields from now on: `id`, `name`, `email`, and `image`. If any of these are missing values, they should be set to `null`.

Also worth noting is that `id` is expected to be returned as a `string` type (For example if your provider returns it as a number, you can cast it by using the `.toString()` method). This makes the returned profile object comply across all providers/accounts/adapters, and hopefully cause less confusion in the future.

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.20

## `useSession` Hook

The `useSession` hook has been updated to return an object. This allows you to test states much more cleanly with the new `status` option.

```diff
- const [ session, loading ] = useSession()
+ const { data: session, status } = useSession()
+ const loading = status === "loading"
```

[Check the docs](https://next-auth.js.org/getting-started/client#usesession) for the possible values of both `session.status` and `session.data`.

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.18

## Named Parameters

We have changed the arguments to our callbacks to the named parameters pattern. This way you don't have to use dummy `_` placeholders or other tricks.

### Callbacks

The signatures for the callback methods now look like this:

```diff
- signIn(user, account, profileOrEmailOrCredentials)
+ signIn({ user, account, profile, email, credentials })
```

```diff
- redirect(url, baseUrl)
+ redirect({ url, baseUrl })
```

```diff
- session(session, tokenOrUser)
+ session({ session, token, user })
```

```diff
- jwt(token, user, account, OAuthProfile, isNewUser)
+ jwt({ token, user, account, profile, isNewUser })
```

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.17

### Events

Two event signatures have changed to also use the named parameters pattern, `signOut` and `updateUser`.

```diff
// [...nextauth].js
...
events: {
- signOut(tokenOrSession),
+ signOut({ token, session }), // token if using JWT, session if DB persisted sessions.
- updateUser(user)
+ updateUser({ user })
}
```

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.20

## Adapters

Most importantly, the core `next-auth` package no longer ships with `typeorm` or any other database adapter by default. This brings the default bundle size down significantly for those not needing to persist user data to a database.

You can find the official Adapters in the newly created [nextauthjs/adapter](https://github.com/nextauthjs/adapters) repository. Although you can still [create your own](/tutorials/creating-a-database-adapter) with a new, [simplified Adapter API](https://github.com/nextauthjs/next-auth/pull/2361).

1. If you use the built-in TypeORM or Prisma adapters, these have been removed from the core `next-auth` package. Thankfully the migration is easy; you just need to install the external packages for your database and change the import in your `[...nextauth].js`.

The `database` option has been removed, you must now do the following instead:

```diff
// [...nextauth].js
import NextAuth from "next-auth"
+ import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter"

...
export default NextAuth({
-  database: "yourconnectionstring",
+  adapter: TypeORMLegacyAdapter("yourconnectionstring")
})
```

2. The `prisma-legacy` adapter has been removed, please use the [`@next-auth/prisma-adapter`](https:/npmjs.com/package/@next-auth/prisma-adapter) instead.

3. The `typeorm-legacy` adapter has been upgraded to use the newer adapter API, but has retained the `typeorm-legacy` name. We aim to migrate this to individual lighter weight adapters for each database type in the future, or switch out `typeorm`.

4. MongoDB has been moved to its own adapter under `@next-auth/mongodb-adapter`. See the [MongoDB Adapter docs](/adapters/mongodb).

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.8 and https://github.com/nextauthjs/next-auth/pull/2361

:::warning IMPORTANT
When using the **NextAuth v4 beta**, please make sure to use the `next` tagged version of your adapter. For example, to use the appropriate `typeorm` version with NextAuth v4, you would:

`npm install @next-auth/typeorm-legacy-adapter@next`

If you have issues installing `@next` adapters with npm due to the required `4.0.0-beta.X` version of `next-auth` and a `4.0.0` package already existing, please use the `--force-legacy-deps` flag with `npm install`.
:::

## Logger API

The logger API has been simplified to use at most two parameters, where the second is usually an object (`metadata`) containing an `error` object. If you are not using the logger settings you can ignore this change.

```diff
// [...nextauth.js]
import log from "some-logger-service"
...
logger: {
- error(code, ...message) {},
+ error(code, metadata) {},
- warn(code, ...message) {},
+ warn(code) {}
- debug(code, ...message) {}
+ debug(code, metadata) {}
}
```

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.19

## `nodemailer`

Like `typeorm` and `prisma`, [`nodemailer`](https://npmjs.com/package/nodemailer) is no longer included as a dependency by default. If you are using the Email provider you must install it in your project manually, or use any other Email library in the [`sendVerificationRequest`](/configuration/providers#options-1#:~:text=sendVerificationRequest) callback. This reduces bundle size for those not actually using the Email provider. Remember, when using the Email provider, it is mandatory to also use a database adapter due to the fact that verification tokens need to be persisted longer term for the magic link functionality to work.

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.2

## Theme

We have added some basic customization options to our built-in pages like `signin`, `signout`, etc.

These can be set under the `theme` configuration key. This used to be a string which only controlled the color scheme option. Now it is an object with the following options:

```js
theme: {
  colorScheme: "auto", // "auto" | "dark" | "light"
  brandColor: "", // Hex color value
  logo: "" // Absolute URL to logo image
}
```

The hope is that with some minimal configuration / customization options, users won't immediately feel the need to replace the built-in pages with their own.

More details and screenshots of the new theme options can be found under [configuration/pages](https://next-auth.js.org/configuration/pages#theming).

Introduced in https://github.com/nextauthjs/next-auth/pull/2788

## Adapter API

**This does not require any changes from the user - these are adapter specific changes only**

The Adapter API has been rewritten and significantly simplified in NextAuth v4. The adapters now have less work to do as some functionality has been migrated to the core of NextAuth, like hashing the [verification token](/adapters/models/#verification-token).

If you are an adapter maintainer or are interested in writing your own adapter, you can find more information about this change in https://github.com/nextauthjs/next-auth/pull/2361 and release https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.22.

### Schema changes

The way we save data with adapters have slightly changed. With the new Adapter API, we wanted to make it easier to extend your database with additional fields. For example if your User needs an extra `phone` field, it should be enough to add that to your database's schema, and no changes will be necessary in your adapter.

- `created_at`/`createdAt` and `updated_at`/`updatedAt` fields are removed from all Models.
- `user_id`/`userId` consistently named `userId`.
- `compound_id`/`compundId` is removed from Account.
- `access_token`/`accessToken` is removed from Session.
- `email_verified`/`emailVerified` on User is consistently named `email_verified`.
- `provider_id`/`providerId` renamed to `provider` on Account
- `provider_type`/`providerType` renamed to `type` on Account
- `provider_account_id`/`providerAccountId` on Account is consistently named `providerAccountId`
- `access_token_expires`/`accessTokenExpires` on Account renamed to `expires_in`
- New fields on Account: `expires_at`, `token_type`, `scope`, `id_token`, `oauth_token_secret`, `oauth_token`, `session_state`


<!-- REVIEW: Would something like this below be helpful? -->
<details>
<summary>
See the changes
</summary>
<pre>

```diff
User {
  id
  name
  email
- emailVerified
+ email_verified
  image
-  created_at
-  updated_at
}

Account {
  id
- compound_id
- user_id
+ userId
-  provider_type
+ type
- provider_id
+ provider
- provider_account_id
+ providerAccountId
  refresh_token
  access_token
- access_token_expires
+ expires_in
+ expires_at
+ token_type
+ scope
+ id_token
+ oauth_token_secret
+ oauth_token
+ session_state
- created_at
- updated_at
}

Session {
  id
  userId
  expires
  sessionToken
- access_token
- created_at
- updated_at
}

VerificationToken {
  id
  token
  expires
  identifier
-  created_at
-  updated_at
}
```
</pre>
</details>


For more info, see the [Models page](/adapters/models).

## Summary

We hope this migration goes smoothly for each and every one of you! If you have any questions or get stuck anywhere, feel free to create [a new issue](https://github.com/nextauthjs/next-auth/issues/new) on GitHub.
