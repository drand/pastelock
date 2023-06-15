import { Client } from "pg";
import { Config } from "./config";
import { Ciphertext, Plaintext } from "./model";
export declare function createConnectedClient(config: Config): Promise<Client>;
export declare function fetchCiphertexts(client: Client, limit?: number): Promise<Array<Ciphertext>>;
export declare function fetchPlaintexts(client: Client, limit?: number): Promise<Array<Plaintext>>;
export declare function fetchEntry(client: Client, id: string): Promise<Plaintext>;
export declare function storeCiphertext(client: Client, ciphertext: string, decryptableAt: number, tags: Array<string>): Promise<Ciphertext>;
export declare function storePlaintext(client: Client, id: string, plaintext: string): Promise<import("pg").QueryResult<any>>;
