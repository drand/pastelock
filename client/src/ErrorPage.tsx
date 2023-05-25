import React from "react"
import {useRouteError} from "react-router-dom"
import {Stack, Typography} from "@mui/material"

export const ErrorPage = () => {
    const error = useRouteError()
    if (error) {
        console.error(error)
    }

    return (
        <Stack alignItems={"center"}>
            <Typography variant={"h1"}>Oops!</Typography>
            <Typography>Sorry, an unexpected error has occurred.</Typography>
            <Typography>
                <i>{error}</i>
            </Typography>
        </Stack>
    )
}