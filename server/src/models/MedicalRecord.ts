import mongoose, { Document, Schema } from "mongoose";

export interface IMedicalRecord extends Document {
  patientId: mongoose.Types.ObjectId;
  title: string;
  category: string;
  fileUrl?: string;
  description?: string;
  date: Date;
  createdAt: Date;
}

const MedicalRecordSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["lab_report", "prescription", "imaging", "clinical_note", "other"],
    },
    fileUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMedicalRecord>("MedicalRecord", MedicalRecordSchema);
