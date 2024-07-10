import { Router } from "express"
import User from "../mongoose/schemas/user.mjs"

const router = Router()

//create a new user
router.post("/api/auth/signup", (request, response) => {
    const {} = request.body
    try {
        User.create
    } catch (error) {
        
    }
})


router.post("/api/auth/login", (request, response) => {
    
})


router.get("/api/auth/logout", (request, response) => {

})

export default router

