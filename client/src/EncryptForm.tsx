import * as React from "react"
import {PropsWithChildren, useCallback, useState} from "react"
import {encryptAndUpload} from "./api"

type EncryptFormProps = {}
export const EncryptForm = (props: EncryptFormProps) => {
    const [time, setTime] = useState<string>(formatDate(Date.now()))
    const [plaintext, setPlaintext] = useState("")
    const [ciphertext, setCiphertext] = useState("")
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
        encryptAndUpload(Date.parse(time), plaintext)
            .then(c => setCiphertext(c))
            .catch(err => setError(err.message))
            .then(() => setIsLoading(false))
    }, [plaintext, time])

    const clear = useCallback(() => {
        setTime(formatDate(Date.now()))
        setPlaintext("")
        setCiphertext("")
        setError("")
    }, [])

    return (
        <div>
            <input
                type={"datetime-local"}
                value={time}
                onChange={event => setTime(event.target.value)}
            />
            <textarea
                value={plaintext}
                onChange={event => setPlaintext(event.target.value)}
            />
            <textarea
                value={ciphertext}
                readOnly
            />
            <button
                onClick={() => encryptAndStore()}
                disabled={isLoading}
            >
                Upload
            </button>
            <button
                onClick={() => clear()}
            >
                Clear
            </button>

            {!!isLoading && <p>Loading...</p>}
            {!!error && <Error>{error}</Error>}
        </div>
    )
}

const Error = (props: PropsWithChildren) =>
    <p style={{color: "red "}}>{props.children}</p>

// for compatibility with the shitty `datetime-local` input
function formatDate(time: number): string {
    const t = new Date(time)
    return `${t.getFullYear()}-${padTo2Digits(t.getMonth() + 1)}-${padTo2Digits(t.getDate())} ${padTo2Digits(t.getHours())}:${padTo2Digits(t.getMinutes())}:${padTo2Digits(t.getSeconds())}`
}

function padTo2Digits(num: number) {
    return num.toString().padStart(2, "0")
}
