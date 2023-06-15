import {roundAt} from "drand-client/util"
import {mainnetClient, timelockEncrypt, Buffer} from "tlock-js"
import {MAINNET_CHAIN_INFO} from "tlock-js/drand/defaults"
import {Ciphertext, Plaintext} from "./model"

export type APIConfig = {
    apiURL: string
}

export async function encryptAndUpload(config: APIConfig, time: number, plaintext: string, tags: Array<string>): Promise<string> {
    const roundNumber = roundAt(time, MAINNET_CHAIN_INFO)
    const ciphertext = await timelockEncrypt(roundNumber, Buffer.from(plaintext), mainnetClient())

    await fetch(`${config.apiURL}/ciphertexts`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            ciphertext: Buffer.from(ciphertext).toString("base64"),
            tags,
        })
    })

    return ciphertext
}

export async function fetchCiphertexts(config: APIConfig): Promise<Array<Ciphertext>> {
    const limit = 5
    const response = await fetch(`${config.apiURL}/ciphertexts?limit=${limit}`)
    const json = await response.json()
    return json.ciphertexts
}

export async function fetchPlaintexts(config: APIConfig): Promise<Array<Plaintext>> {
    const limit = 5
    const response = await fetch(`${config.apiURL}/plaintexts?limit=${limit}`)
    const json = await response.json()
    return json.plaintexts
}

export async function fetchEntry(config: APIConfig, id: string): Promise<Plaintext> {
    const response = await fetch(`${config.apiURL}/entry/${id}`)
    return await response.json()
}

export async function fetchTags(config: APIConfig, tag: string): Promise<Array<Plaintext>> {
    const response = await fetch(`${config.apiURL}/tags/?search=${tag}`)
    const json = await response.json()
    return json.entries
}