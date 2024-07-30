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

//add new publisher
router.post("/api/admin/publishers", adminAuth, async (request, response) => {
    
    try {
        const {name, address, phoneNumber} = request.body
        const myPublisher = await Publisher.create({name, address, phoneNumber})
        return response.status(201).send(myPublisher)
    } catch (error) {
        return response.status(400).send(error.message)
    }
})


//delete a publisher
router.delete("/api/admin/publishers/:_id", adminAuth, async (request, response) => {
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: 'Invalid ID format' });
            }
        const deletedPublisher = await Publisher.findByIdAndDelete(_id)
        if (deletedPublisher){
            return response.status(201).send(`Deleted publisher: ${deletedPublisher}`)
        } else {
            return response.status(400).send(`Unable to delete: Object might not exist`)
        }
    } catch (error){
        return response.status(400).send(error.message)
    }
})





//update publisher
router.patch("/api/admin/publishers/:_id", adminAuth, async (request, response) => { // //note .params.id
    
    try{
    
    const {_id} = request.params
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return response.status(400).send({ message: 'Invalid ID format' });
        }
    
    const myPublisher = await Publisher.findById(_id) //check if exist
    if (!myPublisher){
        return response.status(400).send({ message: 'Cannot query document' });
    }

    Object.entries(request.body).forEach(([key, value]) => { 
        if (value){
          myPublisher[key] = value
        } 
      })

    const updatedPublisher = await myPublisher.save()
    return response.status(201).send(updatedPublisher)

    } catch (error) {  
            
            return response.status(400).send(error.message)
            }
})


export default router