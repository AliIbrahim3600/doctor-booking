import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import dns from "dns";

// Fix for Node.js SRV resolution issue on certain Windows/ISP networks
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

import User from "./models/User";
import Doctor from "./models/Doctor";
import Appointment from "./models/Appointment";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/doctor_booking";

async function seed(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Appointment.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // ────────────────────────────────────────────────────
    // 1. CREATE USERS
    // ────────────────────────────────────────────────────
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
    const userMap: Record<string, any> = {};
    users.forEach((u) => (userMap[u.email] = u));

    // ────────────────────────────────────────────────────
    // 2. CREATE DOCTOR PROFILES
    // ────────────────────────────────────────────────────
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
          { day: 'Monday', startTime: '09:00 AM', endTime: '04:00 PM' },
          { day: 'Tuesday', startTime: '10:00 AM', endTime: '05:00 PM' },
          { day: 'Wednesday', startTime: '09:00 AM', endTime: '03:00 PM' },
          { day: 'Thursday', startTime: '11:00 AM', endTime: '06:00 PM' },
          { day: 'Friday', startTime: '08:00 AM', endTime: '02:00 PM' }
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
          { day: 'Monday', startTime: '09:00 AM', endTime: '04:00 PM' },
          { day: 'Tuesday', startTime: '10:00 AM', endTime: '05:00 PM' },
          { day: 'Wednesday', startTime: '09:00 AM', endTime: '03:00 PM' },
          { day: 'Thursday', startTime: '11:00 AM', endTime: '06:00 PM' },
          { day: 'Friday', startTime: '08:00 AM', endTime: '02:00 PM' }
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
          { day: 'Monday', startTime: '09:00 AM', endTime: '04:00 PM' },
          { day: 'Tuesday', startTime: '10:00 AM', endTime: '05:00 PM' },
          { day: 'Wednesday', startTime: '09:00 AM', endTime: '03:00 PM' },
          { day: 'Thursday', startTime: '11:00 AM', endTime: '06:00 PM' },
          { day: 'Friday', startTime: '08:00 AM', endTime: '02:00 PM' }
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
          { day: 'Monday', startTime: '09:00 AM', endTime: '04:00 PM' },
          { day: 'Tuesday', startTime: '10:00 AM', endTime: '05:00 PM' },
          { day: 'Wednesday', startTime: '09:00 AM', endTime: '03:00 PM' },
          { day: 'Thursday', startTime: '11:00 AM', endTime: '06:00 PM' },
          { day: 'Friday', startTime: '08:00 AM', endTime: '02:00 PM' }
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
          { day: 'Monday', startTime: '09:00 AM', endTime: '04:00 PM' },
          { day: 'Tuesday', startTime: '10:00 AM', endTime: '05:00 PM' },
          { day: 'Wednesday', startTime: '09:00 AM', endTime: '03:00 PM' },
          { day: 'Thursday', startTime: '11:00 AM', endTime: '06:00 PM' },
          { day: 'Friday', startTime: '08:00 AM', endTime: '02:00 PM' }
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
        isApproved: false,
        availability: [
          { day: 'Monday', startTime: '09:00 AM', endTime: '04:00 PM' },
          { day: 'Tuesday', startTime: '10:00 AM', endTime: '05:00 PM' },
          { day: 'Wednesday', startTime: '09:00 AM', endTime: '03:00 PM' },
          { day: 'Thursday', startTime: '11:00 AM', endTime: '06:00 PM' },
          { day: 'Friday', startTime: '08:00 AM', endTime: '02:00 PM' }
        ],
      },
    ]);

    console.log(`🩺 Created ${doctors.length} doctor profiles`);

    // Doctor map
    const doctorMap: Record<string, any> = {};
    doctors.forEach((d) => (doctorMap[d.email] = d));

    // ────────────────────────────────────────────────────
    // 3. CREATE APPOINTMENTS
    // ────────────────────────────────────────────────────
    const today = new Date();
    const fmt = (d: Date): string => d.toISOString().split('T')[0];

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

    console.log("\n🎉 Seeding complete!");
    console.log("\n── Login Credentials ──────────────────────");
    console.log("Patient:  patient@test.com  /  123456");
    console.log("Doctor:   sarah@test.com    /  123456");
    console.log("Admin:    admin@test.com    /  123456");
    console.log("───────────────────────────────────────────\n");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seed();
