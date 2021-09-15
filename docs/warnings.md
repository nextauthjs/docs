---
id: warnings
title: Warnings
---

This is a list of warning output from NextAuth.js.

All warnings indicate things which you should take a look at, but do not inhibit normal operation.

---

## Client

#### NEXTAUTH_URL

Environment variable `NEXTAUTH_URL` missing. Please set it in your `.env` file.

---

## Server

These warnings are displayed on the terminal.

#### JWT_AUTO_GENERATED_SIGNING_KEY

To remedy this warning, you can either:

**Option 1**: Pass a pre-regenerated Private Key (and, optionally a Public Key) in the jwt options.
```js title="/pages/api/auth/[...nextauth].js"
jwt: {
  signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,

  // You can also specify a public key for verification if using public/private key (but private only is fine)
  // verificationKey: process.env.JWT_SIGNING_PUBLIC_KEY,

  // If you want to use some key format other than HS512 you can specify custom options to use
  // when verifying (note: verificationOptions should include a value for maxTokenAge as well).
  // verificationOptions = {
  //   maxTokenAge: `${maxAge}s`, // e.g. `${30 * 24 * 60 * 60}s` = 30 days
  //   algorithms: ['HS512']
  // },
}
```

You can use [node-jose-tools](https://www.npmjs.com/package/node-jose-tools) to generate keys on the command line and set them as environment variables, i.e. `jose newkey -s 256 -t oct -a HS512`.

**Option 2**: Specify custom encode/decode functions on the jwt object. This gives you complete control over signing / verification / etc.

#### JWT_AUTO_GENERATED_ENCRYPTION_KEY

## Adapter

### ADAPTER_TYPEORM_UPDATING_ENTITIES

This warning occurs when typeorm finds that the provided entities differ from the database entities. By default while not in `production` the typeorm adapter will always synchronize changes made to the entities codefiles. 

Disable this warning by setting `synchronize: false` in your typeorm config

Example:
```js title="/pages/api/auth/[...nextauth].js"
adapter: TypeORMLegacyAdapter({
  type: 'mysql',
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DB,
  synchronize: false
}),
```
