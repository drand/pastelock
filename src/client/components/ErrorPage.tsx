import React from "react"
import {Stack, Typography} from "@mui/material"

export const ErrorPage = () => {
    return (
        <Stack alignItems={"center"}>
            <Typography variant={"h1"}>Oops!</Typography>
            <Typography>Sorry, an unexpected error has occurred.</Typography>
        </Stack>
    )
}