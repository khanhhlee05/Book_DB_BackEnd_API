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


const router = Router()

//register new membership
router.post("/api/admin/register/:_id", adminAuth, async (request, response) => {
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
        let {duration, startDate} = request.body //get the duration from the body
        if (!duration || duration < 0){
            duration = 2 //if null set to default 2 months
        }
        duration = Math.round(duration) //make sure duration is integer value

        if (!startDate){
            
            startDate = new Date() //if null set to current date
        } else if (startDate < new Date()){
            return response.status(400).send({ message: "Start date cannot be in the past" })
        } else {
            startDate = new Date(startDate) //convert string to date
        }
        //check if exisiting membership
        let recentStartDate
        let recentEndDate
        let membership = {}
        //console.log(queriedUser["membership"].length)
        if (queriedUser["membership"].length > 0){ //if exist -> have to check
        recentStartDate = queriedUser["membership"][queriedUser["membership"].length - 1].startDate
        recentEndDate = queriedUser["membership"][queriedUser["membership"].length - 1].endDate
    
       
        if (recentEndDate >= startDate){ 
            console.log(1)
            //extend membership duration
            let newEndDate = new Date(recentEndDate);
            newEndDate.setMonth(newEndDate.getMonth() + duration);
            membership.startDate = recentEndDate
            membership.endDate = newEndDate
        
        } 
        } else {
           
            let newEndDate = new Date();
            newEndDate.setMonth(newEndDate.getMonth() + duration);
            membership.startDate = startDate
            membership.endDate = newEndDate
        }
        console.log(membership)
        
        queriedUser["membership"].push(membership)
        
        
        const updatedMembership = await queriedUser.save()
        return response.status(200).send(updatedMembership)

    } catch (error) {
        return response.status(400).send(error.message)
    }
    

})



export default router