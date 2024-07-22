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
        //const queriedItem = await Item.findById(_id)

        const queriedItem = await Item.aggregate([
        {$match : {_id : new mongoose.Types.ObjectId(_id)} },
           { $unwind: "$genres"},
           { $lookup: {
                from: "authors",
                localField: "authorId",
                foreignField: "_id",
                as: "author"
            }},
            {$lookup: {
                from: "publishers",
                localField: "publisherId",
                foreignField: "_id",
                as: "publisher"
            }},
            {$lookup: {
                from: "genres",
                localField: "genres",
                foreignField: "_id",
                as: "genres"
            }},
            {$group: {
                _id: "$_id",
                title: {$first: "$title"},
                author: {$first : "$author"},
                publisher: {$first : "$publisher"},
                genres: {$push: "$genres"},
                dateImported: {$first : "$dateImported"},
                publishedDate: {$first : "$publishedDate"},
                copiesAvailable: {$first : "$copiesAvailable"}
            }}
    ])
    console.log(JSON.stringify(queriedItem));
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
        if (Object.keys(request.query).length === 0){
        
        const bookList = await Item.find().sort({ publishedDate : -1 })
        
        return response.status(201).send(bookList)
        } else {
            const {query : {search_text, genre_ids, author_ids, publisher_ids, sort_by}} = request
            let query = {} //--> create query objecyt

            if (search_text){
                query.title = {$regex : search_text, $options: 'i'}
            }  
            if (genre_ids){
                const g_ids = genre_ids.split(",")
                query.genres = {$in : g_ids}
            }
            if (author_ids){
                const a_ids = author_ids.split(",")
                query.authorId = {$in : a_ids}
            }
            if (publisher_ids){
                const p_ids = publisher_ids.split(",")
                query.publisherId = {$in : p_ids}
            }

            let sortOrder
            let queriedList

            if (sort_by){
                if (sort_by === "asc"){
                    sortOrder = 1
                } else {
                    sortOrder = -1
                }
                queriedList = await Item.find(query).sort({publishedDate: sortOrder})
            } else {
                queriedList = await Item.find(query).sort({publisherDate : -1})
            }
            return response.status(201).send(queriedList)
        }

        
    
    } catch (error) {
        console.log(error)
        return response.status(400).send(error.message)
    }
}) 

//update books

router.patch("/api/items/:_id", adminAuth, async (request, response) => {
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: "Invalid ID format"})
        }

        const myItem = await Item.findById(_id)
        if (!myItem){
            return response.status(400).send({ message: 'Cannot query document' });
        }
        /* try {
            const updatePromises = Object.entries(request.body).map(async ([key, value]) => {
                if (value) {
                    if (key === "authorId") {
                        await checkID('Author', value);
                        myItem[key] = value;
                    } else if (key === "genres") {
                        await Promise.all(value.map(async (genreId) => checkID('Genre', genreId)));
                        myItem[key] = value;
                    } else if (key === "publisherId") {
                        await checkID('Publisher', value);
                        myItem[key] = value;
                    } else {
                        myItem[key] = value;
                    }
                }
            });
            //wait all the promise to be resolved than catch it
            await Promise.all(updatePromises);

        } catch (error) {
            console.log(error)
        return response.sendStatus(400)
        } */
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