import * as React from "react"
import {useNavigate} from "react-router-dom"
import {Box, Paper, Typography} from "@mui/material"

export type SidebarEntry = {
    id: string
    time: number
    content: string
}
type SidebarPanelProps = {
    title: string
    values: Array<SidebarEntry>
}
export const SidebarPanel = (props: SidebarPanelProps) =>
    <Box padding={2}>
        <Typography variant={"h5"}>{props.title}</Typography>
        {props.values.map(it =>
            <SidebarEntryPanel
                entry={it}
            />
        )}
        {props.values.length === 0 && <Typography>There are no ciphertexts yet :(</Typography>}
    </Box>

type SidebarEntryProps = {
    entry: SidebarEntry
}
const SidebarEntryPanel = (props: SidebarEntryProps) => {
    const navigate = useNavigate()
    const dateTime = new Date(props.entry.time)
    const formattedTime = `${dateTime.toLocaleDateString()} ${dateTime.toLocaleTimeString()}`

    const charLimit = 50
    let content = ""
    if (props.entry.content.length <= charLimit) {
        content = props.entry.content
    } else {
        content = props.entry.content.slice(0, charLimit) + "..."
    }

    return (
        <Paper>
            <Box
                margin={1}
                padding={1}
                onClick={() => navigate(`/entry/${props.entry.id}`)}
                sx={{ cursor: "pointer" }}
            >
                <Typography>Time: {formattedTime}</Typography>
                <Typography>Content: {content}</Typography>
            </Box>
        </Paper>
    )
}
