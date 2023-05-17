import * as React from "react"
import {PropsWithChildren} from "react"

export const Stacked = (props: PropsWithChildren) => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            {props.children}
        </div>
    )
}

export const SideBySide = (props: PropsWithChildren) =>
    <div style={{
        display: "flex",
        flexDirection: "row"
    }}>
        {props.children}
    </div>