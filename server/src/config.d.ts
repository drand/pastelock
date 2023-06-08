export type Config = {
    dbURL: string;
    dbPort: number;
    dbName: string;
    dbUsername: string;
    dbPassword: string;
    ssl: boolean;
};
export declare function createConfig(): Config;
