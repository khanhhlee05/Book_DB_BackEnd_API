import { Router } from "express"
import { adminAuth } from "../middlewares/authMiddlewares.mjs"
import { requireAuth } from "../middlewares/authMiddlewares.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import { Item } from "../mongoose/schemas/item.mjs"
import { Author } from "../mongoose/schemas/author.mjs"
import { Genre } from "../mongoose/schemas/genre.mjs"
import { Publisher } from "../mongoose/schemas/publisher.mjs"
import bodyParser from "body-parser"


const router = Router()

//add new genre
router.post("/api/genres", adminAuth, async (request, response) => {
    const {genre} = request.body
    try {
        const myGenre = await Genre.create({genre})
        return response.status(201).send(myGenre)
    } catch (error){
        return response.status(400).send(error.message)
    }
})

//delete a genre
router.delete("/api/genres", adminAuth, async (request, response) => {
    const {_id} = request.body
    try {
        const deletedGenre = await Genre.findByIdAndDelete(_id)
        if (deletedGenre){
            return response.status(201).send(`Deleted genre: ${deletedGenre}`)
        } else {
            return response.status(400).send(`Unable to delete: Object might not exist`)
        }
    } catch (error){
        return response.status(400).send(error.message)
    }
})

//get detail of an genre
router.get("/api/genres/detail", adminAuth, async (request, response) => {
    const {_id} = request.body
    try {
        const queriedGenre = await Genre.findById(_id)
        if (queriedGenre){
            return response.status(201).send(queriedGenre)
        } else {
            return response.status(400).send(`Unable to find: Object might not exist`)
        }
    } catch (error){
        return response.status(400).send(error.message)
    }
} )

//list books
router.get("/api/genres/list", adminAuth, async (request, response) => {
    try {
        const genreList = await Genre.find().sort({ createdAt : -1 })
        if (genreList.length > 0){
            return response.status(201).send(genreList)
        } else {
            return response.send("The list is empty")
        }
    } catch (error) {
        return response.status(400).send(error.message)
    }
}) 


//update genre
router.patch("/api/genres", adminAuth, async (request, response) => {
    let isError = []
    const {_id} = request.body
    if (!_id){
        return response.status(400).send(`id is missing`)
    }
    const myGenre = await Genre.findById(_id)

    Object.entries(request.body).forEach(([key, value]) => {
        if (value){
          myGenre[key] = value
        } else {
          isError.push(key)
        }
      })

    if (isError.length >= 1){
        return response.status(400).send(`You are not allowed update "${isError}"`)  
      }
        
    try {
        const updatedGenre = await myGenre.save()
        return response.status(201).send(updatedGenre)
        }
    catch (error) {  
        console.log(error)
        return response.sendStatus(400)
        }
})


export default router