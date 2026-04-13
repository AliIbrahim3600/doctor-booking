# Doctor Booking — MongoDB Database Schema & Seed Data

> **Created:** 2026-04-13
> **Purpose:** Define the MongoDB collections, Mongoose schemas, and provide ready-to-use seed data for the Doctor Booking application.

---

## 1. Database Name

```
doctor_booking
```

---

## 2. Collections Overview

| Collection       | Description                            |
|------------------|----------------------------------------|
| `users`          | All users (patients, doctors, admins)  |
| `doctors`        | Doctor profiles with availability      |
| `appointments`   | Appointment bookings between patients and doctors |

---

## 3. Schemas (Mongoose Models)

### 3.1 User Schema (`users` collection)

This is the authentication/identity model. All roles share the same collection.

```js
// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
```

**Frontend expects from API responses:**
```ts
interface User {
  _id: string;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  avatar?: string;
  phone?: string;
}
```

---

### 3.2 Doctor Schema (`doctors` collection)

Separate from User so doctor-specific fields (speciality, fees, availability) are cleanly isolated. Links to a User document via `userId`.

```js
// models/Doctor.js
const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    startTime: {
      type: String,
      required: true, // e.g. "09:00 AM"
    },
    endTime: {
      type: String,
      required: true, // e.g. "05:00 PM"
    },
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
      enum: [
        "Cardiology",
        "Internal Medicine",
        "Pediatrics",
        "Dermatology",
        "Neurology",
        "Orthopedics",
        "Gynecology",
        "General Physician",
      ],
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

module.exports = mongoose.model("Doctor", doctorSchema);
```

**Frontend expects from API responses:**
```ts
interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

interface Doctor {
  _id: string;
  name: string;
  email: string;
  speciality: string;
  experience: number;
  fees: number;
  avatar?: string;
  phone?: string;
  about?: string;
  availability: TimeSlot[];
  isApproved: boolean;
  rating?: number;
}
```

---

### 3.3 Appointment Schema (`appointments` collection)

```js
// models/Appointment.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true, // e.g. "Apr 13, 2026"
    },
    time: {
      type: String,
      required: true, // e.g. "09:00 AM"
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    fees: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
```

**Frontend expects from API responses:**
```ts
interface Appointment {
  _id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  speciality: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  fees: number;
  notes?: string;
  createdAt: string;
}
```

---

## 4. API Endpoints Expected by Frontend

Base URL: `http://localhost:5000/api`

### Auth Routes (`/api/auth`)

| Method | Endpoint           | Body                                      | Response                  |
|--------|--------------------|--------------------------------------------|---------------------------|
| POST   | `/auth/register`   | `{ name, email, password, role }`          | `{ user, token }`         |
| POST   | `/auth/login`      | `{ email, password }`                      | `{ user, token }`         |

### Doctor Routes (`/api/doctors`)

| Method | Endpoint                       | Body / Params               | Response            |
|--------|--------------------------------|-----------------------------|---------------------|
| GET    | `/doctors`                     | —                           | `Doctor[]`          |
| GET    | `/doctors/:id`                 | —                           | `Doctor`            |
| PUT    | `/doctors/:id/availability`    | `{ availability: TimeSlot[] }` | Updated `Doctor`  |
| PUT    | `/doctors/:id/profile`         | `Partial<Doctor>`           | Updated `Doctor`    |

### Appointment Routes (`/api/appointments`)

| Method | Endpoint                        | Body                         | Response               |
|--------|---------------------------------|------------------------------|------------------------|
| GET    | `/appointments`                 | —                            | `Appointment[]`        |
| POST   | `/appointments`                 | `Partial<Appointment>`       | Created `Appointment`  |
| PATCH  | `/appointments/:id/status`      | `{ status }`                 | Updated `Appointment`  |

> **Note:** All protected routes require `Authorization: Bearer <token>` header (handled automatically by the Axios interceptor).

---

## 5. Sample Seed Data

Use this script to seed your MongoDB with test data. All passwords are `123456`.

### `seed.js`

```js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ─── Connect ───────────────────────────────────────────
const MONGO_URI = "mongodb://localhost:27017/doctor_booking";

mongoose.connect(MONGO_URI).then(() => {
  console.log("✅ Connected to MongoDB");
  seed();
});

// ─── Inline Models (or import from your models/) ──────
// For simplicity, paste or require your models here.
const User = require("./models/User");
const Doctor = require("./models/Doctor");
const Appointment = require("./models/Appointment");

async function seed() {
  // Clear existing data
  await User.deleteMany({});
  await Doctor.deleteMany({});
  await Appointment.deleteMany({});

  console.log("🗑️  Cleared existing data");

  // ──────────────────────────────────────────────────────
  // 1. CREATE USERS
  // ──────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("123456", 10);

  const users = await User.insertMany([
    // Patients
    {
      name: "Ahmed Patient",
      email: "patient@test.com",
      password: hashedPassword,
      role: "patient",
      phone: "+20 100 123 4567",
    },
    {
      name: "John Doe",
      email: "john@test.com",
      password: hashedPassword,
      role: "patient",
      phone: "+20 100 234 5678",
    },
    {
      name: "Emily Smith",
      email: "emily@test.com",
      password: hashedPassword,
      role: "patient",
    },
    {
      name: "Michael Brown",
      email: "michael@test.com",
      password: hashedPassword,
      role: "patient",
    },
    {
      name: "Jessica Taylor",
      email: "jessica@test.com",
      password: hashedPassword,
      role: "patient",
    },
    // Doctors (user accounts)
    {
      name: "Dr. Sarah Jenkins",
      email: "sarah@test.com",
      password: hashedPassword,
      role: "doctor",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0D8ABC&color=fff",
    },
    {
      name: "Dr. Michael Chen",
      email: "chen@test.com",
      password: hashedPassword,
      role: "doctor",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=2E86AB&color=fff",
    },
    {
      name: "Dr. Elena Rodriguez",
      email: "elena@test.com",
      password: hashedPassword,
      role: "doctor",
      avatar: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=A23B72&color=fff",
    },
    {
      name: "Dr. Kevin Thorne",
      email: "kevin@test.com",
      password: hashedPassword,
      role: "doctor",
      avatar: "https://ui-avatars.com/api/?name=Kevin+Thorne&background=F18F01&color=fff",
    },
    {
      name: "Dr. Rachel Adams",
      email: "rachel@test.com",
      password: hashedPassword,
      role: "doctor",
      avatar: "https://ui-avatars.com/api/?name=Rachel+Adams&background=C73E1D&color=fff",
    },
    {
      name: "Dr. David Smith",
      email: "david@test.com",
      password: hashedPassword,
      role: "doctor",
      avatar: "https://ui-avatars.com/api/?name=David+Smith&background=3B1F2B&color=fff",
    },
    // Admin
    {
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      role: "admin",
    },
  ]);

  console.log(`👤 Created ${users.length} users`);

  // Map for easy lookup
  const userMap = {};
  users.forEach((u) => (userMap[u.email] = u));

  // ──────────────────────────────────────────────────────
  // 2. CREATE DOCTOR PROFILES
  // ──────────────────────────────────────────────────────
  const doctors = await Doctor.insertMany([
    {
      userId: userMap["sarah@test.com"]._id,
      name: "Dr. Sarah Jenkins",
      email: "sarah@test.com",
      speciality: "Cardiology",
      experience: 12,
      fees: 150,
      rating: 4.9,
      about: "Specializing in non-invasive cardiac imaging and preventative heart health for over 12 years.",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Jenkins&background=0D8ABC&color=fff",
      isApproved: true,
      availability: [
        { day: "Monday", startTime: "09:00 AM", endTime: "05:00 PM" },
        { day: "Wednesday", startTime: "09:00 AM", endTime: "05:00 PM" },
        { day: "Friday", startTime: "09:00 AM", endTime: "01:00 PM" },
      ],
    },
    {
      userId: userMap["chen@test.com"]._id,
      name: "Dr. Michael Chen",
      email: "chen@test.com",
      speciality: "Internal Medicine",
      experience: 20,
      fees: 180,
      rating: 4.8,
      about: "Focuses on adult health and comprehensive diagnosis ranging from general checkups to complex illnesses.",
      avatar: "https://ui-avatars.com/api/?name=Michael+Chen&background=2E86AB&color=fff",
      isApproved: true,
      availability: [
        { day: "Tuesday", startTime: "10:00 AM", endTime: "04:00 PM" },
        { day: "Thursday", startTime: "10:00 AM", endTime: "04:00 PM" },
      ],
    },
    {
      userId: userMap["elena@test.com"]._id,
      name: "Dr. Elena Rodriguez",
      email: "elena@test.com",
      speciality: "Pediatrics",
      experience: 15,
      fees: 100,
      rating: 5.0,
      about: "Dedicated to the health and well-being of infants, children, and adolescents.",
      avatar: "https://ui-avatars.com/api/?name=Elena+Rodriguez&background=A23B72&color=fff",
      isApproved: true,
      availability: [
        { day: "Monday", startTime: "11:00 AM", endTime: "06:00 PM" },
        { day: "Friday", startTime: "11:00 AM", endTime: "06:00 PM" },
      ],
    },
    {
      userId: userMap["kevin@test.com"]._id,
      name: "Dr. Kevin Thorne",
      email: "kevin@test.com",
      speciality: "Dermatology",
      experience: 8,
      fees: 120,
      rating: 4.6,
      about: "Expert in complex skin conditions and aesthetic dermatology.",
      avatar: "https://ui-avatars.com/api/?name=Kevin+Thorne&background=F18F01&color=fff",
      isApproved: true,
      availability: [
        { day: "Wednesday", startTime: "09:00 AM", endTime: "03:00 PM" },
      ],
    },
    {
      userId: userMap["rachel@test.com"]._id,
      name: "Dr. Rachel Adams",
      email: "rachel@test.com",
      speciality: "Neurology",
      experience: 14,
      fees: 200,
      rating: 4.9,
      about: "Specialist in treating disorders of the nervous system, including the brain and spinal cord.",
      avatar: "https://ui-avatars.com/api/?name=Rachel+Adams&background=C73E1D&color=fff",
      isApproved: true,
      availability: [
        { day: "Tuesday", startTime: "10:00 AM", endTime: "03:00 PM" },
        { day: "Thursday", startTime: "10:00 AM", endTime: "03:00 PM" },
      ],
    },
    {
      userId: userMap["david@test.com"]._id,
      name: "Dr. David Smith",
      email: "david@test.com",
      speciality: "Cardiology",
      experience: 25,
      fees: 250,
      rating: 5.0,
      about: "World-renowned cardiologist with over two decades of critical surgical experience.",
      avatar: "https://ui-avatars.com/api/?name=David+Smith&background=3B1F2B&color=fff",
      isApproved: false, // Not yet approved by admin
      availability: [
        { day: "Monday", startTime: "08:00 AM", endTime: "12:00 PM" },
      ],
    },
  ]);

  console.log(`🩺 Created ${doctors.length} doctor profiles`);

  // Doctor map for appointments
  const doctorMap = {};
  doctors.forEach((d) => (doctorMap[d.email] = d));

  // ──────────────────────────────────────────────────────
  // 3. CREATE APPOINTMENTS
  // ──────────────────────────────────────────────────────
  const today = new Date();
  const fmt = (d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const appointments = await Appointment.insertMany([
    {
      patientId: userMap["patient@test.com"]._id,
      patientName: "Ahmed Patient",
      doctorId: doctorMap["sarah@test.com"]._id,
      doctorName: "Dr. Sarah Jenkins",
      speciality: "Cardiology",
      date: fmt(today),
      time: "09:00 AM",
      status: "pending",
      fees: 150,
      notes: "Regular checkup",
    },
    {
      patientId: userMap["john@test.com"]._id,
      patientName: "John Doe",
      doctorId: doctorMap["sarah@test.com"]._id,
      doctorName: "Dr. Sarah Jenkins",
      speciality: "Cardiology",
      date: fmt(today),
      time: "11:30 AM",
      status: "confirmed",
      fees: 150,
    },
    {
      patientId: userMap["emily@test.com"]._id,
      patientName: "Emily Smith",
      doctorId: doctorMap["sarah@test.com"]._id,
      doctorName: "Dr. Sarah Jenkins",
      speciality: "Cardiology",
      date: fmt(yesterday),
      time: "03:00 PM",
      status: "completed",
      fees: 150,
      notes: "Follow-up on ECG results",
    },
    {
      patientId: userMap["michael@test.com"]._id,
      patientName: "Michael Brown",
      doctorId: doctorMap["chen@test.com"]._id,
      doctorName: "Dr. Michael Chen",
      speciality: "Internal Medicine",
      date: fmt(today),
      time: "02:00 PM",
      status: "pending",
      fees: 180,
    },
    {
      patientId: userMap["jessica@test.com"]._id,
      patientName: "Jessica Taylor",
      doctorId: doctorMap["chen@test.com"]._id,
      doctorName: "Dr. Michael Chen",
      speciality: "Internal Medicine",
      date: fmt(tomorrow),
      time: "09:30 AM",
      status: "confirmed",
      fees: 180,
      notes: "Annual physical exam",
    },
    {
      patientId: userMap["patient@test.com"]._id,
      patientName: "Ahmed Patient",
      doctorId: doctorMap["elena@test.com"]._id,
      doctorName: "Dr. Elena Rodriguez",
      speciality: "Pediatrics",
      date: fmt(yesterday),
      time: "10:15 AM",
      status: "completed",
      fees: 100,
    },
    {
      patientId: userMap["john@test.com"]._id,
      patientName: "John Doe",
      doctorId: doctorMap["rachel@test.com"]._id,
      doctorName: "Dr. Rachel Adams",
      speciality: "Neurology",
      date: fmt(nextWeek),
      time: "01:45 PM",
      status: "pending",
      fees: 200,
      notes: "Recurring migraines consultation",
    },
    {
      patientId: userMap["emily@test.com"]._id,
      patientName: "Emily Smith",
      doctorId: doctorMap["kevin@test.com"]._id,
      doctorName: "Dr. Kevin Thorne",
      speciality: "Dermatology",
      date: fmt(tomorrow),
      time: "10:00 AM",
      status: "cancelled",
      fees: 120,
    },
  ]);

  console.log(`📅 Created ${appointments.length} appointments`);

  // ──────────────────────────────────────────────────────
  // Done
  // ──────────────────────────────────────────────────────
  console.log("\n🎉 Seeding complete!");
  console.log("\n── Login Credentials ──────────────────────");
  console.log("Patient:  patient@test.com  /  123456");
  console.log("Doctor:   sarah@test.com    /  123456");
  console.log("Admin:    admin@test.com    /  123456");
  console.log("───────────────────────────────────────────\n");

  mongoose.connection.close();
}
```

---

## 6. Quick Login Credentials

| Role     | Email              | Password |
|----------|--------------------|----------|
| Patient  | `patient@test.com` | `123456` |
| Patient  | `john@test.com`    | `123456` |
| Doctor   | `sarah@test.com`   | `123456` |
| Doctor   | `chen@test.com`    | `123456` |
| Admin    | `admin@test.com`   | `123456` |

---

## 7. How to Seed

```bash
# From the server/ directory
cd server
node seed.js
```

Make sure:
1. MongoDB is running locally on port `27017` (or update `MONGO_URI`)
2. Your `models/` directory has `User.js`, `Doctor.js`, and `Appointment.js`
3. You have `mongoose` and `bcryptjs` installed (`npm install mongoose bcryptjs`)

---

## 8. Environment Variables

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/doctor_booking
JWT_SECRET=your_jwt_secret_key_change_this
JWT_EXPIRES_IN=7d
```

And optionally in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```
