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
    plaintext: string
}

type OrderableItem = {
    id: string
    decryptableAt: number
}

export class OrderedStore<T extends OrderableItem> {
    store: Array<T> = []

    async save(item: T): Promise<string> {
        this.store.push(item)
        this.store = this.store.slice().sort((a, b) => b.decryptableAt - a.decryptableAt)
        return item.id
    }

    async all(): Promise<Array<T>> {
        return this.store.slice()
    }

    async get(id: string): Promise<T> {
        this.store.forEach(item => {
            if (item.id === id) {
                return item
            }
        })

        return Promise.reject("Item not found")
    }

    async head(): Promise<T> {
        return this.store[0]
    }


    async remove(id: string): Promise<void> {
        this.store = this.store.filter(item => item.id !== id)
        return
    }
}
