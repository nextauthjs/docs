---
id: testing-with-cypress
title: Testing with Cypress
---

There are different ways to test an implementation of NextAuth.js, depending on what you want to achieve.

This tutorial covers testing with [Cypress](https://www.cypress.io/), we plan to add more tutorials in the future on testing with [Playwirght](https://playwright.dev/) and [Jest](https://jestjs.io/).

When using Cypress, you can create a testing account in your staging and production environments and run Cypress to verify the login and logout flows work correctly.

You can also by-pass authentication in your Cypress tests, in case you want to test the "logged in" states of your application in a reliable way.

This tutorial covers both scenarios.

## Setup

[Installing Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress) is straightforward.

To get started, install the dependencies:

```
npm i -D cypress start-server-and-test @testing-library/cypress
```

Once done, run Cypress for the first time so it can [scaffold a new project](https://docs.cypress.io/guides/getting-started/writing-your-first-test) for you:

```
npx cypress open
```

We recommend you edit the `cypress.json` config file at the root project with the following config:

```json title="cypress.json"
{
  "baseUrl": "http://localhost:3000",
  "chromeWebSecurity": false
}
```

and create an Cypress environment file for storing the login details for Cypress:

```js title="cypress.env.json"
{
  "GITHUB_USER": "username@company.com",
  "GITHUB_PASSWORD": "password",
  "COOKIE_NAME": "next-auth.session-token",
  "SITE_NAME": "http://localhost:3000"
}
```

You'll also notice Cypress created a `cypress` folder in the root of your project. Now add the [`@testing-library/cypress` commands](https://github.com/testing-library/cypress-testing-library#usage) (is our recommended way for writing assertions in Cypress tests):

```js title="cypress/support/commands.js"
import "@testing-library/cypress/add-commands"
```

Finally, using [`start-server-and-test`](https://www.npmjs.com/package/start-server-and-test), let's create a script that will launch your application and, once ready, launch Cypress to run the tests against it:

```json title="package.json"
"scripts": {
  "dev": "next dev",
  "test:cy": "start-server-and-test dev https://localhost:3000 'npx cypress open'"
}
```

## Testing login flow

One our setup ready, we can start writing tests around our login flows:

```js title="cypress/integration/logging.spec.js"
describe("Logging flow", () => {
  beforeEach(() => {
    cy.visit("/")
  })

  it("logs in correctly", () => {
    cy.findByText("Sign in").click()
    cy.findByText("Sign in with Github").click()
  })
})
```

## By-passing login flow during tests

```bash npm2yarn
npm install --save-dev cypress cypress-social-logins @testing-library/cypress
```

:::note
If you are using username/password based login, you will not need the `cypress-social-login` dependency.
:::

Cypress will install and initialize the folder structure with example integration tests, a folder for plugins, etc.

Next you will have to create some configuration files for Cypress.

First, the primary cypress config:

```js title="cypress.json"
{
  "baseUrl": "http://localhost:3000",
  "chromeWebSecurity": false
}
```

This initial Cypress config will tell Cypress where to find your site on initial launch as well as allow it to open up URLs at domains that aren't your page, for example to be able to login to a social provider.

Second, a cypress file for environment variables. These can be defined in `cypress.json` under the key `env` as well, however since we're storing username / passwords in here we should keep those in a separate file and only commit `cypress.json` to version control, not `cypress.env.json`.

```js title="cypress.env.json"
{
  "GOOGLE_USER": "username@company.com",
  "GOOGLE_PW": "password",
  "COOKIE_NAME": "next-auth.session-token",
  "SITE_NAME": "http://localhost:3000"
}
```

You must change the login credentials you want to use, but you can also redefine the name of the `GOOGLE_*` variables if you're using a different provider. `COOKIE_NAME`, however, must be set to that value for NextAuth.js.

Third, if you're using the `cypress-social-login` plugin, you must add this to your `/cypress/plugins/index.js` file like so:

```js title="cypress/plugins/index.js"
const { GoogleSocialLogin } = require("cypress-social-logins").plugins

module.exports = (on, config) => {
  on("task", {
    GoogleSocialLogin: GoogleSocialLogin,
  })
}
```

Finally, you can also add the following npm scripts to your `package.json`:

```json
"test:e2e:open": "cypress open",
"test:e2e:run": "cypress run"
```

## Writing a test

Once we've got all that configuration out of the way, we can begin writing tests to login using NextAuth.js.

The basic login test looks like this:

```js title="cypress/integration/login.js"
describe("Login page", () => {
  before(() => {
    cy.log(`Visiting https://company.tld`)
    cy.visit("/")
  })
  it("Login with Google", () => {
    const username = Cypress.env("GOOGLE_USER")
    const password = Cypress.env("GOOGLE_PW")
    const loginUrl = Cypress.env("SITE_NAME")
    const cookieName = Cypress.env("COOKIE_NAME")
    const socialLoginOptions = {
      username,
      password,
      loginUrl,
      headless: true,
      logs: false,
      isPopup: true,
      loginSelector: `a[href="${Cypress.env(
        "SITE_NAME"
      )}/api/auth/signin/google"]`,
      postLoginSelector: ".unread-count",
    }

    return cy
      .task("GoogleSocialLogin", socialLoginOptions)
      .then(({ cookies }) => {
        cy.clearCookies()

        const cookie = cookies
          .filter((cookie) => cookie.name === cookieName)
          .pop()
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          })

          Cypress.Cookies.defaults({
            preserve: cookieName,
          })

          // remove the two lines below if you need to stay logged in
          // for your remaining tests
          cy.visit("/api/auth/signout")
          cy.get("form").submit()
        }
      })
  })
})
```

Things to note here include, that you must adjust the CSS selector defined under `postLoginSelector` to match a selector found on your page after the user is logged in. This is how Cypress knows whether it succeeded or not. Also, if you're using another provider, you will have to adjust the `loginSelector` URL.
