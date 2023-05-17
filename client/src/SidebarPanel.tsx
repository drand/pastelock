import * as React from "react"
import {Link} from "react-router-dom"

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
    <div>
        <h3>{props.title}</h3>
        {props.values.map(it =>
            <SidebarEntryPanel
                entry={it}
            />
        )}
        {props.values.length === 0 && <p>There are no ciphertexts yet :(</p>}
    </div>

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
            <p>Time: {formattedTime}</p>
            <p>Content: {content}</p>
        </Link>
    )
}
