---
id: client
title: Client API
---

The NextAuth.js client library makes it easy to interact with sessions from React applications.

#### Example Session Object

```ts
{
  user: {
    name: string
    email: string
    image: string
  },
  expires: Date // This is the expiry of the session, not any of the tokens within the session
}
```

:::tip
The session data returned to the client does not contain sensitive information such as the Session Token or OAuth tokens. It contains a minimal payload that includes enough data needed to display information on a page about the user who is signed in for presentation purposes (e.g name, email, image).

You can use the [session callback](/configuration/callbacks#session-callback) to customize the session object returned to the client if you need to return additional data in the session object.
:::

:::note
The `expires` value is rotated, meaning whenever the session is retrieved from the [REST API](/getting-started/rest-api), this value will be updated as well, to avoid session expiry.
:::

---

## useSession()

- Client Side: **Yes**
- Server Side: No

The `useSession()` React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

Make sure that [`<SessionProvider>`](#sessionprovider) is added to `pages/_app.js`.

#### Example

```jsx
import { useSession } from "next-auth/react"

export default function Component() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return <p>Signed in as {session.user.email}</p>
  }

  return <a href="/api/auth/signin">Sign in</a>
}
```

`useSession()` returns an object containing two values: `data` and `status`:

- **`data`**: This can be three values: [`Session`](https://github.com/nextauthjs/next-auth/blob/8ff4b260143458c5d8a16b80b11d1b93baa0690f/types/index.d.ts#L437-L444) / `undefined` / `null`.
  - when the session hasn't been fetched yet, `data` will `undefined`
  - in case it failed to retrieve the session, `data` will be `null`
  - in case of success, `data` will be [`Session`](https://github.com/nextauthjs/next-auth/blob/8ff4b260143458c5d8a16b80b11d1b93baa0690f/types/index.d.ts#L437-L444).
- **`status`**: enum mapping to three possible session states: `"loading" | "authenticated" | "unauthenticated"`

### Require session

Due to the way how Next.js handles `getServerSideProps` and `getInitialProps`, every protected page load has to make a server-side request to check if the session is valid and then generate the requested page (SSR). This increases server load, and if you are good with making the requests from the client, there is an alternative. You can use `useSession` in a way that makes sure you always have a valid session. If after the initial loading state there was no session found, you can define the appropriate action to respond.

The default behavior is to redirect the user to the sign-in page, from where - after a successful login - they will be sent back to the page they started on. You can also define an `onFail()` callback, if you would like to do something else:

#### Example

```jsx title="pages/protected.jsx"
import { useSession } from "next-auth/react"

export default function Admin() {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      // The user is not authenticated, handle it here.
    }
  })

  if (status === "loading") {
    return "Loading or not authenticated..."
  }

  return "User is logged in"
}
```

### Custom Client Session Handling

Due to the way Next.js handles `getServerSideProps` / `getInitialProps`, every protected page load has to make a server-side request to check if the session is valid and then generate the requested page. This alternative solution allows for showing a loading state on the initial check and every page transition afterward will be client-side, without having to check with the server and regenerate pages.

```js title="pages/admin.jsx"
export default function AdminDashboard() {
  const { data: session } = useSession()
  // session is always non-null inside this page, all the way down the React tree.
  return "Some super secret dashboard"
}

AdminDashboard.auth = true
```

```jsx title="pages/_app.jsx"
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  )
}

function Auth({ children }) {
  const { data: session, status } = useSession()
  const isUser = !!session?.user
  React.useEffect(() => {
    if (status === "loading") return // Do nothing while loading
    if (!isUser) signIn() // If not authenticated, force log in
  }, [isUser, status])

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}
```

It can be easily be extended/modified to support something like an options object for role based authentication on pages. An example:

```jsx title="pages/admin.jsx"
AdminDashboard.auth = {
  role: "admin",
  loading: <AdminLoadingSkeleton />,
  unauthorized: "/login-with-different-user", // redirect to this url
}
```

Because of how `_app` is written, it won't unnecessarily contact the `/api/auth/session` endpoint for pages that do not require authentication.

More information can be found in the following [GitHub Issue](https://github.com/nextauthjs/next-auth/issues/1210).

### NextAuth.js + React-Query

There is also an alternative client-side API library based upon [`react-query`](https://www.npmjs.com/package/react-query) available under [`nextauthjs/react-query`](https://github.com/nextauthjs/react-query).

If you use `react-query` in your project already, you can leverage it with NextAuth.js to handle the client-side session management for you as well. This replaces NextAuth.js's native `useSession` and `SessionProvider` from `next-auth/react`.

See repository [`README`](https://github.com/nextauthjs/react-query) for more details.

---

## getSession()

- Client Side: **Yes**
- Server Side: **Yes**

NextAuth.js provides a `getSession()` method which can be called client or server side to return a session.

It calls `/api/auth/session` and returns a promise with a session object, or null if no session exists.

#### Client Side Example

```js
async function myFunction() {
  const session = await getSession()
  /* ... */
}
```

#### Server Side Example

```js
import { getSession } from "next-auth/react"

export default async (req, res) => {
  const session = await getSession({ req })
  /* ... */
  res.end()
}
```

:::note
When calling `getSession()` server side, you need to pass `{req}` or `context` object.
:::

The tutorial [securing pages and API routes](/tutorials/securing-pages-and-api-routes) shows how to use `getSession()` in server side calls.

---

## getCsrfToken()

- Client Side: **Yes**
- Server Side: **Yes**

The `getCsrfToken()` method returns the current Cross Site Request Forgery Token (CSRF Token) required to make POST requests (e.g. for signing in and signing out).

You likely only need to use this if you are not using the built-in `signIn()` and `signOut()` methods.

#### Client Side Example

```js
async function myFunction() {
  const csrfToken = await getCsrfToken()
  /* ... */
}
```

#### Server Side Example

```js
import { getCsrfToken } from "next-auth/react"

export default async (req, res) => {
  const csrfToken = await getCsrfToken({ req })
  /* ... */
  res.end()
}
```

---

## getProviders()

- Client Side: **Yes**
- Server Side: **Yes**

The `getProviders()` method returns the list of providers currently configured for sign in.

It calls `/api/auth/providers` and returns a list of the currently configured authentication providers.

It can be useful if you are creating a dynamic custom sign in page.

---

#### API Route

```jsx title="pages/api/example.js"
import { getProviders } from "next-auth/react"

export default async (req, res) => {
  const providers = await getProviders()
  console.log("Providers", providers)
  res.end()
}
```

:::note
Unlike `getSession()` and `getCsrfToken()`, when calling `getProviders()` server side, you don't need to pass anything, just as calling it client side.
:::

---

## signIn()

- Client Side: **Yes**
- Server Side: No

Using the `signIn()` method ensures the user ends back on the page they started on after completing a sign in flow. It will also handle CSRF Tokens for you automatically when signing in with email.

The `signIn()` method can be called from the client in different ways, as shown below.

### Redirects to sign in page when clicked

```js
import { signIn } from "next-auth/react"

export default () => <button onClick={() => signIn()}>Sign in</button>
```

### Starts OAuth sign-in flow when clicked

By default, when calling the `signIn()` method with no arguments, you will be redirected to the NextAuth.js sign-in page. If you want to skip that and get redirected to your provider's page immediately, call the `signIn()` method with the provider's `id`. 

For example to sign in with Google:

```js
import { signIn } from "next-auth/react"

export default () => (
  <button onClick={() => signIn("google")}>Sign in with Google</button>
)
```

### Starts Email sign-in flow when clicked

When using it with the email flow, pass the target `email` as an option.

```js
import { signIn } from "next-auth/react"

export default ({ email }) => (
  <button onClick={() => signIn("email", { email })}>Sign in with Email</button>
)
```

### Specifying a `callbackUrl`

The `callbackUrl` specifies to which URL the user will be redirected after signing in. It defaults to the current URL of a user.

You can specify a different `callbackUrl` by specifying it as the second argument of `signIn()`. This works for all providers.

e.g.

- `signIn(null, { callbackUrl: 'http://localhost:3000/foo' })`
- `signIn('google', { callbackUrl: 'http://localhost:3000/foo' })`
- `signIn('email', { email, callbackUrl: 'http://localhost:3000/foo' })`

The URL must be considered valid by the [redirect callback handler](/configuration/callbacks#redirect-callback). By default it requires the URL to be an absolute URL at the same host name, or else it will redirect to the homepage. You can define your own [redirect callback](/configuration/callbacks#redirect-callback) to allow other URLs, including supporting relative URLs.

### Using the `redirect: false` option

:::note
The redirect option is only available for `credentials` and `email` providers.
:::

In some cases, you might want to deal with the sign in response on the same page and disable the default redirection. For example, if an error occurs (like wrong credentials given by the user), you might want to handle the error on the same page. For that, you can pass `redirect: false` in the second parameter object.

e.g.

- `signIn('credentials', { redirect: false, password: 'password' })`
- `signIn('email', { redirect: false, email: 'bill@fillmurray.com' })`

`signIn` will then return a Promise, that resolves to the following:

```ts
{
  /**
   * Will be different error codes,
   * depending on the type of error.
   */
  error: string | undefined
  /**
   * HTTP status code,
   * hints the kind of error that happened.
   */
  status: number
  /**
   * `true` if the signin was successful
   */
  ok: boolean
  /**
   * `null` if there was an error,
   * otherwise the url the user
   * should have been redirected to.
   */
  url: string | null
}
```

### Additional parameters

It is also possible to pass additional parameters to the `/authorize` endpoint through the third argument of `signIn()`.

See the [Authorization Request OIDC spec](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) for some ideas. (These are not the only possible ones, all parameters will be forwarded)

e.g.

- `signIn("identity-server4", null, { prompt: "login" })` _always ask the user to re-authenticate_
- `signIn("auth0", null, { login_hint: "info@example.com" })` _hints the e-mail address to the provider_

:::note
You can also set these parameters through [`provider.authorizationParams`](/configuration/providers#oauth-provider-options).
:::

:::note
The following parameters are always overridden server-side: `redirect_uri`, `state`
:::

---

## signOut()

- Client Side: **Yes**
- Server Side: No

In order to logout, use the `signOut()` method to ensure the user ends back on the page they started on after completing the sign out flow. It also handles CSRF tokens for you automatically.

It reloads the page in the browser when complete.

```js
import { signOut } from "next-auth/react"

export default () => <button onClick={() => signOut()}>Sign out</button>
```

### Specifying a `callbackUrl`

As with the `signIn()` function, you can specify a `callbackUrl` parameter by passing it as an option.

e.g. `signOut({ callbackUrl: 'http://localhost:3000/foo' })`

The URL must be considered valid by the [redirect callback handler](/configuration/callbacks#redirect-callback). By default this means it must be an absolute URL at the same host name (or else it will default to the homepage); you can define your own custom [redirect callback](/configuration/callbacks#redirect-callback) to allow other URLs, including supporting relative URLs.

### Using the `redirect: false` option

If you pass `redirect: false` to `signOut`, the page will not reload. The session will be deleted, and the `useSession` hook is notified, so any indication about the user will be shown as logged out automatically. It can give a very nice experience for the user.

:::tip
If you need to redirect to another page but you want to avoid a page reload, you can try:
`const data = await signOut({redirect: false, callbackUrl: "/foo"})`
where `data.url` is the validated URL you can redirect the user to without any flicker by using Next.js's `useRouter().push(data.url)`
:::

---

## SessionProvider

Using the supplied `<SessionProvider>` allows instances of `useSession()` to share the session object across components, by using [React Context](https://reactjs.org/docs/context.html) under the hood. It also takes care of keeping the session updated and synced between tabs/windows.

```jsx title="pages/_app.js"
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

If you pass the `session` page prop to the `<SessionProvider>` – as in the example above – you can avoid checking the session twice on pages that support both server and client side rendering.

This only works on pages where you provide the correct `pageProps`, however. This is normally done in `getInitialProps` or `getServerSideProps` on an individual page basis like so:

```js title="pages/index.js"
import { getSession } from "next-auth/react"

...

export async function getServerSideProps(ctx) {
  return {
    props: {
      session: await getSession(ctx)
    }
  }
}
```

If every one of your pages needs to be protected, you can do this in `getInitialProps` in `_app`, otherwise you can do it on a page-by-page basis. Alternatively, you can do per page authentication checks client side, instead of having each authentication check be blocking (SSR) by using the method described below in [alternative client session handling](#custom-client-session-handling).

### Options

The session state is automatically synchronized across all open tabs/windows and they are all updated whenever they gain or lose focus or the state changes in any of them (e.g. a user signs in or out).

If you have session expiry times of 30 days (the default) or more then you probably don't need to change any of the default options in the Provider. If you need to, you can trigger an update of the session object across all tabs/windows by calling `getSession()` from a client side function.

However, if you need to customize the session behavior and/or are using short session expiry times, you can pass options to the provider to customize the behavior of the `useSession()` hook.

```jsx title="pages/_app.js"
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider
      session={session}
      // Re-fetch session every 5 minutes
      refetchInterval={5 * 60}
    >
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

:::note
**These options have no effect on clients that are not signed in.**

Every tab/window maintains its own copy of the local session state; the session is not stored in shared storage like localStorage or sessionStorage. Any update in one tab/window triggers a message to other tabs/windows to update their own session state.

Using low values for `refetchInterval` will increase network traffic and load on authenticated clients and may impact hosting costs and performance.
:::

#### Refetch interval

The `refetchInterval` option can be used to contact the server to avoid a session expiring.

When `refetchInterval` is set to `0` (the default) there will be no session polling.

If set to any value other than zero, it specifies in seconds how often the client should contact the server to update the session state. If the session state has expired when it is triggered, all open tabs/windows will be updated to reflect this.

The value for `refetchInterval` should always be lower than the value of the session `maxAge` [session option](/configuration/options#session).

:::note
See [**the Next.js documentation**](https://nextjs.org/docs/advanced-features/custom-app) for more information on **\_app.js** in Next.js applications.
:::
