export type Ciphertext = {
    id: string
    createdAt: number
    decryptableAt: number
    ciphertext: string
    uploadType: "file" | "text"
    tags: Array<string>
}

export type Plaintext = {
    id: string
    createdAt: number
    decryptableAt: number
    ciphertext: string
    plaintext: string
    uploadType: "file" | "text"
    tags: Array<string>
}