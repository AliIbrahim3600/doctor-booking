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

// @desc    Rate an appointment
// @route   PATCH /api/appointments/:id/rate
// @access  Private (Patient)
export const rateAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ message: "Please provide a rating between 1 and 5" });
      return;
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      res.status(404).json({ message: "Appointment not found" });
      return;
    }

    // Check if the appointment belongs to the patient
    if (appointment.patientId.toString() !== req.user?._id.toString()) {
      res.status(403).json({ message: "Unauthorized to rate this appointment" });
      return;
    }

    // Only completed appointments can be rated
    if (appointment.status !== "completed") {
      res.status(400).json({ message: "Only completed appointments can be rated" });
      return;
    }

    // Check if appointment is already rated
    if (appointment.rating) {
      res.status(400).json({ message: "Appointment is already rated" });
      return;
    }

    // Update appointment
    appointment.rating = rating;
    appointment.review = review || "";
    await appointment.save();

    // Update doctor average rating
    const doctor = await Doctor.findById(appointment.doctorId);
    if (doctor) {
      const currentTotalRating = (doctor.rating || 0) * (doctor.numReviews || 0);
      doctor.numReviews = (doctor.numReviews || 0) + 1;
      doctor.rating = (currentTotalRating + rating) / doctor.numReviews;
      await doctor.save();
    }

    res.json(appointment);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to submit rating" });
  }
};

// @desc    Get reviews for a doctor
// @route   GET /api/doctors/:id/reviews
// @access  Public
export const getDoctorReviews = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reviews = await Appointment.find({
      doctorId: req.params.id,
      rating: { $exists: true }
    })
    .select("patientName rating review date createdAt")
    .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch reviews" });
  }
};

