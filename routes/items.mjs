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


//add new book
router.post("/api/items/add", adminAuth, async (request, response) => {
    const {authorId, title, genres, dateImported, publishedDate, copiesAvailable, publisherId} = request.body
    try {
        const item = await Item.create({authorId, title, genres, dateImported, publishedDate, copiesAvailable, publisherId})
        return response.status(201).json({item : item._id})
    } catch (error) {
        return response.status(400).send(error.message)
    }
})


//delete a book from db
router.delete("/api/items/delete", adminAuth, async (request, response) => {
    const {_id} = request.body
    try {
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

router.get("/api/items/detail", requireAuth, async (request, response) => {
    const {_id} = request.body
    try {
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


export default router