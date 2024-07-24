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
import {isMemberActive} from "../utils/users.mjs"


const router = Router()

//register new membership
router.patch("/api/admin/membership/:_id", adminAuth, async (request, response) => {
    try {
        const {_id} = request.params
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

router.delete("/api/admin/membership/:_id", adminAuth, async (request, response) => {
    try {
        const {_id} = request.params
        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return response.status(400).send({ message: 'Invalid ID format' });
            }

        const queriedUser = await User.findById(_id)

        if (!queriedUser) {
            return response.status(400).send({ message: "User not found" })
        }

        if (queriedUser.membership.length > 0){
            const lastMembership = queriedUser.membership[queriedUser.membership.length - 1];
            lastMembership.endDate = new Date()
            const updatedUser = await queriedUser.save();
            return response.status(200).send(updatedUser);
        } else {
            return response.status(400).send({ message: "User has no active membership" })
        }


        } catch (error) {
            console.log(error.message)
            return response.status(400).send(error)
        }  
            
    
})

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