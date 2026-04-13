import mongoose, { Document, Schema } from "mongoose";

export interface ITimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface IDoctor extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  speciality: string;
  experience: number;
  fees: number;
  avatar: string;
  phone: string;
  about: string;
  availability: ITimeSlot[];
  isApproved: boolean;
  rating: number;
}

const timeSlotSchema = new Schema<ITimeSlot>(
  {
    day: {
      type: String,
      required: true,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const doctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: [true, "Speciality is required"],
    },
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    fees: {
      type: Number,
      required: true,
      min: 0,
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    availability: {
      type: [timeSlotSchema],
      default: [],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDoctor>("Doctor", doctorSchema);
