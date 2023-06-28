import * as React from "react"
import dayjs from "dayjs"
import {useCallback, useState} from "react"
import {Box, Button, CircularProgress, Stack, TextField, Typography} from "@mui/material"
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker"
import {APIConfig, encryptAndUpload} from "../api"
import {TagsInput} from "./TagsInput"

type EncryptFormProps = {
    config: APIConfig
}
export const EncryptForm = (props: EncryptFormProps) => {
    const [time, setTime] = useState(dayjs(formatDate(Date.now())))
    const [plaintext, setPlaintext] = useState("")
    const [ciphertext, setCiphertext] = useState("")
    const [tags, setTags] = useState<Array<string>>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const encryptAndStore = useCallback(() => {
        if (plaintext.trim() === "") {
            setError("You must enter a plaintext to encrypt")
            return
        }
        if (!time) {
            setError("You must enter a time")
            return
        }

        setError("")
        setIsLoading(true)
        encryptAndUpload(props.config, time.toDate().getTime(), plaintext, tags)
            .then(c => setCiphertext(c))
            .catch(err => setError(err.message))
            .then(() => setIsLoading(false))
    }, [plaintext, time])

    const clear = useCallback(() => {
        setTime(dayjs(formatDate(Date.now())))
        setPlaintext("")
        setCiphertext("")
        setError("")
        setTags([])
    }, [])

    let dateAdvisoryText = ""
    if (time.isBefore(dayjs(Date.now()).subtract(1, "minute"))) {
        dateAdvisoryText = "Note: time is in the past"
    }

    // this is a space so that the element doesn't disappear when there's a ciphertext and move the buttons around
    let ciphertextAdvisory = " "
    if (!ciphertext) {
        ciphertextAdvisory = "Ciphertext will appear once you hit upload"
    }

    return (
        <Box padding={2}>
            <Box paddingBottom={2}>
                <Typography>Pastelock is an application for timelock encrypting data and storing it in the
                    cloud. </Typography>
                <Typography>Your ciphertext will automatically be decrypted when the time comes, and published for
                    everybody
                    to see.</Typography>
                <Typography>You can find its source on <a
                    href="https://github.com/drand/pastelock">GitHub</a>.</Typography>
                <Typography>Don't want others to see your ciphertext? Want to encrypt a vulnerability report? Then check
                    out <a href="https://timevault.drand.love">Timevault</a></Typography>.
            </Box>
            <Box
                paddingBottom={2}
            >
                <DateTimePicker
                    label="Decryption Time"
                    value={time}
                    onChange={value => setTime(dayjs(value))}
                />
                <Typography
                    variant={"subtitle2"}
                    color={"warning.main"}
                >
                    {dateAdvisoryText}
                </Typography>
            </Box>
            <TagsInput
                max={5}
                tags={tags}
                onChange={t => setTags(t)}
            />
            <Stack
                direction={"row"}
                width={"100%"}
                spacing={2}
            >
                <TextField
                    label={"Plaintext"}
                    value={plaintext}
                    variant={"filled"}
                    fullWidth
                    onChange={event => setPlaintext(event.target.value)}
                    multiline
                    minRows={20}
                />
                <TextField
                    label={"Ciphertext"}
                    value={ciphertext}
                    helperText={ciphertextAdvisory}
                    variant={"filled"}
                    fullWidth
                    multiline
                    disabled
                    minRows={20}
                />
            </Stack>

            <Stack
                direction={"row"}
                spacing={2}
            >
                <Button
                    onClick={() => encryptAndStore()}
                    disabled={isLoading || plaintext === ""}
                    variant={"outlined"}
                >
                    Upload
                </Button>
                <Button
                    onClick={() => clear()}
                    disabled={plaintext === ""}
                    variant={"outlined"}
                >
                    Clear
                </Button>
                {isLoading && <CircularProgress/>}
            </Stack>
            {!!error && <Typography>{error}</Typography>}
        </Box>
    )
}

// for compatibility with the shitty `datetime-local` input
function formatDate(time: number): string {
    const t = new Date(time)
    return `${t.getFullYear()}-${padTo2Digits(t.getMonth() + 1)}-${padTo2Digits(t.getDate())} ${padTo2Digits(t.getHours())}:${padTo2Digits(t.getMinutes())}:${padTo2Digits(t.getSeconds())}`
}

function padTo2Digits(num: number) {
    return num.toString().padStart(2, "0")
}
