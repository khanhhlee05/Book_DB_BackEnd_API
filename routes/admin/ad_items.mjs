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
import {isMemberActive} from "../../utils/users.mjs"
import {checkID} from "../../utils/users.mjs"





const router = Router()

//add new book
router.post("/api/admin/items", adminAuth, async (request, response) => {
   

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
router.delete("/api/admin/items/:_id", adminAuth, async (request, response) => { 
    
    
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


//update books

router.patch("/api/admin/items/:_id", adminAuth, async (request, response) => {
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: "Invalid ID format"})
        }

        const myItem = await Item.findById(_id)
        if (!myItem){
            return response.status(400).send({ message: 'Cannot query document' });
        }
       try {
       for await (const [key, value] of Object.entries(request.body)){
        if (value){
            if (key === "authorId") {
                await checkID('Author', value);
                myItem[key] = value;
            } else if (key === "genres") {
                await Promise.all(value.map((genreId) => checkID('Genre', genreId)));
                myItem[key] = value;
            } else if (key === "publisherId") {
                await checkID('Publisher', value);
                myItem[key] = value;
            } else {
                myItem[key] = value;
            }
        }
       }
    } catch (error) {
        console.log(error.message)
        return response.sendStatus(400) 

    }
        const updatedItem = await myItem.save()
        return response.status(201).send(updatedItem)

    } catch (error) {
        console.log(error)
        return response.sendStatus(400)

    }
})



 
export default router