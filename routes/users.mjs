import { response, Router } from "express"
import { requireAuth } from "../middlewares/authMiddlewares.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"


const userFieldsWhiteList = {
  "firstName": "",
  "lastName": "",
  "password": "",
  "email": "",
  "phoneNumber": "",
  "address": ""
}

const router = Router()


router.get("/api/me", requireAuth, async (request, response) => {
    const userToken = request.token
    try {
        const user = await User.findById(userToken.id)
        return response.status(200).send(user)
    } catch (error) {
        return response.sendStatus(400)
    }
})


router.patch("/api/me"
  , requireAuth
  , async (request, response) => {
    const userToken = request.token
    const {body} = request

  const user = await User.findById(userToken.id)


  Object.entries(body).forEach(([key, value]) => {
    if (value && key in userFieldsWhiteList){
      user[key] = value
    } else {
      return response.status(400).send(`You are not allowed update ${key}`)
    }
  })

  
  try {
    const updatedUser = await user.save()
    return response.status(201).send(updatedUser)
  } catch (error) {
    console.log(error)
    return response.sendStatus(400)
    
  }


})

router.get("/", requireAuth, (request, response) => {
  response.sendStatus(200)
})

    

export default router