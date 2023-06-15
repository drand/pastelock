import * as React from "react"
import {useCallback, useEffect, useState} from "react"
import {SidebarEntry, SidebarPanel} from "./SidebarPanel"
import {APIConfig, fetchPlaintexts} from "../api"
import {Plaintext} from "../model"

const refreshTimeMs = 5000

type RecentPlaintextsProps = {
    config: APIConfig
}
export const RecentPlaintexts = (props: RecentPlaintextsProps) => {
    const [plaintexts, setPlaintexts] = useState<SidebarEntry[]>([])

    const apiCall = useCallback(() => {
        fetchPlaintexts(props.config)
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