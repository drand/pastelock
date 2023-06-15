import * as React from "react"
import {useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import {Chip, Table, TableBody, TableCell, TableRow} from "@mui/material"
import {APIConfig, fetchEntry} from "../api"
import {Plaintext} from "../model"

type TlockEntryProps = {
    config: APIConfig
}
export const TlockEntry = (props: TlockEntryProps) => {
    const {id} = useParams()
    const [entry, setEntry] = useState<Plaintext>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        fetchEntry(props.config, id)
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
        <Table width={"100%"}>
            <TableBody>
                <TableRow>
                    <TableCell>Created at</TableCell>
                    <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        {entry.decryptableAt < Date.now() ? "Decrypted at" : "Decryptable at"}
                    </TableCell>
                    <TableCell>{new Date(entry.decryptableAt).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Ciphertext</TableCell>
                    <TableCell>{entry.ciphertext}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Plaintext</TableCell>
                    <TableCell>{entry.plaintext}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Tags</TableCell>
                    <TableCell>{entry.tags.map(it =>
                        <Chip
                            variant="filled"
                            label={it}
                        />
                    )}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}