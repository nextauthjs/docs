---
id: asgardeo
title: Asgardeo
---

## Documentation

https://wso2.com/asgardeo/docs/guides/authentication


## Example

### To allow specific Active Directory users access:

- Log into https://console.asgardeo.io.
- Next, go to "Application" in https://console.asgardeo.io/t/{your_tenant}/develop/applications .
- Register standard based - Open id connect, application
- After registring the application, go to protocol tab.
- Check client credentials grant type.
- Add Authorized redirect URLs & Allowed origins fields.

In `.env.local` create the following entries:

```
ASGARDEO_DOMAIN=<copy the domain url here>
ASGARDEO_TENANT=<copy the tenant id here>
ASGARDEO_CLIENT_ID=<copy Application (client) ID here>
ASGARDEO_CLIENT_SECRET=<copy generated client secret value here>
ASGARDEO_SCOPES=<mention the scopes as a string here. e.g. "openid email profile internal_login">
```

In `pages/api/auth/[...nextauth].js` find or add the `Asgardeo` entries:

```js
import AsgardeoProvider from "next-auth/providers/asgardeo";
...
providers: [
  AsgardeoProvider({
    domain: process.env.ASGARDEO_DOMAIN,
    tenantId: process.env.ASGARDEO_TENANT,
    clientId: process.env.ASGARDEO_CLIENT_ID,
    clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
    scopes: process.env.ASGARDEO_SCOPES,
  }),
],
secret: process.env.SECRET,

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token, user }) {
      session.accessToken = token.accessToken
      session.idToken = token.idToken

      const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + session?.accessToken
        },
      }

      const response = await fetch(`https://${options.domain}/t/${options?.tenantId}/scim2/Me`, config);

      const userResponse: UserResponseType = await response.json();
      
      const userData = {
        name: `${userResponse?.name?.givenName} ${userResponse?.name?.familyName}`.trim(),
        email: userResponse?.emails[0],
        image: userResponse?.profileUrl
      }

      session.user = userData;

      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.accessToken = account.access_token
        token.idToken = account.id_token
      }
      return token
    }
  }
...
```
