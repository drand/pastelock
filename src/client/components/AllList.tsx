import * as React from "react"
import {useEffect, useState} from "react"
import {APIConfig, fetchAll} from "../api"
import {Box, Typography} from "@mui/material"
import {SidebarEntry, SidebarEntryPanel} from "./SidebarPanel"
import {remapPlaintexts} from "./mappings"

type AllListProps = {
    config: APIConfig
}
export const AllList = (props: AllListProps) => {
    const [entries, setEntries] = useState<Array<SidebarEntry>>([])
    const [error, setError] = useState("")

    useEffect(() => {
        fetchAll(props.config)
            .then(ciphertexts => setEntries(remapPlaintexts(ciphertexts)))
            .catch(err => setError(`there was an error fetching ciphertexts ${err}`))
    }, []);

    return (
        <Box padding={2}>
            <Typography variant={"h5"}>All Ciphertexts</Typography>
            {entries.map(c => <SidebarEntryPanel entry={c}/>)}
            {entries.length === 0 && <Typography>There are no ciphertexts yet :(</Typography>}
            {!!error && <Typography color={"red"}>{error}</Typography>}
        </Box>
    )
}
