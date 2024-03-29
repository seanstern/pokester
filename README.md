# 🃏 Pokester

**Description**: Pokester lets people play no-limit Texas hold'em for free with their friends using play money--on a computer, tablet, or phone.

**Tech Stack**: Pokester is a web application written primarily in [Typescript](https://www.typescriptlang.org/). It uses a [React](https://reactjs.org/) front-end and an [Express](https://expressjs.com/) back-end. It relies on [MongoDB](https://www.mongodb.com/) for data storage.

**Project Status**: Beta

**Homepage**: https://www.playpokester.com

## Dependencies

- [node@^16.17.1](https://nodejs.org/en/)
- [yarn@^3.2.2](https://yarnpkg.com/getting-started/install)

## Installation

To install all dependencies, run the following command from the root directory of the repository

`yarn`

## Configuration

The client and server each require the presence of the following configurable environment variables

### Client

_Note the following environment variables can be set by creating a `client/.env` file containing one `KEY=VALUE` pair on each line._

- `REACT_APP_BASE_URL`: The domain on which pokester will be hosted (e.g. local deployments might speicfy `http://localhost:3000` as the value); used for embedded full links in the client

### Server

_Note the following environment variables can be set by creating a `server/.env` file containing one `KEY=VALUE` pair on each line._

- `DISABLE_SSL`: optional boolean environment variable that disables use of SSL; reocommened that it be set to `TRUE` for local testing, **not set** in environments exposed to the internet
- `MONGOOSE_CONNECT`: [connection string for mongoDB](https://www.mongodb.com/docs/manual/reference/connection-string/) (e.g. local deployments might specify `mongodb://localhost:27017/pokester` as the value)
- `OPEN_ID_CONNECT_SECRET`: [client secret for express-openid-connect](https://auth0.github.io/express-openid-connect/interfaces/configparams.html#secret)
- `OPEN_ID_CONNECT_BASE_URL`: [base URL for express-openid-connect](https://auth0.github.io/express-openid-connect/interfaces/configparams.html#baseurl)
- `OPEN_ID_CONNECT_CLIENT_ID`: [client id for express-open-id-connect](https://auth0.github.io/express-openid-connect/interfaces/configparams.html#clientid)
- `OPEN_ID_CONNECT_ISSUER_BASE_URL`: [issuer base URL for express-open-id-connect](https://auth0.github.io/express-openid-connect/interfaces/configparams.html#issuerbaseurl)

## Usage

_The following instructions are useful for testing, running, and building the full applicaton. To test, run, and build individual workspaces, navigate to the respective workspace directories or use the appropriate [`yarn workspace`](https://yarnpkg.com/cli/workspace) commmand._

### Test

Run the following command from the root directory of the repository

`yarn workspaces foreach -t run test`

### Run in Development Mode

_Note: Development mode reloads client and server processes when edits are made to `/client/src/**` and `/server/src/**`, respectively._

Run the following command from the root directory of the repository

`yarn workspaces foreach -p run start`

### Build

Run the following command from the root directory of the repository

`yarn workspaces foreach -t run build`

### Run Optimized Production Build

After building, run the following command from the root directory of the repository

`yarn workspace @pokester/server run serve`

## Getting Help

Feel free to write contact@playpokester.com.

## License

[LICENSE.md](/LICENSE.md)
