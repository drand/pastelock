import React from "react"
import {createRoot} from "react-dom/client"
import {EncryptForm} from "./EncryptForm"
import {UpcomingEncryptions} from "./UpcomingEncryptions"
import {RecentPlaintexts} from "./RecentPlaintexts"

createRoot(document.getElementById("container")).render(<App/>)

function App() {
    return (
        <div style={{
            display: "flex",
        }}>
            <div style={{
                flex: 2
            }}>
                <EncryptForm/>
            </div>
            <div style={{
                display: "flex",
                flexDirection: "column"
            }}>
                <RecentPlaintexts/>
                <UpcomingEncryptions/>
            </div>
        </div>
    )
}