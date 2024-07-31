import * as React from "react"
import {Route, Routes, useNavigate} from "react-router-dom"
import {Box, Button, Container, Stack} from "@mui/material"
import {ThemeProvider} from "@mui/material/styles"
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {themeOptions} from "./theme"
import {Toolbar} from "./components/Toolbar"
import {TlockEntry} from "./components/TlockEntry"
import {ErrorPage} from "./components/ErrorPage"
import {RecentPlaintexts} from "./components/RecentPlaintexts"
import {UpcomingEncryptions} from "./components/UpcomingEncryptions"
import {EncryptForm} from "./components/EncryptForm"
import {SearchForm} from "./components/SearchForm"
import {AllList} from "./components/AllList"

function App() {
    const config = {
        apiURL: process.env.API_URL ?? "http://localhost:4444"
    }

    const navigate = useNavigate()

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <ThemeProvider theme={themeOptions}>
                <Container maxWidth={"xl"} className={"App"}>
                    <Toolbar/>
                    <Stack direction={"row"}>
                        <Box width={3 / 4}>
                            <Routes>
                                <Route path="/" element={<EncryptForm config={config}/>}/>
                                <Route path="/entry/:id" element={<TlockEntry config={config}/>}/>
                                <Route path="/search" element={<SearchForm config={config}/>}/>
                                <Route path="/all" element={<AllList config={config}/>}/>
                                <Route path="/*" element={<ErrorPage/>}/>
                            </Routes>
                        </Box>
                        <Stack width={1 / 4}>
                            <Stack direction="row" spacing={6}>
                                <Button onClick={() => navigate("/search")}>Search tags</Button>
                                <Button onClick={() => navigate("/all")}>View all</Button>
                            </Stack>
                            <RecentPlaintexts config={config}/>
                            <UpcomingEncryptions config={config}/>
                        </Stack>
                    </Stack>
                </Container>
            </ThemeProvider>
        </LocalizationProvider>
    )
}

export {App}