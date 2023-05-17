import * as yup from "yup"

export type Ciphertext = {
    id: string
    createdAt: number
    decryptableAt: number
    ciphertext: string
}

export const ciphertextSchema = yup.object({
    ciphertext: yup.string().required()
}).required()

export type Plaintext = {
    id: string
    createdAt: number
    decryptableAt: number
    ciphertext: string
    plaintext: string
}
