import bodyParser from "body-parser"
import express from "express"
import mongoose from "mongoose"
import { Publisher } from "./mongoose/schemas/publisher.mjs"

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())

//Connect to DB
mongoose
    .connect("mongodb://localhost/library-system")
    .then(() => {console.log("Connected to DB")})
    .catch((err) => {console.log(`Error: ${err}`)})


    // GET response Helloword


//Run the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

