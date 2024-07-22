import { Router } from "express"
import usersRouter from "./users.mjs"
import authRouter from "./auth.mjs"
import itemRouter from "./items.mjs"
import genreRouter from "./genres.mjs"
import publisherRouter from "./publishers.mjs"
import authorRouter from "./authors.mjs"
import adminRouter from "./admin.mjs"



const router = Router();

router.use(usersRouter)
router.use(authRouter)
router.use(itemRouter)
router.use(genreRouter)
router.use(publisherRouter)
router.use(authorRouter)
router.use(adminRouter)

export default router