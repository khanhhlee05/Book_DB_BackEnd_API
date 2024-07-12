import { Router } from "express"
import { requireAuth } from "../middlewares/authMiddlewares.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"



const router = Router()


router.get("/api/me", requireAuth, async (request, response) => {
    const userToken = request.token
    try {
        const user = await User.findById(userToken.id)
        response.status(200).send(user)
    } catch (error) {
        response.sendStatus(400)
    }
})


router.patch("/api/me", requireAuth, async (request, response) => {
    const userToken = request.token
    const {body} = request
    /* const {body : {password}} = request
    
   try {
    if (password) {
        const salt = bcrypt.genSaltSync()
        request.body.password = bcrypt.hashSync(password, salt)
    }
    const savedUser = await User.findByIdAndUpdate(userToken.id, {...request.body})
    response.status(200).send(savedUser)
   } catch (error) {
    console.log(error)
    response.sendStatus(400)
   } */
  const user = await User.findById(userToken)
  const userJson = user.toObject()
  let savedUser = {...userJson, ...body}
  const newUser = new User(savedUser)

  try {
    const updatedUser = await newUser.save()
    response.status(201).send(updatedUser)
  } catch (error) {
    console.log(error)
    response.sendStatus(400)
    
  }


})

    

export default router