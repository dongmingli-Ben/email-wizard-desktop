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

Rebuild the dependencies for `better-sqlite3` with [`electron/rebuild`](https://github.com/electron/rebuild):

```bash
# windows
.\node_modules\.bin\electron-rebuild.cmd
# mac/linux
$(npm bin)/electron-rebuild
```

Note that for developer, each time a new package is installed via `npm install`, you need to rebuilt the package with the above command.

Run the app with webpack dev server:

```bash
npm start
```

Package the app:

```bash
npm run package
```

## Architecture

![image](/docs/architecture.drawio.svg)
