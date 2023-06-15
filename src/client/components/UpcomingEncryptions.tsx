import * as React from "react"
import {useCallback, useEffect, useState} from "react"
import {SidebarEntry, SidebarPanel} from "./SidebarPanel"
import {APIConfig, fetchCiphertexts} from "../api"
import {Ciphertext} from "../model"

const refreshTimeMs = 5000
type UpcomingEncryptionsProps = {
    config: APIConfig
}
export const UpcomingEncryptions = (props: UpcomingEncryptionsProps) => {
    const [ciphertexts, setCiphertexts] = useState<Array<SidebarEntry>>([])

    const apiCall = useCallback(() => {
        fetchCiphertexts(props.config)
            .then(remapCiphertexts)
            .then((c) => setCiphertexts(c))
    }, [setCiphertexts])

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
        title={"Upcoming decryptions"}
        values={ciphertexts}
    />
}

function remapCiphertexts(ciphertexts: Array<Ciphertext>): Array<SidebarEntry> {
    return ciphertexts.map(it => ({
        id: it.id,
        time: it.decryptableAt,
        content: it.ciphertext,
        tags: it.tags
    }))
}