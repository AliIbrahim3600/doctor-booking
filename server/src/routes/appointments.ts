import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// All authenticated users can view their appointments
router.get("/", protect, getAppointments);

// Patients create appointments
router.post("/", protect, authorize("patient"), createAppointment);

// Doctors and admins can update appointment status
router.patch("/:id/status", protect, authorize("doctor", "admin"), updateAppointmentStatus);

export default router;
