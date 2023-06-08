import * as yup from "yup";
export type Ciphertext = {
    id: string;
    createdAt: number;
    decryptableAt: number;
    ciphertext: string;
    tags: Array<string>;
};
export declare const ciphertextSchema: yup.ObjectSchema<{
    ciphertext: string;
    tags: string[];
}, yup.AnyObject, {
    ciphertext: undefined;
    tags: "";
}, "">;
export type Plaintext = {
    id: string;
    createdAt: number;
    decryptableAt: number;
    ciphertext: string;
    plaintext: string;
    tags: Array<string>;
};
