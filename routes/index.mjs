import { Router } from "express"
import usersRouter from "./users.mjs"
import authRouter from "./auth.mjs"
import itemRouter from "./items.mjs"

const router = Router();

router.use(usersRouter)
router.use(authRouter)
router.use(itemRouter)


export default router