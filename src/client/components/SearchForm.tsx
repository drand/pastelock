import * as React from "react"
import {Box, CircularProgress, TextField, Typography} from "@mui/material"
import {APIConfig, fetchTags} from "../api"
import {useEffect, useState} from "react"
import {Plaintext} from "../model"
import {SidebarEntry, SidebarPanel} from "./SidebarPanel"

type SearchFormProps = {
    config: APIConfig
}
export const SearchForm = (props: SearchFormProps) => {
    const [query, setQuery] = useState("")
    const [isLoading, setLoading] = useState(false)
    const [results, setResult] = useState<Array<Plaintext>>([])

    useEffect(() => {
        if (!query) {
            return
        }
        setLoading(true)
        // this is set with timeout to debounce user input
        const inflight = setTimeout(() =>
                fetchTags(props.config, query)
                    .then(results => setResult(results))
                    .catch(err => console.error(err))
                    .finally(() => setLoading(false))
            , 300)

        return () => clearTimeout(inflight)
    }, [query])

    return (
        <Box>
            <TextField
                label={"Search"}
                value={query}
                variant={"filled"}
                fullWidth
                onChange={event => setQuery(event.target.value)}
            />

            <Box padding={1}>
                {query === ""
                    ? <Typography>Enter a tag to search by</Typography>
                    : isLoading
                        ? <Box padding={1}>
                            <CircularProgress/>
                        </Box>
                        : results.length === 0
                            ? <Typography>No results found</Typography>
                            : <Box>
                                <SidebarPanel title={""} values={remapPlaintexts(results)}/>
                            </Box>
                }
            </Box>

        </Box>
    )
}

function remapPlaintexts(plaintexts: Array<Plaintext>): Array<SidebarEntry> {
    return plaintexts.map(it => ({
        id: it.id,
        time: it.decryptableAt,
        content: it.plaintext,
        tags: it.tags
    }))
}