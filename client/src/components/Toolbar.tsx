import * as React from "react"
import {NavLink, useLocation} from "react-router-dom"
import {Box, Stack, Toolbar as MaterialToolbar, Typography} from "@mui/material"

export const Toolbar = () => {
    const location = useLocation()
    return (
        <MaterialToolbar disableGutters>
            <Stack
                direction={"row"}
                width={"100%"}
            >
                <Box width={1 / 10} p={2} pt={4}>
                    {location.pathname !== "/" ? <NavLink to={"/"}>Back to upload</NavLink> : ""}
                </Box>
                <Typography
                    variant={"h3"}
                    width={8 / 10}
                    align={"center"}
                    p={2}
                >
                    Pastelock
                </Typography>
                <Box width={1 / 10}></Box>
            </Stack>
        </MaterialToolbar>
    )
}