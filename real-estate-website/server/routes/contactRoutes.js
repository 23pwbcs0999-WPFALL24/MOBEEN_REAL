import { Router } from "express";
import { submitInquiry } from "../controllers/contactController.js";

const router = Router();

router.post("/inquiry", submitInquiry);

export default router;
