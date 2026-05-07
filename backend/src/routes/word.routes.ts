import { Router } from "express";
import {
  getWords,
  searchWords,
  createWord,
} from "../controllers/word.controller";

const router = Router();

router.get("/", getWords);
router.get("/search", searchWords);
router.post("/", createWord);

export default router;