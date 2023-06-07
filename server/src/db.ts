import {Client} from "pg"
import {Config} from "./config"
import {Ciphertext, Plaintext} from "./model"

type Row = {
    id: string
    created_at: number
    decryptable_at: number
    ciphertext: string
    plaintext: string
}

export async function createConnectedClient(config: Config): Promise<Client> {
    const client = new Client({
        host: config.dbURL,
        user: config.dbUsername,
        port: config.dbPort,
        database: config.dbName,
        password: config.dbPassword,
        ssl: true
    })
    await client.connect()
    await client.query(bootstrap)
    return client
}

export async function fetchCiphertexts(client: Client, limit: number = 50): Promise<Array<Ciphertext>> {
    const result = await client.query<Row>(selectCiphertexts, [limit])
    return result.rows.map(it => ({
        id: it.id,
        createdAt: it.created_at,
        decryptableAt: it.decryptable_at,
        ciphertext: it.ciphertext
    }))
}

export async function fetchPlaintexts(client: Client, limit: number = 50): Promise<Array<Plaintext>> {
    const result = await client.query<Row>(selectPlaintexts, [limit])
    return result.rows.map(it => ({
        id: it.id,
        createdAt: it.created_at,
        decryptableAt: it.decryptable_at,
        ciphertext: it.ciphertext,
        plaintext: it.plaintext
    }))
}

export async function fetchEntry(client: Client, id: string): Promise<Plaintext> {
    const result = await client.query<Row>(selectSingle, [id])
    const row = result.rows[0]
    return {
        id: row.id,
        createdAt: row.created_at,
        decryptableAt: row.decryptable_at,
        ciphertext: row.ciphertext,
        plaintext: row.plaintext ?? ""
    }
}

export async function storeCiphertext(client: Client, ciphertext: string, decryptableAt: number): Promise<Ciphertext> {
    const now = new Date()
    const result = await client.query(insertCiphertext, [now, new Date(decryptableAt), ciphertext])

    const row = result.rows[0]
    return {
        id: row.id,
        createdAt: now.getTime(),
        decryptableAt,
        ciphertext
    }
}

export async function storePlaintext(client: Client, id: string, plaintext: string) {
    return await client.query(updatePlaintext, [id, plaintext])
}

const tableName = "uploads"

const bootstrap = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS ${tableName}
    (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        created_at TIMESTAMP NOT NULL,
        decryptable_at TIMESTAMP NOT NULL,
        ciphertext VARCHAR NOT NULL,
        plaintext VARCHAR
    );
`

const selectCiphertexts = `
    SELECT *
    FROM ${tableName}
    WHERE plaintext IS NULL
    ORDER BY decryptable_at ASC
    LIMIT $1;
`

const selectPlaintexts = `
    SELECT *
    FROM ${tableName}
    WHERE plaintext IS NOT NULL
    ORDER BY decryptable_at ASC
    LIMIT $1;
`

const selectSingle = `
    SELECT *
    FROM uploads
    WHERE id = $1
    LIMIT 1;
`

const insertCiphertext = `
    INSERT INTO ${tableName} (created_at, decryptable_at, ciphertext) VALUES($1, $2, $3) RETURNING *
`
const updatePlaintext = `
    UPDATE ${tableName} SET plaintext = $2 WHERE id = $1
`
