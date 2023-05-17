import * as React from "react"
import {NavLink} from "react-router-dom"

export const Toolbar = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column"
        }}>
            <NavLink to={"/"}>Upload</NavLink>
        </div>
    )
}