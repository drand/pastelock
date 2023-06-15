import * as React from "react"
import {StaticRouter} from "react-router-dom/server"
import express = require("express")
import {App} from "../client/App"

const ServerApp = (req: express.Request) =>
    <StaticRouter location={req.url}>
        <App config={{apiURL: "http://localhost:4444"}}/>
    </StaticRouter>

export {ServerApp}