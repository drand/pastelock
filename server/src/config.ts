export type Config = {
    dbURL: string
    dbPort: number,
    dbUsername: string
    dbPassword: string
}

export function createConfig(): Config {
    return {
        dbURL: envOrExplode("DB_URL"),
        dbPort: Number.parseInt(envOrExplode("DB_PORT"), 10),
        dbUsername: envOrExplode("DB_USERNAME"),
        dbPassword: envOrExplode("DB_PASSWORD"),
    }
}

function envOrExplode(key: string): string {
    const val = process.env[key]
    if (!val) {
        throw Error(`${key} must be set in the env to start`)
    }
    return val
}