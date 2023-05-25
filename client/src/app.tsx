import React from "react"
import {createRoot} from "react-dom/client"
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom"
import {Box, Container, Stack} from "@mui/material"
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {themeOptions} from "./theme"
import {EncryptForm} from "./EncryptForm"
import {UpcomingEncryptions} from "./UpcomingEncryptions"
import {RecentPlaintexts} from "./RecentPlaintexts"
import {TlockEntry} from "./TlockEntry"
import {Toolbar} from "./Toolbar"
import {ThemeProvider} from "@mui/material/styles"

const router = createBrowserRouter([{
    path: "/",
    element: <App/>,
    children: [{
        path: "",
        element: <EncryptForm/>
    }, {
        path: "entry/:id",
        element: <TlockEntry/>
    }]
}])

createRoot(document.getElementById("container")).render(
    <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={themeOptions}>
                <RouterProvider router={router}>
                    <App/>
                </RouterProvider>
            </ThemeProvider>
        </LocalizationProvider>
    </React.StrictMode>
)

function App() {
    return (
        <Container maxWidth={"xl"}  className={"App"}>
            <Toolbar/>
            <Stack direction={"row"}>
                <Box width={3 / 4}>
                    <Outlet/>
                </Box>
                <Stack width={1 / 4}>
                    <RecentPlaintexts/>
                    <UpcomingEncryptions/>
                </Stack>
            </Stack>
        </Container>
    )
}