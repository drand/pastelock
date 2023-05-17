import express = require("express")
import cors = require("cors")
import {Service} from "./service"
import {createConnectedClient} from "./db"
import {createConfig} from "./config"

async function start() {
    const app = express()
    app.use(cors())
    app.use(express.json())

    const db = await createConnectedClient(createConfig())
    const service = new Service(db)

    app.get("/ciphertexts", (req: express.Request, res: express.Response) => {

        return service.ciphertexts(parseLimit(req, res))
            .then(ciphertexts => res.json(ciphertexts))
            .catch(err => {
                console.error(err)
                res.status(500).send()
            })
    })

    app.get("/plaintexts", (req: express.Request, res: express.Response) => {
        return service.plaintexts(parseLimit(req, res))
            .then(plaintexts => res.json(plaintexts))
            .catch(err => {
                console.error(err)
                res.status(500).send()
            })
    })

    app.get("/entry/:id", (req: express.Request, res: express.Response) => {
        return service.byId(req.params.id)
            .then(entry => res.send(entry))
            .catch(err => {
                console.error(err)
                res.status(404).send({error: "no such entry"})
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

    function parseLimit(req: express.Request, res: express.Response): number | undefined {
        const {limit} = req.query
        if (!limit) {
            return undefined
        }

        try {
            return Number.parseInt(<string>limit)
        } catch (err) {
            res.status(400).send({error: "limit param must be a number"})
            throw err
        }
    }
}

start()
    .catch(err => {
        console.error(err.message)
        process.exit(1)
    })