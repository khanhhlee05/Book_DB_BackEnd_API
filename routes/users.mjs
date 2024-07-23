import { Router } from "express"
import { adminAuth, requireAuth } from "../middlewares/authMiddlewares.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import {isMemberActive} from "../utils/users.mjs"
import { Loan } from "../mongoose/schemas/loan.mjs"
import { Item } from "../mongoose/schemas/item.mjs"

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
      if (!user) {
        return response.sendStatus(404)
      }
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
  if (!user) {
    return response.sendStatus(404)
  }


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


router.post("/api/me/loans", async (request, response) => {
  try {
    const userToken = request.token
    const user = await User.findById(userToken.id)

    if (!user){
      return response.sendStatus(404)
    }
    // logic to handle loan request
    if (isMemberActive(user)){
      const {rentDate, rentDue, itemId, note} = request.body
    
    if (!rentDate){
      rentDate = new Date()
    }

    if (!rentDue){
      rentDue = new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)) //7 days
    }

    if(!note){
      note = "Loan successfully"
    }

    if(!itemId){
      return response.status(400).send("itemId is required")
    } else {
      
    }


    const session = await mongoose.startSession();
    session.startTransaction();

    const item = await Item.findById(itemId)
      if (!item){
        return response.status(404).send("Item not found")
      }

    if (item.copiesAvailable > 0){
    const newLoan = new Loan({rentDate, rentDue, itemId, note, userId: userToken.id}) 
    item.copiesAvailable -= 1

    const confirmedLoan = await newLoan.save({session})
    const updatedItem = await item.save({session})
    } else {
      return response.status(400).send("Item is not available")
    }

    await session.commitTransaction()
    session.endSession()

    response.status(200).send(confirmedLoan + "\n\n" + updatedItem)


  

    } else {
      return response.status(403).send("You are not a member")
    }
  }catch (error){

  }
})

export default router