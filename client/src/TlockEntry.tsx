import * as React from "react"
import {useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import {fetchEntry} from "./api"
import {Plaintext} from "./model"

type TlockEntryProps = {}

export const TlockEntry = (props: TlockEntryProps) => {
    const {id} = useParams()
    const [entry, setEntry] = useState<Plaintext>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetchEntry(id)
            .then(e => setEntry(e))
            .catch(err => {
                console.error(err)
                setEntry(undefined)
            })
            .then(() => setIsLoading(false))
    }, [id])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!entry) {
        return <div>No such entry</div>
    }
    return (
        <table>
            <tr>
                <td>Created at</td>
                <td>{entry.createdAt}</td>
            </tr>
            <tr>
                <td>
                    {entry.decryptableAt < Date.now() ? "Decrypted at" : "Decryptable at"}
                </td>
                <td>{entry.decryptableAt}</td>
            </tr>
            <tr>
                <td>Ciphertext</td>
                <td>{entry.ciphertext}</td>
            </tr>
            <tr>
                <td>Plaintext</td>
                <td>{entry.plaintext}</td>
            </tr>
        </table>
    )
}