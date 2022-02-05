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

In `.env` add the following entries:

```
NEXTAUTH_URL=<Your application url e.g: http://localhost:3000>
SECRET=<Your secret here>
ASGARDEO_ORGANIZATION=<copy the organization name(tenant) here>
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
    organizationName: process.env.ASGARDEO_ORGANIZATION,
    clientId: process.env.ASGARDEO_CLIENT_ID,
    clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
    scopes: process.env.ASGARDEO_SCOPES,
  }),
],
secret: process.env.SECRET,
session: {
  strategy: "jwt",
},
  
...
```
