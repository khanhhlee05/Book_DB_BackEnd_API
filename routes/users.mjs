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
      
      // Check if the user is an active member
      if (!isMemberActive(user)) {
          await session.abortTransaction() 
          session.endSession() 
          return response.status(400) .send("You are not a member") 
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

      // Find the item  within the transaction session
      const item = await Item.findOneAndUpdate(
        { _id: itemId, copiesAvailable: { $gt: 0 } },
        { $inc: { copiesAvailable: -1 } },
        {  new: true , session }
    );  

    if (!item) {
        await session.abortTransaction();
        session.endSession();
        return response.status(400).send("Item not found");
    }

    const newLoan = new Loan({ rentDate, rentDue, itemId, note, userId: userToken.id });
    const confirmedLoan = await newLoan.save({ session });
          

          // Commit the transaction and end the session


          await session.commitTransaction()
          session.endSession()

        
          return response.status(200).send({ confirmedLoan, item })
      
  } catch (error) {
    
      await session.abortTransaction()
      session.endSession()
      console.log(error)
      return response.status(400).send(error.message) 
  }
})

router.get("/api/me/loan", requireAuth, async (request, response) => {
//default case: return all loan of the user
try {
  const userToken = request.token
  if (Object.keys(request.query).length === 0){
    const loanList = await Loan.find({userId: userToken.id}).sort({rentDue: -1})
    if (!loanList.length){
      return response.status(400).send("User has no loan history")
    } else {
      return response.status(200).send(loanList)
    }
  } else {

    const {overdue, sort_by} = request.query
    let query = {}
    query.userId = userToken.id
    const now = Date.now()

    if (overdue === "true"){
      query.rentDue = {$lt: now}
    } else if (overdue === "false") {
      query.rentDue = {$gte: now}
    }

    let sortOrder, loanList
    if (sort_by === "asc"){
      sortOrder = 1
    } else {
      sortOrder = -1
    }

    loanList = await Loan.find(query).sort({rentDate : sortOrder})
   
    return response.status(200).send(loanList)
    

  }

} catch (error) {
  console.log(error.message)
  return response.sendStatus(400)
}
})

router.patch("/api/me/loan/:loanId", requireAuth, async (request, response) => {
  const session = await mongoose.startSession()
  session.startTransaction()


  try {
    const { loanId } = request.params
    const userToken = request.token
    const user = await User.findById(userToken.id)

    if (!user) {
        await session.abortTransaction()
        session.endSession()
        return response.sendStatus(400)
    }

    if (!isMemberActive(user)) {
      await session.abortTransaction()
      session.endSession()
      return response.status(400).send("You are not a member")
    }

    
    const loan = await Loan.findById(loanId).session(session)
    
    if (!loan) {
      await session.abortTransaction()
      session.endSession()
      return response.sendStatus(404)
    } 

    console.log(userToken.id !== String(loan.userId))
    if (userToken.id !== String(loan.userId)) {
      await session.abortTransaction()
      session.endSession()
      return response.status(400).send("The profile does not match with the loan")
    }


    
    if (loan.actualReturnDate){
      await session.abortTransaction()
      session.endSession()
      return response.status(400).send("Loan has already been returned" )
    } else {
      loan["actualReturnDate"] = Date.now()
      
    }
    const updatedLoan = await loan.save({ session })

    const item = await Item.findByIdAndUpdate(
      loan.itemId, 
      {$inc : {copiesAvailable : 1}}, 
      {new: true, session}
    )

    if (!item) {
      await session.abortTransaction()
      session.endSession()
      return response.sendStatus(404)
    }

    
    await session.commitTransaction()
    session.endSession()

    return response.status(200).send({updatedLoan, item})


  } catch (error) {
    console.log(error)
    await session.abortTransaction()
    session.endSession()
    return response.status(400).send(error.message)
  }

})

//register new membership
router.patch("/api/me/membership", requireAuth, async (request, response) => {
  try {
      const _id = request.token.id
      if (!mongoose.Types.ObjectId.isValid(_id)) {
          return response.status(400).send({ message: 'Invalid ID format' });
          } 

      const queriedUser = await User.findById(_id)
      if (!queriedUser) {
          return response.status(400).send({ message: "User not found" })
      }
      //get the duration
      let {duration} = request.body //get the duration from the body
      if (!duration || duration < 0){
          duration = 2 //if null set to default 2 months
      }

      duration = Math.round(duration) //make sure duration is integer value

      const membership = {
          startDate: new Date(),
          endDate: new Date()
      };
      membership.endDate.setMonth(membership.endDate.getMonth() + duration);

      if (queriedUser.membership.length > 0) { //check for existing memberships
          const lastMembership = queriedUser.membership[queriedUser.membership.length - 1];
          if (lastMembership.endDate >= new Date()) {
              /* membership.startDate = lastMembership.endDate;
              membership.endDate = new Date(lastMembership.endDate);
              membership.endDate.setMonth(membership.endDate.getMonth() + duration); */
              let extendEndDate = new Date(lastMembership.endDate)
              extendEndDate.setMonth(extendEndDate.getMonth() + duration)
              lastMembership.endDate = extendEndDate
              const updatedUser = await queriedUser.save();
              return response.status(200).send(updatedUser);
          }
          }
          queriedUser.membership.push(membership);
          const updatedUser = await queriedUser.save();
          return response.status(200).send(updatedUser);


      } catch (error) {
      return response.status(400).send(error.message)
  }
  

})

export default router