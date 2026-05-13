import { Router } from "express";
import {
  getWords,
  searchWords,
  createWord,
  updateWord,
  deleteWord
} from "../controllers/word.controller";

const router = Router();

router.get("/", getWords);
router.get("/search", searchWords);
router.post("/", createWord);
router.put("/:id", updateWord);
router.delete("/:id", deleteWord);

export default router;