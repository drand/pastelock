import {createTheme} from "@mui/material/styles"

export const themeOptions= createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ffffff",
            light: "#5762d5",
            dark: "#6e7dab",
            contrastText: "#D1E3DD",
        },
        secondary: {
            main: "#f50057",
        },
        background: {
            default: "#32292f",
            paper: "#575366",
        },
        error: {
            main: "#f50057"
        },
        text: {
            primary: "#D1E3DD",
            secondary: "#D1E3DD",
            disabled: "#D1E3DD",
        },
    },

})