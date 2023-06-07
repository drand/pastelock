import {roundAt} from "drand-client/util"
import {mainnetClient, timelockEncrypt, Buffer} from "tlock-js"
import {MAINNET_CHAIN_INFO} from "tlock-js/drand/defaults"
import {Ciphertext, Plaintext} from "./model"

const config = {
    pastelockURL: process.env.API_URL ?? "http://localhost:4444"
}

export async function encryptAndUpload(time: number, plaintext: string): Promise<string> {
    const roundNumber = roundAt(time, MAINNET_CHAIN_INFO)
    const ciphertext = await timelockEncrypt(roundNumber, Buffer.from(plaintext), mainnetClient())

    await fetch(`${config.pastelockURL}/ciphertexts`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            ciphertext: Buffer.from(ciphertext).toString("base64")
        })
    })

    return ciphertext
}

export async function fetchCiphertexts(): Promise<Array<Ciphertext>> {
    const limit = 5
    const response = await fetch(`${config.pastelockURL}/ciphertexts?limit=${limit}`)
    const json = await response.json()
    return json.ciphertexts
}

export async function fetchPlaintexts(): Promise<Array<Plaintext>> {
    const limit = 5
    const response = await fetch(`${config.pastelockURL}/plaintexts?limit=${limit}`)
    const json = await response.json()
    return json.plaintexts
}

export async function fetchEntry(id: string): Promise<Plaintext> {
    const response = await fetch(`${config.pastelockURL}/entry/${id}`)
    return await response.json()
}