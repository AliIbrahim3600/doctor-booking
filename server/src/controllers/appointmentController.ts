import { Response } from "express";
import Appointment from "../models/Appointment";
import Doctor from "../models/Doctor";
import { AuthRequest } from "../middleware/auth";

// @desc    Get appointments (filtered by role)
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let filter: Record<string, any> = {};

    // Patients see their own appointments
    if (req.user.role === "patient") {
      filter.patientId = req.user._id;
    }

    // Doctors see appointments assigned to them
    if (req.user.role === "doctor") {
      const doctorProfile = await Doctor.findOne({ userId: req.user._id });
      if (doctorProfile) {
        filter.doctorId = doctorProfile._id;
      } else {
        res.json([]);
        return;
      }
    }

    // Admins see all — no filter needed

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch appointments" });
  }
};

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private (Patient)
export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      patientId,
      patientName,
      doctorId,
      doctorName,
      speciality,
      date,
      time,
      fees,
      notes,
    } = req.body;

    const appointment = await Appointment.create({
      patientId: patientId || req.user._id,
      patientName: patientName || req.user.name,
      doctorId,
      doctorName,
      speciality,
      date,
      time,
      fees,
      notes,
      status: "pending",
    });

    res.status(201).json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to create appointment" });
  }
};

// @desc    Update appointment status
// @route   PATCH /api/appointments/:id/status
// @access  Private (Doctor/Admin)
export const updateAppointmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      res.status(400).json({ message: "Invalid status value" });
      return;
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to update status" });
  }
};
