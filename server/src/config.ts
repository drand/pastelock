export type Config = {
    dbURL: string
    dbPort: number,
    dbName: string,
    dbUsername: string
    dbPassword: string
    ssl: boolean
}

export function createConfig(): Config {
    console.log(process.env["DB_SSL"])
    return {
        dbURL: envOrExplode("DB_URL"),
        dbPort: Number.parseInt(envOrExplode("DB_PORT"), 10),
        dbName: envOrExplode("DB_NAME"),
        dbUsername: envOrExplode("DB_USERNAME"),
        dbPassword: envOrExplode("DB_PASSWORD"),
        ssl: !!process.env["DB_SSL"],
    }
}

function envOrExplode(key: string): string {
    const val = process.env[key]
    if (!val) {
        throw Error(`${key} must be set in the env to start`)
    }
    return val
}