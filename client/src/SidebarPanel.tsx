import * as React from "react"
import {Link} from "react-router-dom"
import {Box, Typography} from "@mui/material"

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
    <Box>
        <Typography variant={"h4"}>{props.title}</Typography>
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
        <Link to={`/entry/${props.entry.id}`}>
            <Typography>Time: {formattedTime}</Typography>
            <Typography>Content: {content}</Typography>
        </Link>
    )
}
