import {Client} from "pg"
import {Config} from "./config"
import {Ciphertext, Plaintext} from "./model"

type Row = {
    id: string
    created_at: number
    decryptable_at: number
    ciphertext: string
    plaintext_bytes: Buffer
    tags: string
    upload_type: "file" | "text" | undefined
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

export async function fetchAll(client: Client, limit = 1000): Promise<Array<Plaintext>> {
    const result = await client.query<Row>(selectAll, [limit])
    return result.rows.map(asPlaintext)
}
export async function fetchCiphertexts(client: Client, limit: number = 50): Promise<Array<Ciphertext>> {
    const result = await client.query<Row>(selectCiphertexts, [limit])
    return result.rows.map(asCiphertext)
}

export async function fetchPlaintexts(client: Client, limit: number = 50): Promise<Array<Plaintext>> {
    const result = await client.query<Row>(selectPlaintexts, [limit])
    return result.rows.map(asPlaintext)
}

export async function fetchEntry(client: Client, id: string): Promise<Plaintext> {
    const result = await client.query<Row>(selectSingle, [id])
    const row = result.rows[0]

    return asPlaintext(row)
}

export async function storeCiphertext(client: Client, ciphertext: string, decryptableAt: number, uploadType: "file" | "text", tags: Array<string>): Promise<Ciphertext> {
    const now = new Date()
    const result = await client.query(insertCiphertext, [now, new Date(decryptableAt), ciphertext, JSON.stringify(tags), uploadType])

    const row = result.rows[0]
    return asCiphertext(row)
}

export async function storePlaintext(client: Client, id: string, plaintext: Buffer) {
    return await client.query(updatePlaintext, [id, plaintext])
}

export async function fetchTaggedEntries(client: Client, tag: string): Promise<Array<Plaintext>> {
    const result = await client.query<Row>(selectTags, [JSON.stringify(tag)])

    return result.rows.map(asPlaintext)
}

function asPlaintext(row: Row): Plaintext {
    const bytes = row.plaintext_bytes ?? Buffer.from(new Uint8Array())
    return {
        id: row.id,
        createdAt: row.created_at,
        decryptableAt: row.decryptable_at,
        ciphertext: row.ciphertext,
        plaintext: bytes.toString("base64"),
        uploadType: row.upload_type ?? "text",
        tags: row.tags as any ?? []
    }
}

function asCiphertext(row: Row): Ciphertext {
    return {
        id: row.id,
        createdAt: row.created_at ?? Date.now(),
        decryptableAt: row.decryptable_at,
        ciphertext: row.ciphertext,
        tags: row.tags as any ?? [],
        uploadType: row.upload_type ?? "text",
    }
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
    
    -- this migrates old varchar plaintext to bytes
    DO $$
    BEGIN
        BEGIN
            ALTER TABLE ${tableName} ADD COLUMN plaintext_bytes BYTEA;
            ALTER TABLE ${tableName} ADD COLUMN upload_type VARCHAR;
            UPDATE ${tableName} SET upload_type = 'text';
            UPDATE ${tableName} SET plaintext_bytes = plaintext::BYTEA;
            ALTER TABLE ${tableName} DROP COLUMN plaintext;
        EXCEPTION
            WHEN duplicate_column THEN
        END;
    END $$;
`

const selectAll = `
    SELECT *
    FROM ${tableName}
    ORDER BY decryptable_at ASC
    LIMIT $1;
`

const selectCiphertexts = `
    SELECT *
    FROM ${tableName}
    WHERE plaintext_bytes IS NULL
    ORDER BY decryptable_at ASC
    LIMIT $1;
`
const selectPlaintexts = `
    SELECT *
    FROM ${tableName}
    WHERE plaintext_bytes IS NOT NULL
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
    INSERT INTO ${tableName} (created_at, decryptable_at, ciphertext, tags, upload_type) VALUES($1, $2, $3, $4, $5) RETURNING *
`

const updatePlaintext = `
    UPDATE ${tableName} SET plaintext_bytes = $2 WHERE id = $1
`

const selectTags = `
    SELECT *
    FROM ${tableName}
    WHERE tags @> $1::jsonb;
`
