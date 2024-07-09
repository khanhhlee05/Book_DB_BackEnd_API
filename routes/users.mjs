import { Router } from "express"


const router = Router()

router.get("/api/users", (request, response) => {

    response.send("Success")

})

export default router