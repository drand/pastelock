# Pastelock

A social web-app for timelocking encrypting data, automatic decryption of it, and viewing ciphertexts/plaintexts others have uploaded.

## Quickstart
To spin up the whole application, run `docker compose build && docker compose up -d`.
This will start the app at `http://localhost:4444` and a postgres database at `postgresql://localhost:5342`.
You can then open [http://localhost:4444](http://localhost:4444) in your browser to start adding ciphertexts!
Encryption is performed locally before uploading to the server.
The UI is server rendered and hydrated in a light client bundle.

## Development

The API_URL is injected into the client at build time using either the `./build.dev.js` or `./build.prod.js` files.
Similarly, the scripts are split into `:dev` and `:prod` variants. Deploying to heroku will automatically build the production package.

## [./client](./client)

The client is a React app for timelock encrypting data in your browser and uploading it to an API server.
Other users of the API server can see your timelock encrypted ciphertext and will be able to see the plaintext once
decryption time has been reached.
It is server rendered by the server application.

## [./server](./server)

The server is a NodeJS app with an express API for submitting timelock encrypted ciphertexts, which it stores and
automatically decrypts and serves once the decryption time has been reached. It also server renders the React client application.

You will need to configure a postgres database before starting the dev server, and export the required env vars detailed in [the config file](./src/server/config.ts) (and below).

Start the local dev server by running `npm install && npm start:dev`. The default port is `4444`.

## Environment

The server requires a few environment variables set for running in production (or outside docker)

### DB_URL
The URL of the DB, with or without `postgres://`. Post unnecessary

### DB_PORT
The port the DB instance is using

### DB_NAME
The database name in which to store everything. This isn't automatically provisioned by the bootstrap (though is by docker compose).

### DB_USERNAME
The Username used to connect to the database

### DB_PASSWORD
The password used to connect to the database

### DB_SSL
Whether the DB supports TLS or not. Out of the box, it allows self-signed certs (as that's what Heroku uses).

## Deployment
Pastelock is hosted on heroku. First login to the heroku CLI then use `npm run deploy` to deploy to it.