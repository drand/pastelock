import * as yup from "yup"

export type Ciphertext = {
    id: string
    createdAt: number
    decryptableAt: number
    ciphertext: string
    tags: Array<string>
}

export const ciphertextSchema = yup.object({
    ciphertext: yup.string().required(),
    tags: yup.array().of(yup.string().required()).required()
}).required()

export type Plaintext = {
    id: string
    createdAt: number
    decryptableAt: number
    ciphertext: string
    plaintext: string
    tags: Array<string>
}
