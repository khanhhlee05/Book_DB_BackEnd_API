import { Router } from "express"
import { adminAuth, requireAuth } from "../middlewares/authMiddlewares.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import {isMemberActive} from "../utils/users.mjs"
import { Loan } from "../mongoose/schemas/loan.mjs"
import { Item } from "../mongoose/schemas/item.mjs"
import mongoose from "mongoose"

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


// New loan
router.post("/api/me/loan", requireAuth, async (request, response) => {
  // Start a session for the transaction
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
      // Retrieve the user token from the request
      const userToken = request.token
      // Find the user by their ID within the transaction session
      const user = await User.findById(userToken.id).session(session)

      // Check if the user exists
      if (!user) {
          await session.abortTransaction() // Abort the transaction if the user is not found
          session.endSession() 
          return response.sendStatus(400) 
      }

      // Define the isMemberActive function to check if the user's membership is active
      const isMemberActive = (user) => {
          const now = new Date()
          if (user.membership && user.membership.length > 0) {
              const latestMembership = user.membership[user.membership.length - 1]
              const latestStartDate = new Date(latestMembership.startDate)
              const latestEndDate = new Date(latestMembership.endDate)
              return now >= latestStartDate && now < latestEndDate
          }
          return false
      }

      // Check if the user is an active member
      if (!isMemberActive(user)) {
          await session.abortTransaction() 
          session.endSession() 
          return response.status(400).send("You are not a member") 
      }

      // Extract rentDate, rentDue, itemId, and note from the request body
      let { rentDate, rentDue, itemId, note } = request.body

      // Set default rentDate to current date if not provided
      if (!rentDate) {
          rentDate = new Date()
      } else {
          rentDate = new Date(rentDate)
      }

      // Set default rentDue to 7 days
      if (!rentDue) {
          rentDue = new Date(new Date().getTime() + (7 * 24 * 60 * 60 * 1000)) // 7 days
      } else {
          rentDue = new Date(rentDue)
      }

      // Set default note if not provided
      if (!note) {
          note = "Loan successfully"
      }

      // Check if itemId is provided
      if (!itemId) {
          await session.abortTransaction() // Abort the transaction if itemId is not provided
          session.endSession() 
          return response.status(400).send("itemId is required") 
      }

      // Find the item by its ID within the transaction session
      const item = await Item.findById(itemId).session(session)
      if (!item) {
          await session.abortTransaction() 
          session.endSession()
          return response.status(400).send("Item not found") 
      }

      // Check if the item has available copies
      if (item.copiesAvailable > 0) {
         
          const newLoan = new Loan({ rentDate, rentDue, itemId, note, userId: userToken.id })
          item.copiesAvailable -= 1 

         
          const confirmedLoan = await newLoan.save({ session })
          const updatedItem = await item.save({ session })

          // Commit the transaction and end the session
          await session.commitTransaction()
          session.endSession()

        
          response.status(200).send({ confirmedLoan, updatedItem })
      } else {
          await session.abortTransaction()
          session.endSession()
          return response.status(400).send("Item is not available")
      }
  } catch (error) {
    
      await session.abortTransaction()
      session.endSession()
      console.log(error)
      response.status(400).send(error.message) 
  }
})

router.get("/api/me/loan/:_id", requireAuth, async (request, response) => {
//default case: return all loan of the user
try {
  const userToken = request.token
  if (Object.keys(request.query).length === 0){
    const loanList = await Loan.find({userID: userToken.id}).sort({rentDue: -1})
    if (!loanList.length){
      return response.status(400).send("User has no loan history")
    } else {
      return response.status(200).send(loanList)
    }
  } else {
    const {overdue, sort_by} = request.query
    let query = {}
    if (overdue === "true"){
      
    }

  }

} catch (error) {
  
}
})

export default router