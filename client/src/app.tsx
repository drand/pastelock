import React from "react"
import {createRoot} from "react-dom/client"
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom"
import {Box, Container, Stack} from "@mui/material"
import {ThemeProvider} from "@mui/material/styles"
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {themeOptions} from "./theme"
import {EncryptForm} from "./components/EncryptForm"
import {UpcomingEncryptions} from "./components/UpcomingEncryptions"
import {RecentPlaintexts} from "./components/RecentPlaintexts"
import {TlockEntry} from "./components/TlockEntry"
import {Toolbar} from "./components/Toolbar"
import {ErrorPage} from "./components/ErrorPage"

const router = createBrowserRouter([{
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>,
    children: [{
        path: "",
        element: <EncryptForm/>,
        errorElement: <ErrorPage/>
    }, {
        path: "entry/:id",
        element: <TlockEntry/>,
        errorElement: <ErrorPage/>
    }]
}, {
    path: "/*",
    element: <ErrorPage/>,
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
        <Container maxWidth={"xl"} className={"App"}>
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