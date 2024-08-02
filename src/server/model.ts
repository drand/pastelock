import * as yup from "yup"

export type Ciphertext = {
    id: string
    createdAt: number
    decryptableAt: number
    ciphertext: string
    tags: Array<string>
    uploadType: "file" | "text"
}

export const ciphertextSchema = yup.object({
    uploadType: yup.string().oneOf(["file", "text"]).required(),
    ciphertext: yup.string().required(),
    tags: yup.array().of(yup.string().required()).required()
}).required()

export type Plaintext = {
    id: string
    createdAt: number
    decryptableAt: number
    ciphertext: string
    plaintext: string
    uploadType: "file" | "text"
    tags: Array<string>
}
