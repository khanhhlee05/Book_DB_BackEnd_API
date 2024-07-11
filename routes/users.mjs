import { Router } from "express"
import { requireAuth } from "../middlewares/authMiddlewares.mjs"
import { User } from "../mongoose/schemas/user.mjs"
import jwt from "jsonwebtoken"


const router = Router()

router.get("/api/users", requireAuth, async (request, response) => {
    const userToken = request.token
    try {
        const user = await User.findById(userToken.id)
        response.status(200).send(user)
    } catch (error) {
        response.sendStatus(400)
    }
    
    


    

})

export default router