import * as React from "react"
import {ErrorPage} from "./components/ErrorPage"
import {EncryptForm} from "./components/EncryptForm"
import {TlockEntry} from "./components/TlockEntry"
import { App } from "./App"

export const routes = [{
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
}]