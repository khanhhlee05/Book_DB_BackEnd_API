import { Router } from "express"
import { User } from "../mongoose/schemas/user.mjs"

const router = Router()

//create a new user
router.post("/api/auth/signup",async (request, response) => {
    const {firstName, lastName, password, email, phoneNumber, address, role} = request.body
    try {
        const user = await User.create({ firstName, lastName, password, email, phoneNumber, address, role })
        response.status(201).json(user)
    } catch (error) {
        console.log(error)
        response.status(400).send(`Error: ${error}`)
    }
})


router.post("/api/auth/login", (request, response) => {
    
})


router.get("/api/auth/logout", (request, response) => {

})

export default router

