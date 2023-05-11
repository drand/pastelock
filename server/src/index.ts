import express = require("express")
import {Service} from "./service"

const app = express()
app.use(express.json())

const service = new Service()

app.get("/ciphertexts", (req: express.Request, res: express.Response) => {
    return service.ciphertexts()
        .then(ciphertexts => res.json(ciphertexts))
        .catch(err => {
            console.error(err)
            res.status(500).send()
        })
})

app.get("/plaintexts", (req: express.Request, res: express.Response) => {
    return service.plaintexts()
        .then(plaintexts => res.json(plaintexts))
        .catch(err => {
            console.error(err)
            res.status(500).send()
        })
})

app.post("/ciphertexts", (req: express.Request, res: express.Response) => {
    return service.addCiphertext(req.body)
        .then(id => res.status(201).send(id))
        .catch(err => {
            console.error("error storing ciphertext", err)
            res.status(400).json({error: "your ciphertext was not valid"})
        })
})

const port = 4444
app.listen(port, () => {
    console.log(`API started on ${port}`)
    service.startDecrypting().then(() => console.log("started decryption service"))
})
