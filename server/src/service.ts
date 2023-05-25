import {Client} from "pg"
import {mainnetClient, roundTime, timelockDecrypt} from "tlock-js"
import {MAINNET_CHAIN_INFO} from "tlock-js/drand/defaults"
import {decodeArmor, isProbablyArmored} from "tlock-js/age/armor"
import {readAge} from "tlock-js/age/age-reader-writer"
import {Ciphertext, ciphertextSchema, Plaintext} from "./model"
import {fetchCiphertexts, fetchEntry, fetchPlaintexts, storeCiphertext, storePlaintext} from "./db"

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
    constructor(private client: Client) {
    }

    async plaintexts(limit: number = 50): Promise<PlaintextsResponse> {
        const plaintexts = await fetchPlaintexts(this.client)

        return {plaintexts: plaintexts.slice(0, limit)}
    }

    async ciphertexts(limit: number = 50): Promise<CiphertextsResponse> {
        const ciphertexts = await fetchCiphertexts(this.client, limit)
        return {ciphertexts}
    }

    async addCiphertext(message: any): Promise<AddCiphertextResponse> {
        const validMessage = await ciphertextSchema.validate(message)
        let decodedCiphertext = Buffer.from(validMessage.ciphertext, "base64").toString()
        if (isProbablyArmored(decodedCiphertext)) {
            decodedCiphertext = decodeArmor(decodedCiphertext)
        }
        const decryptableAt = decryptionTime(decodedCiphertext)

        const ciphertext = await storeCiphertext(this.client, decodedCiphertext, decryptableAt)
        return {id: ciphertext.id}
    }

    async byId(id: string): Promise<Plaintext> {
        return fetchEntry(this.client, id)
    }

    async startDecrypting() {
        setInterval(async () => {
            // this is out here so we can rollback in the `catch`
            let next: Ciphertext | undefined
            try {
                const results = await fetchCiphertexts(this.client, 1)
                next = results[0]
                if (!next || next.decryptableAt > Date.now()) {
                    console.log("nothing to decrypt")
                    return
                }
                const plaintext = await timelockDecrypt(next.ciphertext, mainnetClient())
                await storePlaintext(this.client, next.id, plaintext)
                console.log("successfully decrypted a ciphertext")
            } catch (err) {
                if (!next) {
                    return
                }
                console.error(`error decrypting cipher text ${next.id}`, err)
                await storePlaintext(this.client, next.id, "the payload was undecryptable")
                // we assume it's a malicious upload until there's an easy way to validate the ciphertext is valid :)
            }
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