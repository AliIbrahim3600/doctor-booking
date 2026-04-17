import { Router } from "express";
import {
  getDoctors,
  getDoctorById,
  updateAvailability,
  updateDoctorProfile,
  approveDoctor,
  deleteDoctor,
} from "../controllers/doctorController";
import { getDoctorReviews } from "../controllers/appointmentController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// Public
router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/reviews", getDoctorReviews);

// Doctor only
router.put("/:id/availability", protect, authorize("doctor"), updateAvailability);
router.put("/:id/profile", protect, authorize("doctor"), updateDoctorProfile);

// Admin only
router.patch("/:id/approve", protect, authorize("admin"), approveDoctor);
router.delete("/:id", protect, authorize("admin"), deleteDoctor);

export default router;
