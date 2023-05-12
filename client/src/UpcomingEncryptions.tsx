import * as React from "react"
import {useCallback, useEffect, useState} from "react"
import {SidebarEntry, SidebarPanel} from "./SidebarPanel"
import {fetchCiphertexts} from "./api"
import {Ciphertext} from "./model"

type UpcomingEncryptionsProps = {}
export const UpcomingEncryptions = (props: UpcomingEncryptionsProps) => {
    const [ciphertexts, setCiphertexts] = useState<SidebarEntry>([])

    const apiCall = useCallback(() => {
        fetchCiphertexts()
            .then(remapCiphertexts)
            .then((c) => setCiphertexts(c))
    }, [setCiphertexts])

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
        title={"Upcoming decryptions"}
        values={ciphertexts}
        onClick={entry => console.log(entry.id)}
    />
}

function remapCiphertexts(ciphertexts: Array<Ciphertext>): Array<SidebarEntry> {
    return ciphertexts.map(it => ({
        id: it.id,
        time: it.decryptableAt,
        content: it.ciphertext
    }))
}