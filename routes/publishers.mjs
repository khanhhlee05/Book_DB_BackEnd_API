import { Router } from "express"
import { adminAuth } from "../middlewares/authMiddlewares.mjs"
import { requireAuth } from "../middlewares/authMiddlewares.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import { Item } from "../mongoose/schemas/item.mjs"
import { Author } from "../mongoose/schemas/author.mjs"
import { Genre } from "../mongoose/schemas/genre.mjs"
import { Publisher } from "../mongoose/schemas/publisher.mjs"
import bodyParser from "body-parser"
import mongoose from "mongoose"


const router = Router()

//add new publisher
router.post("/api/publishers", adminAuth, async (request, response) => {
    const {name, address, phoneNumber} = request.body

    try {
        const myPublisher = await Publisher.create({name, address, phoneNumber})
        return response.status(201).send(myPublisher)
    } catch (error) {
        return response.status(400).send(error.message)
    }
})


//delete a publisher
router.delete("/api/publishers", adminAuth, async (request, response) => {
    const {_id} = request.body
    try {
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


//get detail of an publisher
router.get("/api/publishers/detail", adminAuth, async (request, response) => {
    const {_id} = request.body
    try {
        const queriedPublisher = await Publisher.findById(_id)
        if (queriedPublisher){
            return response.status(201).send(queriedPublisher)
        } else {
            return response.status(400).send(`Unable to find: Object might not exist`)
        }
    } catch (error){
        return response.status(400).send(error.message)
    }
} )


//list publisher
router.get("/api/publishers/list", adminAuth, async (request, response) => {
    try {
        const publisherList = await Publisher.find().sort({ createdAt : -1 })
        if (publisherList.length > 0){
            return response.status(201).send(publisherList)
        } else {
            return response.send("The list is empty")
        }
    } catch (error) {
        return response.status(400).send(error.message)
    }
}) 


//update publisher
router.patch("/api/publishers/:id", adminAuth, async (request, response) => { // //note .params.id
    
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
            
            return response.sendStatus(400)
            }
})


export default router