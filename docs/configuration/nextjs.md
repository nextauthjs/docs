# Next.js

## Middleware

You can use a Next.js Middleware with NextAuth.js to protect your site.

Next.js 12 has introduced [Middleware](https://nextjs.org/docs/middleware). It is a way to run logic before accessing any page, even when they are static. On platforms like Vercel, the speed is guaranteed by executing Middleware at the [Edge](https://nextjs.org/docs/api-reference/edge-runtime)

### API

TODO:

### Caveats

- Currently only supports session verification, as as parts of the sign-in logic code need to run in a Node.js environment. In the future though, we would like to make sure that NextAuth.js can run fully at the [Edge](https://nextjs.org/docs/api-reference/edge-runtime)
- Only supports the `"jwt"` [session strategy](/options#session). We need to wait until databases at the Edge become mature enough to ensure a fast experience. (If you know of an Edge-compatible database, we would like if you proposed a new [Adapter](http://localhost:3000/tutorials/creating-a-database-adapter))

### Examples

#### Authentication for entire site

```js title="pages/_middleware.js"
export { default } from "next-auth/middleware"
```

With this one line, when someone tries to load any of your pages, they will have to be logged-in first. Otherwise, they are redirected to your login page.

#### Authorization for certain pages

```js title="pages/admin/_middleware.js"
import { withAuth } from "next-auth/middleware"

export default withAuth({
  authorized: ({ token }) => token?.role === "admin"
})
```

With the above code, you just made sure that only user's with the `admin` role can access any of the pages under thge `/admin` route. (Including nested routes as well, like `/admin/settings` etc.).

