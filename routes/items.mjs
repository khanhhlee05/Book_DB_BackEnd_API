import { Router } from "express"
import { adminAuth } from "../middlewares/authMiddlewares.mjs"
import { requireAuth } from "../middlewares/authMiddlewares.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import { Item } from "../mongoose/schemas/item.mjs"
import {Comment} from "../mongoose/schemas/comment.mjs"
import { Review } from "../mongoose/schemas/review.mjs"
import { Author } from "../mongoose/schemas/author.mjs"
import { Genre } from "../mongoose/schemas/genre.mjs"
import { Publisher } from "../mongoose/schemas/publisher.mjs"
import { checkID } from "../utils/users.mjs"
import bodyParser from "body-parser"
import mongoose from "mongoose"





const router = Router()




//get detail of an item
router.get("/api/items/:_id", requireAuth, async (request, response) => { 
    
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: 'Invalid ID format' });
            }
        //const queriedItem = await Item.findById(_id)

        const queriedItem = await Item.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(_id) } },
            { $lookup: {
                from: "authors",
                localField: "authorId",
                foreignField: "_id",
                as: "author"
            }},
            { $lookup: {
                from: "publishers",
                localField: "publisherId",
                foreignField: "_id",
                as: "publisher"
            }},
            { $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "itemId",
                as: "reviews"
            }},
            { $unwind: {
                path: "$genres",
                preserveNullAndEmptyArrays: true
            }},
            { $lookup: {
                from: "genres",
                localField: "genres",
                foreignField: "_id",
                as: "genreDetails"
            }},
            { $unwind: {
                path: "$genreDetails",
                preserveNullAndEmptyArrays: true
            }},
            { $unwind: {
                path: "$reviews",
                preserveNullAndEmptyArrays: true
            }},
            { $group: {
                _id: "$_id",
                title: { $first: "$title" },
                author: { $first: { $arrayElemAt: ["$author", 0] } },
                publisher: { $first: { $arrayElemAt: ["$publisher", 0] } },
                genres: { $addToSet: "$genreDetails" },
                dateImported: { $first: "$dateImported" },
                publishedDate: { $first: "$publishedDate" },
                copiesAvailable: { $first: "$copiesAvailable" },
                avgRating: { $avg: "$reviews.rating" }
            }},
            { $project: {
                _id: 1,
                title: 1,
                author: 1,
                publisher: 1,
                genres: 1,
                dateImported: 1,
                publishedDate: 1,
                copiesAvailable: 1,
                avgRating: { $ifNull: ["$avgRating", null] }
            }}
        ]);
        
        console.log(queriedItem);
        
        
        

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



// get list of comments
router.get('/api/items/comments/:itemId', requireAuth, async (request, response) => {
    try {
      const {itemId} = request.params;
      await checkID('Item', itemId);
      let { page, limit } = request.query;
      if (!page || page < 1) {
        page = 1;
      }
      if (!limit || limit > 100 || limit < 0) {
        limit = 10;
      }
  
      const item = await Item.findById(itemId);
      const comments = await Comment.find({ itemId })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
  
      return response.status(200).send({ page, limit, item, comments });
    } catch (error) {
      console.log(error);
      return response.status(400).send(error.message);
    }
  })


  //get list of reviews
router.get("/api/items/reviews/:itemId", requireAuth, async (request, response) => {
    try{
      const {itemId} = request.params
      await checkID("Item",itemId)
      let { page , limit  } = request.query; 
      if(!page || page < 1){
        page = 1
      }
      if(!limit || limit > 100 || limit < 0){
        limit = 10
      }
      const item = await Item.findById(itemId)
      const reviews = await Review.find({ itemId }).skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 })
  
      return response.status(200).send({page, limit, item, reviews})
  
    } catch(error){
      console.log(error)
      return response.status(400).send(error.message)
    } 
  })
export default router