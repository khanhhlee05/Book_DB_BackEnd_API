import { response, Router } from "express"
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


router.patch("/api/me"
  , requireAuth
  , async (request, response) => {
    const userToken = request.token
    const {body} = request
    const {firstName, lastName, password, phoneNumber, address} = body

  const user = await User.findById(userToken.id)

  
  Object.entries(body).forEach(([key, value]) => {
    if (value){
      user[key] = value
    }
  })

  
  try {
    const updatedUser = await user.save()
    response.status(201).send(updatedUser)
  } catch (error) {
    console.log(error)
    response.sendStatus(400)
    
  }


})

router.get("/", requireAuth, (request, response) => {
  response.sendStatus(200)
})

    

export default router