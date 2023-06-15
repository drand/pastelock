import { Client } from "pg";
import { Ciphertext, Plaintext } from "./model";
type CiphertextsResponse = {
    ciphertexts: Array<Ciphertext>;
};
type PlaintextsResponse = {
    plaintexts: Array<Plaintext>;
};
type AddCiphertextResponse = {
    id: string;
};
export declare class Service {
    private client;
    constructor(client: Client);
    plaintexts(limit?: number): Promise<PlaintextsResponse>;
    ciphertexts(limit?: number): Promise<CiphertextsResponse>;
    addCiphertext(message: any): Promise<AddCiphertextResponse>;
    byId(id: string): Promise<Plaintext>;
    startDecrypting(): Promise<void>;
}
export {};
