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

//add new author
router.post("/api/admin/authors", adminAuth, async (request, response) => {
   
    try {
        const {firstName, lastName, dateOfBirth, nationality, biography} = request.body
        const myAuthor = await Author.create({firstName, lastName, dateOfBirth, nationality, biography})
        return response.status(201).send(myAuthor)
    } catch (error){
        return response.status(400).send(error.message)
    }
})



//delete an author
router.delete("/api/admin/authors/:_id", adminAuth, async (request, response) => {
    
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: 'Invalid ID format' });
            }
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



//update author
router.patch("/api/admin/authors/:_id", adminAuth, async (request, response) => {
    try{
    const {_id} = request.params
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return response.status(400).send({ message: 'Invalid ID format' });
        }
    const myAuthor = await Author.findById(_id)
    if (!myAuthor){
        return response.status(400).send({ message: 'Cannot query document' });
    }
    Object.entries(request.body).forEach(([key, value]) => {
        if (value){
          myAuthor[key] = value
        } 
      })
        

        const updatedAuthor = await myAuthor.save()
        return response.status(201).send(updatedAuthor)
        }
    catch (error) {  
        console.log(error)
        return response.sendStatus(400)
        }
})



export default router