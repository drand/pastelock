# Pastelock

A social web-app for timelocking encrypting data, automatic decryption of it, and viewing ciphertexts/plaintexts others have uploaded.

## Quickstart
To spin up the whole application, run `docker compose build && docker compose up -d`.
This will start the UI at `http://localhost:1234`, the API at `http://localhost:4444` and a postgres database at `postgresql://localhost:5342`.
You can then open [http://localhost:1234](http://localhost:1234) in your browser to start adding ciphertexts!
Encryption is performed locally before uploading to the server.


## Development

## [./client](./client)

The client is a React app for timelock encrypting data in your browser and uploading it to an API server.
Other users of the API server can see your timelock encrypted ciphertext and will be able to see the plaintext once
decryption time has been reached.

Start the client by running `cd client && npm install && npm start`. The default port is `1234`.

## [./server](./server)

The server is a NodeJS app with an express API for submitting timelock encrypted ciphertexts, which it stores and
automatically decrypts and serves once the decryption time has been reached.

Start the server by running `cd server && npm install && npm start`. The default port is `4444`.

