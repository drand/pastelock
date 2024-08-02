import * as React from "react"
import {useParams} from "react-router-dom"
import {useCallback, useEffect, useState} from "react"
import {Button, Chip, Table, TableBody, TableCell, TableRow, TextField} from "@mui/material"
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
        if (!id) {
            return
        }
        setIsLoading(true)
        fetchEntry(props.config, id)
            .then(e => setEntry(e))
            .catch(err => {
                console.error(err)
                setEntry(undefined)
            })
            .then(() => setIsLoading(false))
    }, [id])

    const download = useCallback(() => {
        if (!entry || !entry.plaintext) {
            return
        }
        downloadFile(entry.id, Buffer.from(entry.plaintext, "base64"))
    }, [entry])

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
                    <TableCell>Tags</TableCell>
                    <TableCell>{entry.tags.map(it =>
                        <Chip
                            variant="filled"
                            label={it}
                        />
                    )}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Plaintext</TableCell>
                    <TableCell>
                        {entry.plaintext.length === 0
                            ? ""
                            : entry.uploadType === "text"
                                ? Buffer.from(entry.plaintext, "base64").toString("utf-8")
                                : <Button onClick={download}>Download File</Button>
                        }
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Ciphertext</TableCell>
                    <TableCell>
                        <TextField
                            value={entry.ciphertext}
                            variant={"filled"}
                            fullWidth
                            multiline
                            disabled
                            rows={20}
                        />
                    </TableCell>
                </TableRow>

            </TableBody>
        </Table>
    )
}

function downloadFile(id: string, file: Buffer) {
    const anchor = document.createElement("a")
    const blob = new Blob([file.buffer], {type: "application/octet-stream"})
    anchor.href = URL.createObjectURL(blob)
    anchor.download = id
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
}
