# Deployment

Deploying NextAuth.js only requires a few steps.

# Vercel

1. Expose [System Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables).
2. Create `NEXTAUTH_SECRET` environment variable. The value should be something random, eg.: `openssl rand -base64 32` or https://generate-secret.vercel.app/32
3. Add your provider's client ID and client secret to environment variables. *(Skip this step if not using an [OAuth Provider](/configuration/providers/oauth))*
4. Deploy!

## Securing a preview deployment

Securing a preview deployment (with an OAuth provider) has some caveats, as most providers only allow a single redirect/callback URL, or you cannot set the value before publishing the site. Here are a few ways you can still use NextAuth.js to secure your Preview Deployments

### Using the Credentials Provider

...

https://github.com/nextauthjs/docs/issues/19