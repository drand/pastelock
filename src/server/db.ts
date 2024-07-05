import {Client} from "pg"
import {Config} from "./config"
import {Ciphertext, Plaintext} from "./model"

type Row = {
    id: string
    created_at: number
    decryptable_at: number
    ciphertext: string
    plaintext: string
    tags: string
}

export async function createConnectedClient(config: Config): Promise<Client> {
    const client = new Client({
            host: config.dbURL,
            user: config.dbUsername,
            port: config.dbPort,
            database: config.dbName,
            password: config.dbPassword,
            ssl: config.ssl ? {rejectUnauthorized: false} : false
        }
    )

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
        ciphertext: it.ciphertext,
        tags: it.tags as any ?? []
    }))
}

export async function fetchPlaintexts(client: Client, limit: number = 50): Promise<Array<Plaintext>> {
    const result = await client.query<Row>(selectPlaintexts, [limit])
    return result.rows.map(it => ({
        id: it.id,
        createdAt: it.created_at,
        decryptableAt: it.decryptable_at,
        ciphertext: it.ciphertext,
        plaintext: it.plaintext,
        tags: it.tags as any ?? []
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
        plaintext: row.plaintext ?? "",
        tags: row.tags as any ?? []
    }
}

export async function storeCiphertext(client: Client, ciphertext: string, decryptableAt: number, tags: Array<string>): Promise<Ciphertext> {
    const now = new Date()
    const result = await client.query(insertCiphertext, [now, new Date(decryptableAt), ciphertext, JSON.stringify(tags)])

    const row = result.rows[0]
    return {
        id: row.id,
        createdAt: now.getTime(),
        decryptableAt,
        ciphertext,
        tags
    }
}

export async function storePlaintext(client: Client, id: string, plaintext: string) {
    return await client.query(updatePlaintext, [id, plaintext])
}

export async function fetchTaggedEntries(client: Client, tag: string): Promise<Array<Plaintext>> {
    const result = await client.query<Row>(selectTags, [JSON.stringify(tag)])

    return result.rows.map(row => ({
        id: row.id,
        createdAt: row.created_at,
        decryptableAt: row.decryptable_at,
        ciphertext: row.ciphertext,
        plaintext: row.plaintext ?? "",
        tags: row.tags as any ?? []
    }))
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
        plaintext VARCHAR,
        tags JSONB
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
    ORDER BY decryptable_at DESC
    LIMIT $1;
`
const selectSingle = `
    SELECT *
    FROM uploads
    WHERE id = $1
    LIMIT 1;
`
const insertCiphertext = `
    INSERT INTO ${tableName} (created_at, decryptable_at, ciphertext, tags) VALUES($1, $2, $3, $4) RETURNING *
`
const updatePlaintext = `
    UPDATE ${tableName} SET plaintext = $2 WHERE id = $1
`
const selectTags = `
    SELECT *
    FROM uploads
    WHERE tags @> $1::jsonb;
`
