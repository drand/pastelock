import * as React from "react"
import {FormControlLabel, Input} from "@mui/material"

type FileInputProps = {
    onChange: (files: FileList) => void
}

export const FileInput = (props: FileInputProps) =>
    <FormControlLabel
        label={""} /* labels look a bit shit with the default file input element */
        control={
            <Input
                type="file"
                className={"form-control"}
                onChange={(event: any) => event.currentTarget.files && props.onChange(event.currentTarget.files)}
            />
        }
    />
