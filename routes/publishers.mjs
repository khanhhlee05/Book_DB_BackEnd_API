import { Router } from "express"
import { requireAuth } from "../middlewares/authMiddlewares.mjs"
import { Publisher } from "../mongoose/schemas/publisher.mjs"
import mongoose from "mongoose"

const router = Router()

//list publisher
router.get("/api/publishers", requireAuth, async (request, response) => {
    try {
        const publisherList = await Publisher.find().sort({ createdAt : -1 })
       
        return response.status(201).send(publisherList)
        
    } catch (error) {
        return response.status(400).send(error.message)
    }
}) 

//get detail of an publisher
router.get("/api/publishers/:_id", requireAuth, async (request, response) => {
    
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: 'Invalid ID format' });
            }

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


export default router