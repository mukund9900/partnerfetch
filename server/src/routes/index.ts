import { Router } from "express"
import {getPartners, fetchPartnersWithInKmRange} from "../controllers/partners/index"

const router: Router = Router()

router.get("/getall", getPartners)

router.post("/range", fetchPartnersWithInKmRange)


export default router