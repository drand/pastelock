import {randomUUID} from "crypto"
import {mainnetClient, roundTime, timelockDecrypt} from "tlock-js"
import {MAINNET_CHAIN_INFO} from "tlock-js/drand/defaults"
import {decodeArmor, isProbablyArmored} from "tlock-js/age/armor"
import {readAge} from "tlock-js/age/age-reader-writer"
import {Ciphertext, ciphertextSchema, OrderedStore, Plaintext} from "./model"

type CiphertextsResponse = {
    ciphertexts: Array<Ciphertext>
}
type PlaintextsResponse = {
    plaintexts: Array<Plaintext>
}
type AddCiphertextResponse = {
    id: string
}

const attemptDecryptionMilliseconds = 1000

export class Service {
    ciphertextStore = new OrderedStore<Ciphertext>()
    plaintextStore = new OrderedStore<Plaintext>()

    async plaintexts(limit: number = 0): Promise<PlaintextsResponse> {
        const plaintexts = await this.plaintextStore.all(limit)

        return {plaintexts: plaintexts.slice(0, limit)}
    }

    async ciphertexts(limit: number = 0): Promise<CiphertextsResponse> {
        const ciphertexts = await this.ciphertextStore.all(limit)
        return {ciphertexts}
    }

    async addCiphertext(message: any): Promise<AddCiphertextResponse> {
        const validMessage = await ciphertextSchema.validate(message)
        let decodedCiphertext = Buffer.from(validMessage.ciphertext, "base64").toString()
        if (isProbablyArmored(decodedCiphertext)) {
            decodedCiphertext = decodeArmor(decodedCiphertext)
        }

        const decryptableAt = decryptionTime(decodedCiphertext)

        const id = await this.ciphertextStore.save({
            id: randomUUID(),
            createdAt: Date.now(),
            decryptableAt: decryptableAt,
            ciphertext: decodedCiphertext
        })
        return {id}
    }

    async startDecrypting() {
        setInterval(async () => {
            const next = await this.ciphertextStore.head()
            if (!next || next.decryptableAt > Date.now()) {
                console.log("nothing to decrypt")
                return
            }
            try {
                const plaintext = await timelockDecrypt(next.ciphertext, mainnetClient())
                await this.plaintextStore.save({
                    id: next.id,
                    createdAt: next.createdAt,
                    decryptableAt: next.decryptableAt,
                    plaintext
                })
                console.log("successfully decrypted a ciphertext")
            } catch (err) {
                console.error(`error decrypting cipher text ${next.id}`, err)
            }

            await this.ciphertextStore.remove(next.id)
        }, attemptDecryptionMilliseconds)
    }
}

function decryptionTime(ciphertext: string): number {
    const stanza = readAge(ciphertext).header.recipients.find(it => it.type === "tlock")
    if (!stanza) {
        throw Error("ciphertext was missing timelock stanza")
    }
    if (stanza.args.length != 2) {
        throw Error("incompatible stanza - must contain two arguments: round number and chainhash")
    }

    try {
        const roundNumber = Number.parseInt(stanza.args[0], 10)
        return roundTime(MAINNET_CHAIN_INFO, roundNumber)
    } catch (err) {
        throw Error("round number arg must be an integer!")
    }
}