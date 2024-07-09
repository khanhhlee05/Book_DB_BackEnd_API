import bodyParser from "body-parser"
import express from "express"
import mongoose from "mongoose"
import { Publisher } from "./mongoose/schemas/publisher.mjs"
import routes from "./routes/index.mjs"

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(routes)

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

