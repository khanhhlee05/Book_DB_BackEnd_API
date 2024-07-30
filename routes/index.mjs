import { Router } from "express"

import adminItemRouter from "./admin/ad_items.mjs"
import adminGenreRouter from "./admin/ad_genres.mjs"
import adminPublisherRouter from "./admin/ad_publishers.mjs"
import adminAuthorRouter from "./admin/ad_authors.mjs"
import adminRouter from "./admin/ad_users.mjs"


import usersRouter from "./users.mjs"
import authRouter from "./auth.mjs"
import itemRouter from "./items.mjs"
import publisherRouter from "./publishers.mjs"
import authorRouter from "./authors.mjs"
import genreRouter from "./genres.mjs"



const router = Router();
//user
router.use(usersRouter)
router.use(authRouter)
router.use(itemRouter)
router.use(publisherRouter)
router.use(authorRouter)
router.use(genreRouter)
//admin
router.use(adminRouter)
router.use(adminItemRouter)
router.use(adminGenreRouter)
router.use(adminPublisherRouter)
router.use(adminAuthorRouter)
export default router