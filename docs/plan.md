## Tasks

- [ ] UI accomodation
  - [x] remove sign in and register page
  - [ ] change intro page (when user has not added any mailbox) to a "empty" page (Peng)
    - [ ] ask for new mailbox if there isn't one already
    - [ ] ask for openai api key if it is not already set
  - [x] migrate all `<Link>`s to open in an external browser
- [ ] UI improvement
  - [ ] "n more" display (Dongming, Peng)
    - [ ] set the left bar of the calendar page to be fixed
    - [ ] use one overflow bar other than two in the calendar page when there are so many events that the calendar overflows
    - [ ] fixed-height calendar cell?
  - [ ] more beautiful tooltip display when hovering over events?
  - [ ] responsive layout (Peng)
- [x] function migration (Dongming)
  - [x] change Outlook and Gmail's Oauth2 flow to the one suited for desktop application
  - [x] change database to local data
    - [x] update schema
    - [x] implement CRUD functionalities with JS/TS
    - [x] migrate data logic
  - [x] migrate fetch and clean email to JS/TS
  - [x] migrate LLM API calls to JS/TS
  - [x] update backend API calls to local services
- [ ] release
  - [ ] web
  - [ ] windows store
  - [ ] mac store