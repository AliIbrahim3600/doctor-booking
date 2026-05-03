import { Response } from "express";
import MedicalRecord from "../models/MedicalRecord";
import { AuthRequest } from "../middleware/auth";

// @desc    Get medical records for current patient
// @route   GET /api/records
// @access  Private (Patient)
export const getRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user._id }).sort({ date: -1 });
    res.json(records);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch records";
    res.status(500).json({ message });
  }
};

// @desc    Create a new medical record
// @route   POST /api/records
// @access  Private (Patient)
export const createRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, category, fileUrl, description, date } = req.body;

    const record = await MedicalRecord.create({
      patientId: req.user._id,
      title,
      category,
      fileUrl,
      description,
      date: date || Date.now(),
    });

    res.status(201).json(record);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create record";
    res.status(500).json({ message });
  }
};

// @desc    Delete a medical record
// @route   DELETE /api/records/:id
// @access  Private (Patient)
export const deleteRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await MedicalRecord.findById(req.params.id);

    if (!record) {
      res.status(404).json({ message: "Record not found" });
      return;
    }

    if (record.patientId.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "Unauthorized to delete this record" });
      return;
    }

    await record.deleteOne();
    res.json({ message: "Record deleted successfully" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete record";
    res.status(500).json({ message });
  }
};
