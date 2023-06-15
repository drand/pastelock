import * as React from "react"
import * as ReactDOM from "react-dom"
import {BrowserRouter} from "react-router-dom"
import { App } from "./App"
import { Buffer } from "buffer"

// this polyfill is needed for tlock-js
// @ts-ignore
window.Buffer = Buffer

ReactDOM.hydrate(
    <React.StrictMode>
        <BrowserRouter >
            <App config={{ apiURL: "http://localhost:4444" }}/>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);
