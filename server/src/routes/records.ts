import { Router } from "express";
import { getRecords, createRecord, deleteRecord } from "../controllers/medicalRecordController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

router.get("/", protect, authorize("patient"), getRecords);
router.post("/", protect, authorize("patient"), createRecord);
router.delete("/:id", protect, authorize("patient"), deleteRecord);

export default router;
