import React from "react"
import {createRoot} from "react-dom/client"
import {EncryptForm} from "./EncryptForm"
import {UpcomingEncryptions} from "./UpcomingEncryptions"
import {RecentPlaintexts} from "./RecentPlaintexts"
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom"
import {TlockEntry} from "./TlockEntry"
import {Toolbar} from "./Toolbar"
import {SideBySide, Stacked} from "./layout"

const router = createBrowserRouter([{
    path: "/",
    element: <App/>,
    children: [{
        path: "",
        element: <EncryptForm/>
    }, {
        path: "entry/:id",
        element: <TlockEntry />
    }]
}])

createRoot(document.getElementById("container")).render(
    <React.StrictMode>
        <RouterProvider router={router}>
            <App/>
        </RouterProvider>
    </React.StrictMode>
)

function App() {
    return (
        <Stacked>
            <Toolbar/>
            <SideBySide>
                <div style={{
                    flex: 2
                }}>
                    <Outlet/>
                </div>
                <Stacked>
                    <RecentPlaintexts/>
                    <UpcomingEncryptions/>
                </Stacked>
            </SideBySide>
        </Stacked>
    )
}