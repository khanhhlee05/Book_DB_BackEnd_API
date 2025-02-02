import { Router } from "express"
import { User } from "../mongoose/schemas/user.mjs"
import jwt from "jsonwebtoken"


const router = Router()

const maxAge = 3 * 24 * 60 * 60
//Create the token
const createToken = (id, email, role) => {
    return jwt.sign({ id , email, role}, "my ultimate secret", {
        expiresIn: maxAge
    })
}


//create a new user
router.post("/api/auth/signup",async (request, response) => {
    const {firstName, lastName, password, email, phoneNumber, address} = request.body
    try {
        const user = await User.create({ firstName, lastName, password, email, phoneNumber, address})
        const token = createToken(user._id, user.email, user.role) //--> assign the access token
        response.cookie("jwt",token, {httpOnly: true, maxAge: maxAge * 1000}) //-->assign the token to a cookie
        return response.status(201).json({user: user._id})
    } catch (error) {
        return response.status(400).send(error.message)
    }
})

//Login
router.post("/api/auth/login", async (request, response) => {
    const { email, password } = request.body

    try {
        const user = await User.login(email, password)
        const token = createToken(user._id, user.email, user.role) //--> assign the access token
        response.cookie("jwt",token, {httpOnly: true, maxAge: maxAge * 1000}) //-->assign the token to a cookie
        return response.status(200).json({user : user._id, token})
        
    } catch (error) {
        return response.status(401).send(error.message)
    }
})


//log out
router.get("/api/auth/logout", (request, response) => {
    response.cookie("jwt", "", { maxAge: 1 })
    console.log("Logged out")
    return response.status(200).send("Logged out successfully")
})

export default router

