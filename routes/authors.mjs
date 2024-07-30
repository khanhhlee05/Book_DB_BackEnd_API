import { Router } from "express"
import { requireAuth } from "../middlewares/authMiddlewares.mjs"
import { Author } from "../mongoose/schemas/author.mjs"
import mongoose from "mongoose"


const router = Router()



//get detail of an author
router.get("/api/authors/:_id", requireAuth, async (request, response) => {
   
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: 'Invalid ID format' });
            }
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


//list authors
router.get("/api/authors", requireAuth, async (request, response) => {
    try {
        const authorList = await Author.find().sort({ dateOfBirth : -1 })
       
        return response.status(201).send(authorList)
        
    } catch (error) {
        return response.status(400).send(error.message)
    }
}) 



export default router