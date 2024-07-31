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


const router = Router()

//get list user
router.get("/api/admin/users", adminAuth, async (request, response) => {
    try {
      const users = await User.find().sort({ createdAt: -1 })
      let listUser = []
      for await (const user of users){
        const userObj = user.toObject()
        userObj.isMemberActive = isMemberActive(user)
        listUser.push(userObj)
      }
      return response.status(200).send(listUser)
    } catch (error) {
      return response.sendStatus(400).send(error.message)
    }
  })



export default router