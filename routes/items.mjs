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

async function checkID(refModel, refID) {
    const refExist = await mongoose.model(refModel).findById({_id : refID})
    if (!refExist) {
        throw new Error(`${refModel} does not exist`)
    }
}


//add new book
router.post("/api/items", adminAuth, async (request, response) => {
   
    

    try {
        const {authorId, title, genres, dateImported, publishedDate, copiesAvailable, publisherId} = request.body

        await checkID('Publisher', publisherId);
        await checkID('Author', authorId);
        await Promise.all(genres.map(async (genreId) => checkID('Genre', genreId)));
        
        const item = await Item.create({authorId, title, genres, dateImported, publishedDate, copiesAvailable, publisherId})
        return response.status(201).send(item)
    } catch (error) {
        return response.status(400).send(error.message)
    }
})


//delete a book from db
router.delete("/api/items/:_id", adminAuth, async (request, response) => { 
    
    
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: 'Invalid ID format' });
            }
        const deletedItem = await Item.findByIdAndDelete(_id)
        if (deletedItem){
            return response.status(201).send(`Deleted item: ${deletedItem}`)
        } else {
            return response.status(400).send(`Unable to delete: Object might not exist`)
        }
    } catch (error){
        return response.status(400).send(error.message)
    }
})


//get detail of an item
router.get("/api/items/:_id", requireAuth, async (request, response) => { 
    
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: 'Invalid ID format' });
            }
        const queriedItem = await Item.findById(_id)
        if (queriedItem){
            return response.status(201).send(queriedItem)
        } else {
            return response.status(400).send(`Unable to find: Object might not exist`)
        }
    } catch (error){
        return response.status(400).send(error.message)
    }
} )

//list books
router.get("/api/items", requireAuth, async (request, response) => {
    try {
        const bookList = await Item.find().sort({ publishedDate : -1 })
        
        return response.status(201).send(bookList)
        
    } catch (error) {
        return response.status(400).send(error.message)
    }
}) 

//update books


export default router