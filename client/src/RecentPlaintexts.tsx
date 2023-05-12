import * as React from "react"
import {SidebarEntry, SidebarPanel} from "./SidebarPanel"
import {fetchPlaintexts} from "./api"
import {useCallback, useEffect, useState} from "react"
import {Plaintext} from "./model"

type RecentPlaintextsProps = {}
export const RecentPlaintexts = (props: RecentPlaintextsProps) => {
    const [plaintexts, setPlaintexts] = useState<SidebarEntry>([])

    const apiCall = useCallback(() => {
        fetchPlaintexts()
            .then(remapPlaintexts)
            .then((c) => setPlaintexts(c))
    }, [setPlaintexts])

    useEffect(() => {
        apiCall()

        const id = setInterval(() => {
            apiCall()
        }, 5000)
        return () => {
            clearInterval(id)
        }
    }, [])

    return <SidebarPanel
        title={"Recent decryptions"}
        values={plaintexts}
        onClick={entry => console.log(entry.id)}
    />
}

function remapPlaintexts(plaintexts: Array<Plaintext>): Array<SidebarEntry> {
    return plaintexts.map(it => ({
        id: it.id,
        time: it.decryptableAt,
        content: it.plaintext,
    }))
}