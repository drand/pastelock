import {Ciphertext, Plaintext} from "../model"
import {SidebarEntry} from "./SidebarPanel"

export function remapPlaintexts(plaintexts: Array<Plaintext>): Array<SidebarEntry> {
    return plaintexts.map(it => ({
        id: it.id,
        time: it.decryptableAt,
        content: it.plaintext,
        uploadType: it.uploadType,
        tags: it.tags
    }))
}

export function remapCiphertexts(ciphertexts: Array<Ciphertext>): Array<SidebarEntry> {
    return ciphertexts.map(it => ({
        id: it.id,
        time: it.decryptableAt,
        content: it.ciphertext,
        uploadType: it.uploadType,
        tags: it.tags
    }))
}