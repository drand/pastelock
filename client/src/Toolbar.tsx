import * as React from "react"
import {NavLink} from "react-router-dom"

import {Toolbar as MaterialToolbar} from "@mui/material"

export const Toolbar = () => {
    return (
        <MaterialToolbar>
            <NavLink to={"/"}>Upload</NavLink>
        </MaterialToolbar>
    )
}