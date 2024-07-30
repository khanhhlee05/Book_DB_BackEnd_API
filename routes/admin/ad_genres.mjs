import { Router } from "express"
import { adminAuth } from "../../middlewares/authMiddlewares.mjs"
import { requireAuth } from "../../middlewares/authMiddlewares.mjs"
import { User } from "../../mongoose/schemas/user.mjs"
import { Item } from "../../mongoose/schemas/item.mjs"
import { Author } from "../../mongoose/schemas/author.mjs"
import { Genre } from "../../mongoose/schemas/genre.mjs"
import { Publisher } from "../../mongoose/schemas/publisher.mjs"
import bodyParser from "body-parser"
import mongoose from "mongoose"


const router = Router()

//add new genre
router.post("/api/admin/genres", adminAuth, async (request, response) => {
    
    try {
        const {genre} = request.body
        const myGenre = await Genre.create({genre})
        return response.status(201).send(myGenre)
    } catch (error){
        return response.status(400).send(error.message)
    }
})

//delete a genre
router.delete("/api/admin/genres/:_id", adminAuth, async (request, response) => {
    
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: 'Invalid ID format' });
            }

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



//update genre
router.patch("/api/admin/genres/:_id", adminAuth, async (request, response) => {
    try {
    const {_id} = request.params
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return response.status(400).send({ message: 'Invalid ID format' });
        }
    const myGenre = await Genre.findById(_id)
    if (!myGenre){
        return response.status(400).send({ message: 'Cannot query document' });
    }
    Object.entries(request.body).forEach(([key, value]) => {
        if (value){
          myGenre[key] = value
        }
      })

    
        const updatedGenre = await myGenre.save()
        return response.status(201).send(updatedGenre)
        }
    catch (error) {  
        return response.status(400).send(error.message)
        }
})


export default router