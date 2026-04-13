import { Response } from "express";
import Doctor from "../models/Doctor";
import { AuthRequest } from "../middleware/auth";

// @desc    Get all doctors (approved only for public)
// @route   GET /api/doctors
// @access  Public
export const getDoctors = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const filter = req.query.all === "true" ? {} : { isApproved: true };
    const doctors = await Doctor.find(filter).sort({ createdAt: -1 });
    res.json(doctors);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch doctors" });
  }
};

// @desc    Get a single doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
export const getDoctorById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }
    res.json(doctor);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to fetch doctor" });
  }
};

// @desc    Update doctor availability
// @route   PUT /api/doctors/:id/availability
// @access  Private (Doctor)
export const updateAvailability = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { availability } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true, runValidators: true }
    );

    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    res.json(doctor);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to update availability" });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id/profile
// @access  Private (Doctor)
export const updateDoctorProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const allowedFields = [
      "name",
      "speciality",
      "experience",
      "fees",
      "avatar",
      "phone",
      "about",
    ];
    const updates: Record<string, any> = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    res.json(doctor);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};

// @desc    Approve or reject a doctor
// @route   PATCH /api/doctors/:id/approve
// @access  Private (Admin)
export const approveDoctor = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { isApproved } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    );

    if (!doctor) {
      res.status(404).json({ message: "Doctor not found" });
      return;
    }

    res.json(doctor);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to update approval" });
  }
};
