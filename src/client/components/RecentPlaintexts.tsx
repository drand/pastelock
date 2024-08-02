import * as React from "react"
import {useCallback, useEffect, useState} from "react"
import {SidebarEntry, SidebarPanel} from "./SidebarPanel"
import {APIConfig, fetchPlaintexts} from "../api"
import {remapPlaintexts} from "./mappings"

const refreshTimeMs = 10000

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
