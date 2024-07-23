import { Router } from "express"
import { adminAuth, requireAuth } from "../middlewares/authMiddlewares.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import {isMemberActive} from "../utils/users.mjs"


const userFieldsWhiteList = {
  "firstName": "",
  "lastName": "",
  "password": "",
  "email": "",
  "phoneNumber": "",
  "address": ""
}

const router = Router()

//get user
router.get("/api/me", requireAuth, async (request, response) => {

    try {
      const userToken = request.token
      const user = await User.findById(userToken.id)
      const userObj = user.toObject()
      userObj.isMemberActive = isMemberActive(user)
      return response.status(200).send(userObj)
    } catch (error) {
        return response.sendStatus(400).send(error.message)
    }
})

//update user
router.patch("/api/me"
  , requireAuth
  , async (request, response) => {

    try{
    const userToken = request.token
    const {body} = request
  let isError = []
  const user = await User.findById(userToken.id)


  Object.entries(body).forEach(([key, value]) => {
    if (value && key in userFieldsWhiteList){
      user[key] = value
    } else {
      isError.push(key)
    }
  })

if (isError.length >= 1){
  return response.status(400).send(`You are not allowed update "${isError}"`)  
}
  

    const updatedUser = await user.save()
    return response.status(201).send(updatedUser)

  } catch (error) {
    console.log(error)
    return response.sendStatus(400)
    
  }


})

//delete user
router.delete("/api/me"
 , requireAuth
 , async (request, response) => {

    try{
    const userToken = request.token
    const user = await User.findByIdAndDelete(userToken.id)

    if (!user){
      return response.sendStatus(404)
    }

    return response.sendStatus(204)

  } catch (error) {
    console.log(error)
    return response.sendStatus(400)
    
  }


})

//get list user
router.get("/api/users", adminAuth, async (request, response) => {
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