# Email Wizard Desktop

A desktop version of [Email Wizard](https://github.com/dongmingli-Ben/email-wizard), built with Electron, React, Typescript, and Webpack.

## How to set up

Install `nodejs` and `npm`.

Then clone this repo:

```bash
git clone https://github.com/dongmingli-Ben/email-wizard-desktop.git
```

Install dependencies:

```bash
npm install
```

Run the app with webpack dev server:

```bash
npm start
```

Package the app:

```bash
npm run package
```

## Tasks

- [ ] UI accomodation
  - [ ] remove sign in and register page
  - [ ] change intro page (when user has not added any mailbox) to a "empty" page
  - [ ] migrate all `<Link>`s to open in an external browser
- [ ] UI improvement
  - [ ] set the left bar of the calendar page to be fixed
  - [ ] use one overflow bar other than two in the calendar page when there are so many events that the calendar overflows
  - [ ] fixed-height calendar cell?
  - [ ] more beautiful tooltip display when hovering over events?
  - [ ] responsive layout?
- [ ] function migration
  - [ ] change Outlook and Gmail's Oauth2 flow to the one suited for desktop application
  - [ ] change database to local data
    - [ ] update schema
    - [ ] implement CRUD functionalities with JS/TS
    - [ ] migrate data logic
  - [ ] migrate fetch and clean email to JS/TS
  - [ ] migrate LLM API calls to JS/TS
  - [ ] update backend API calls to local services
