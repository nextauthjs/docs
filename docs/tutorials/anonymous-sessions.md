---
id: anonymous-sessions
title: Anonymous Sessions
---

Some sites offer interactive functionality for users even if they are not logged in, for example guest checkout on e-commerce sites. You can implement this in NextAuth by adding a dummy [CredentialsProvider](../configuration/providers/credentials) that allows anyone to log in without passing any credentials.

:::note
This only works with the 'jwt' session strategy as the CredentialsProvider can only be used if JSON Web Tokens are enabled.
:::

First configure NextAuth with the dummy provider and the real providers you will use for logged in users.

```typescript
import NextAuth from 'next-auth';
import { createAnonymousUser } from 'my-third-party-lib';

export default NextAuth({
  providers: [
    // Dummy, anyone can do an anonymous login
    CredentialsProvider({
      id: 'anon',
      name: 'Anonymous',
      credentials: {},
      async authorize() {
        // createAnonymousUser is a function returning the id of the new persistent session
        const { id } = await createAnonymousUser();

        return {
          id
        };
      }
    }),
    {
      id: 'user'
      name: 'Logged In Users',
      // Additional configuration, see providers.
    }
  ]
});
```

If you are requesting an anonymous access token from a third party, you can also make the request from the JWT callback. For example [Commerce Tools anonymous sessions](https://docs.commercetools.com/api/authorization#tokens-for-anonymous-sessions).

```ts
import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import { getAnonymousToken, getLoggedInToken } from 'my-third-party-lib';

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: 'anon',
      name: 'Anonymous',
      credentials: {},
      async authorize() {
        // Dummy, anyone can do an anonymous login
        return {};
      }
    }),
    {
      id: 'user'
      name: 'Logged In Users',
      // Additional configuration, see providers.
    }
  ],
  jwt: async ({ token, account, profile }) => {
    if(account) {
      switch(account.provider) {
        case 'anon': {
          // getAnonymousToken is a function returning an access token for a new anonymous user
          const { thirdPartyToken } = await getAnonymousToken();

          return {
            thirdPartyToken
          };
        }

        case 'user': {
          if(!profile) {
            throw new Error('Missing profile in user login');
          }

          // getLoggedInToken is a function returning an access token for a newly logged in user
          //  - profile.sub is the user ID from the provider
          //  - We can pass account.id_token/access_token to prove we have already logged them in
          const { thirdPartyToken } = await getLoggedInToken(profile.sub, account.id_token);

          return {
            sub: profile.sub,
            thirdPartyToken
          };
        }
      }
    }

    return token;
  }
});
```

You can pass whether the user is logged in or anonymous through the session callback.

```ts
export default NextAuth({
  // other options as above
  session: ({ session, token }) => ({
    ...session,
    isLoggedIn: token.sub !== undefined
  })
});
```

Then in the frontend, you can sign in to the dummy provider without a redirect if not already logged in.

```jsx
import { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

const { status, data } = useSession();

useEffect(() => {
  if(status === 'unauthenticated') {
    signIn('anon', { redirect: false }).then(response => {
      if(response.ok) {
        // anonymous login complete
        //  - status will be 'authenticated'
        //  - data.isLoggedIn will be true
      } else {
        // anonymous login failed, check response.error and display an error
      }
    });
  }
}, [status]);
```