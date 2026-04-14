import { Router } from "express";
import {
  getAppointments,
  createAppointment,
  updateAppointmentStatus,
  rateAppointment,
} from "../controllers/appointmentController";
import { protect, authorize } from "../middleware/auth";

const router = Router();

// All authenticated users can view their appointments
router.get("/", protect, getAppointments);

// Patients create appointments
router.post("/", protect, authorize("patient"), createAppointment);

// Doctors and admins can update appointment status
router.patch("/:id/status", protect, authorize("doctor", "admin"), updateAppointmentStatus);

// Patients can rate completed appointments
router.patch("/:id/rate", protect, authorize("patient"), rateAppointment);

export default router;
