import { Router } from "express";
import { 
  createSuggestion, 
  updateSuggestion,
  approveSuggestion,
  rejectSuggestion,
  getPendingSuggestions 
} from "../controllers/suggestion.controller";

const router = Router();

router.post("/", createSuggestion);
router.get("/pending", getPendingSuggestions);
router.put("/:id", updateSuggestion);
router.put("/:id/approve", approveSuggestion);
router.put("/:id/reject", rejectSuggestion);

export default router;