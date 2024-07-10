import { Router } from "express"
import usersRouter from "./users.mjs"
import authRouter from "./auth.mjs"

const router = Router();

router.use(usersRouter)
router.use(authRouter)


export default router