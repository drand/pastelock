import * as React from "react"
import {useCallback, useEffect, useState} from "react"
import {SidebarEntry, SidebarPanel} from "./SidebarPanel"
import {fetchPlaintexts} from "../api"
import {Plaintext} from "../model"

const refreshTimeMs = 5000
export const RecentPlaintexts = () => {
    const [plaintexts, setPlaintexts] = useState<SidebarEntry[]>([])

    const apiCall = useCallback(() => {
        fetchPlaintexts()
            .then(remapPlaintexts)
            .then((c) => setPlaintexts(c))
    }, [setPlaintexts])

    useEffect(() => {
        apiCall()

        const id = setInterval(() => {
            apiCall()
        }, refreshTimeMs)
        return () => {
            clearInterval(id)
        }
    }, [])

    return <SidebarPanel
        title={"Recent decryptions"}
        values={plaintexts}
    />
}

function remapPlaintexts(plaintexts: Array<Plaintext>): Array<SidebarEntry> {
    return plaintexts.map(it => ({
        id: it.id,
        time: it.decryptableAt,
        content: it.plaintext,
        tags: it.tags
    }))
}