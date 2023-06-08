import * as React from "react"
import {Button, Chip, Stack, TextField, Typography} from "@mui/material"
import {useCallback, useState} from "react"

type TagsInputProps = {
    max?: number
    tags: Array<string>
    onChange: (tags: Array<string>) => void
}
export const TagsInput = (props: TagsInputProps) => {
    const [advisoryText, setAdvisoryText] = useState("")
    const [currentTag, setCurrentTag] = useState("")

    const tagsMaxed = !!props.max && props.tags.length >= props.max
    if (tagsMaxed) {
        setAdvisoryText(`You can only set a maximum of ${props.max} tags`)
    }

    const appendTag = useCallback((tag: string) => {
        if (!!props.tags.find(it => it === tag)) {
            setAdvisoryText("You can't add duplicate tags")
            return
        }
        setAdvisoryText("")
        props.onChange([...props.tags, tag])
        setCurrentTag("")
    }, [props.tags])

    const removeTag = useCallback((tag: string) => {
        props.onChange([...props.tags.filter(it => it !== tag)])
    }, [props.tags])

    return (
        <Stack
            direction={"column"}
            paddingBottom={2}
        >
            <Stack
                direction={"row"}
                alignItems={"center"}
                paddingTop={1}
            >
                <TextField
                    label={"Tags"}
                    value={currentTag}
                    onChange={event => setCurrentTag(event.target.value)}
                    disabled={tagsMaxed}
                />
                <Button
                    onClick={() => appendTag(currentTag)}
                    disabled={tagsMaxed}
                >
                    Add
                </Button>
                {props.tags.map(t =>
                    <Chip
                        variant="filled"
                        label={ellipsise(t, 10)}
                        onDelete={() => removeTag(t)}
                    />
                )}
            </Stack>
            <Typography variant={"caption"}>{advisoryText}</Typography>
        </Stack>
    )
}

function ellipsise(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
        return str
    }
    return str.slice(0, maxLength) + "..."
}
