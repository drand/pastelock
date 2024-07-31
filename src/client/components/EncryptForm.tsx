import * as React from "react"
import dayjs from "dayjs"
import {useCallback, useEffect, useState} from "react"
import {Buffer} from "tlock-js"
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel, FormLabel, Radio,
    RadioGroup,
    Stack,
    TextField,
    Typography
} from "@mui/material"
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker"
import {APIConfig, encryptAndUpload} from "../api"
import {TagsInput} from "./TagsInput"
import {FileInput} from "./FileInput"

type EncryptFormProps = {
    config: APIConfig
}

export const EncryptForm = (props: EncryptFormProps) => {
    const [time, setTime] = useState(dayjs(formatDate(Date.now())))
    const [plaintext, setPlaintext] = useState("")
    const [uploadType, setUploadType] = useState("text")
    const [file, setFile] = useState<File>()
    const [bytes, setBytes] = useState<Buffer>()
    const [ciphertext, setCiphertext] = useState("")
    const [tags, setTags] = useState<Array<string>>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // sets the `bytes` var and clears the `plaintext` var if a file is uploaded
    useEffect(() => {
        if (!file) {
            return
        }

        file.arrayBuffer()
            .then(buf => setBytes(Buffer.from(buf)))
    }, [file])

    // sets the `bytes` var and clears the `file` var if text is input
    useEffect(() => {
        if (!plaintext) {
            return
        }

        setBytes(Buffer.from(plaintext))
    }, [plaintext]);

    // changing the upload type resets everything
    useEffect(() => {
        setCiphertext("")
        setPlaintext("")
        setFile(undefined)
        setBytes(undefined)
    }, [uploadType]);

    // called when a file is uploaded
    const extractFile = (files: FileList) => {
        if (files.length !== 1) {
            setError("you must upload a single file")
            return
        }
        // let's automatically add a "file" tag as well
        setTags([...tags.filter(t => t === "file"), "file"])
        setFile(files[0])
    }

    const encryptAndStore = useCallback(() => {
        if (!bytes) {
            setError("you must upload text or a file")
            return
        }
        if (!time) {
            setError("You must enter a time")
            return
        }
        if (!uploadType) {
            setError("somehow you deselected upload type")
            return
        }

        setError("")
        setIsLoading(true)
        encryptAndUpload(props.config, time.toDate().getTime(), uploadType, bytes, tags)
            .then(c => setCiphertext(c))
            .catch(err => setError(err.message))
            .then(() => setIsLoading(false))
    }, [time, bytes])

    const clear = useCallback(() => {
        setTime(dayjs(formatDate(Date.now())))
        setPlaintext("")
        setBytes(undefined)
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
                <Typography>Don't want others to see your ciphertext? Want to encrypt a vulnerability report? Check
                    out <a href="https://timevault.drand.love">Timevault</a></Typography>!
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
                spacing={2}>
                <FormControl fullWidth>
                    <FormLabel>Type</FormLabel>
                    <RadioGroup
                        row
                        defaultValue={"text"}
                        value={uploadType}
                        onChange={event => setUploadType(event.target.value)}
                    >
                        <FormControlLabel value="text" control={<Radio/>} label={"Text"}/>
                        <FormControlLabel value="file" control={<Radio/>} label={"File"}/>
                    </RadioGroup>
                </FormControl>
            </Stack>
            <Stack
                direction={"row"}
                width={"100%"}
                spacing={2}
            >
                <Box flex={1}>
                    {uploadType === "text" && <TextField
                        label={"Plaintext"}
                        value={plaintext}
                        variant={"filled"}
                        fullWidth
                        onChange={event => setPlaintext(event.target.value)}
                        multiline
                        minRows={20}
                    />
                    }
                    {uploadType === "file" && <FileInput onChange={extractFile}/>}
                </Box>
                <Box flex={1}>
                    <TextField
                        label={"Ciphertext"}
                        value={ciphertext}
                        helperText={ciphertextAdvisory}
                        variant={"filled"}
                        fullWidth
                        multiline
                        disabled
                        rows={20}
                    />
                </Box>
            </Stack>

            <Stack
                direction={"row"}
                spacing={2}
            >
                <Button
                    onClick={() => encryptAndStore()}
                    disabled={isLoading || (plaintext === "" && !file)}
                    variant={"outlined"}
                >
                    Upload
                </Button>
                <Button
                    onClick={() => clear()}
                    disabled={plaintext === "" && !file}
                    variant={"outlined"}
                >
                    Clear
                </Button>
                {isLoading && <CircularProgress/>}
            </Stack>
            {!!error && <Typography color={"red"}>{error}</Typography>}
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
