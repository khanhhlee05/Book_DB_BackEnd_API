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

//add new author
router.post("/api/authors", adminAuth, async (request, response) => {
    const {firstName, lastName, dateOfBirth, nationality, biography} = request.body
    try {
        const myAuthor = await Author.create({firstName, lastName, dateOfBirth, nationality, biography})
        return response.status(201).send(myAuthor)
    } catch (error){
        return response.status(400).send(error.message)
    }
})

//get detail of an author
router.get("/api/authors/detail", adminAuth, async (request, response) => {
    const {_id} = request.body
    try {
        const queriedAuthor = await Author.findById(_id)
        if (queriedAuthor){
            return response.status(201).send(queriedAuthor)
        } else {
            return response.status(400).send(`Unable to find: Object might not exist`)
        }
    } catch (error){
        return response.status(400).send(error.message)
    }
} )

//delete an author
router.delete("/api/authors", adminAuth, async (request, response) => {
    const {_id} = request.body
    try {
        const deletedAuthor = await Author.findByIdAndDelete(_id)
        if (deletedAuthor){
            return response.status(201).send(`Deleted author: ${deletedAuthor}`)
        } else {
            return response.status(400).send(`Unable to delete: Object might not exist`)
        }
    } catch (error){
        return response.status(400).send(error.message)
    }
})

//list authors
router.get("/api/authors/list", adminAuth, async (request, response) => {
    try {
        const authorList = await Author.find().sort({ dateOfBirth : -1 })
        if (authorList.length > 0){
            return response.status(201).send(authorList)
        } else {
            return response.send("The list is empty")
        }
    } catch (error) {
        return response.status(400).send(error.message)
    }
}) 

//update author
router.patch("/api/authors", adminAuth, async (request, response) => {
    let isError = []
    const {_id} = request.body
    if (!_id){
        return response.status(400).send(`id is missing`)
    }

    const myAuthor = await Author.findById(_id)

    Object.entries(request.body).forEach(([key, value]) => {
        if (value){
          myAuthor[key] = value
        } else {
          isError.push(key)
        }
      })

    if (isError.length >= 1){
        return response.status(400).send(`You are not allowed update "${isError}"`)  
      }
        
    try {
        const updatedAuthor = await myAuthor.save()
        return response.status(201).send(updatedAuthor)
        }
    catch (error) {  
        console.log(error)
        return response.sendStatus(400)
        }
})



export default router