export type Ciphertext = {
    id: string
    createdAt: number
    decryptableAt: number
    ciphertext: string
    tags: Array<string>
}

export type Plaintext = {
    id: string
    createdAt: number
    decryptableAt: number
    ciphertext: string
    plaintext: string
    tags: Array<string>
}