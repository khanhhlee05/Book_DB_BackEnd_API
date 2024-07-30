import { Router } from "express"
import { requireAuth } from "../middlewares/authMiddlewares.mjs"
import { Genre } from "../mongoose/schemas/genre.mjs"
import mongoose from "mongoose"

const router = Router()


//get detail of an genre
router.get("/api/genres/:_id", requireAuth, async (request, response) => {
   
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: 'Invalid ID format' });
            }
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

//list genre
router.get("/api/genres", requireAuth, async (request, response) => {
    try {
        const genreList = await Genre.find().sort({ createdAt : -1 })
      
        return response.status(201).send(genreList)
       
    } catch (error) {
        return response.status(400).send(error.message)
    }
}) 




export default router