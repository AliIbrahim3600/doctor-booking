import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/axios";

// ── Types ──────────────────────────────────────────────
export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface Doctor {
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

export interface DoctorState {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    speciality: string;
    search: string;
    availability: string;
    minRating: number;
  };
}

// ── Initial State ──────────────────────────────────────
const initialState: DoctorState = {
  doctors: [],
  selectedDoctor: null,
  isLoading: false,
  error: null,
  filters: {
    speciality: "",
    search: "",
    availability: "",
    minRating: 0,
  },
};

// ── Async Thunks ───────────────────────────────────────

/* TODO: REMOVE THIS MOCK DATA LATER WHEN BACKEND IS READY */
const MOCK_DOCTORS: Doctor[] = [
  {
    _id: "1",
    name: "Dr. Sarah Jenkins",
    email: "doctor@mock.com",
    speciality: "Cardiology",
    experience: 12,
    fees: 150,
    rating: 4.9,
    about: "Specializing in non-invasive cardiac imaging and preventative heart health for over 12 years.",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmMPbVMP4X1w9vK-PskZrOCFzA5CP2e-jwgFBArs5xUkMvMK6f4C4oi6uFO1FHvou--NmyeOpBFDW1vLNBcDLMS4VfbcIuwQROG_c4g1HJZ4hkW2k1LXcMmCUnq4x9ih0A8bZDTQGlMBmMYD-dMw9qyCPVSNTbvP27q1B-5CkQE4OCDxn2n1H0EGPXwyrDuBE6Uzf4UVPxDnvySl1NUMhMGPGb1nryzqxGfqSjdmOfd6_b7h2FpOBH78CWPpuhaLG256R3mbADx-fE",
    isApproved: true,
    availability: [
      { day: new Date().toLocaleDateString("en-US", { weekday: "long" }), startTime: "09:00 AM", endTime: "05:00 PM" }, // Today simulation
      { day: "Wednesday", startTime: "09:00 AM", endTime: "05:00 PM" }
    ]
  },
  {
    _id: "2",
    name: "Dr. Michael Chen",
    email: "michael@example.com",
    speciality: "Internal Medicine",
    experience: 20,
    fees: 180,
    rating: 4.8,
    about: "Focuses on adult health and comprehensive diagnosis ranging from general checkups to complex illnesses.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+Michael+Chen&background=random",
    isApproved: true,
    availability: [
      { day: "Tuesday", startTime: "10:00 AM", endTime: "04:00 PM" }
    ]
  },
  {
    _id: "3",
    name: "Dr. Elena Rodriguez",
    email: "elena@example.com",
    speciality: "Pediatrics",
    experience: 15,
    fees: 100,
    rating: 5.0,
    about: "Dedicated to the health and well-being of infants, children, and adolescents.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+Elena+Rodriguez&background=random",
    isApproved: true,
    availability: [
      { day: "Friday", startTime: "11:00 AM", endTime: "06:00 PM" }
    ]
  },
  {
    _id: "4",
    name: "Dr. Kevin Thorne",
    email: "kevin@example.com",
    speciality: "Dermatology",
    experience: 8,
    fees: 120,
    rating: 4.6,
    about: "Expert in complex skin conditions and aesthetic dermatology.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+Kevin+Thorne&background=random",
    isApproved: true,
    availability: []
  },
  {
    _id: "5",
    name: "Dr. Rachel Adams",
    email: "rachel@example.com",
    speciality: "Neurology",
    experience: 14,
    fees: 200,
    rating: 4.9,
    about: "Specialist in treating disorders of the nervous system, including the brain and spinal cord.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+Rachel+Adams&background=random",
    isApproved: true,
    availability: [
      { day: new Date().toLocaleDateString("en-US", { weekday: "long" }), startTime: "10:00 AM", endTime: "03:00 PM" }
    ]
  },
  {
    _id: "6",
    name: "Dr. David Smith",
    email: "david@example.com",
    speciality: "Cardiology",
    experience: 25,
    fees: 250,
    rating: 5.0,
    about: "World-renowned cardiologist with over two decades of critical surgical experience.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+David+Smith&background=random",
    isApproved: true,
    availability: [
      { day: "Monday", startTime: "08:00 AM", endTime: "12:00 PM" }
    ]
  },
  {
    _id: "7",
    name: "Dr. Olivia Brooks",
    email: "olivia@example.com",
    speciality: "Pediatrics",
    experience: 6,
    fees: 90,
    rating: 4.7,
    about: "Compassionate pediatrician committed to providing a friendly and warm environment for kids.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+Olivia+Brooks&background=random",
    isApproved: true,
    availability: []
  },
  {
    _id: "8",
    name: "Dr. James Lee",
    email: "james@example.com",
    speciality: "Internal Medicine",
    experience: 18,
    fees: 160,
    rating: 4.5,
    about: "Expert diagnostician for treating acute and chronic adult illnesses.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+James+Lee&background=random",
    isApproved: true,
    availability: [
      { day: "Thursday", startTime: "09:00 AM", endTime: "05:00 PM" }
    ]
  },
  {
    _id: "9",
    name: "Dr. Sofia Martinez",
    email: "sofia@example.com",
    speciality: "Dermatology",
    experience: 10,
    fees: 130,
    rating: 4.8,
    about: "Specialized in advanced laser therapies and aesthetic treatments.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+Sofia+Martinez&background=random",
    isApproved: true,
    availability: [
      { day: "Friday", startTime: "10:00 AM", endTime: "06:00 PM" }
    ]
  },
  {
    _id: "10",
    name: "Dr. William Johnson",
    email: "william@example.com",
    speciality: "Neurology",
    experience: 22,
    fees: 210,
    rating: 4.9,
    about: "Leading researcher and physician focusing on neurodegenerative diseases.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+William+Johnson&background=random",
    isApproved: true,
    availability: []
  },
  {
    _id: "11",
    name: "Dr. Emma Wilson",
    email: "emma@example.com",
    speciality: "Pediatrics",
    experience: 4,
    fees: 80,
    rating: 4.4,
    about: "Energetic and friendly pediatrician specializing in infant and toddler care.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+Emma+Wilson&background=random",
    isApproved: true,
    availability: [
      { day: "Wednesday", startTime: "09:00 AM", endTime: "01:00 PM" }
    ]
  },
  {
    _id: "12",
    name: "Dr. Lucas Garcia",
    email: "lucas@example.com",
    speciality: "Internal Medicine",
    experience: 16,
    fees: 155,
    rating: 4.7,
    about: "Focuses on preventative medicine and holistic approaches to adult health.",
    avatar: "https://ui-avatars.com/api/?name=Dr.+Lucas+Garcia&background=random",
    isApproved: true,
    availability: [
      { day: "Tuesday", startTime: "08:00 AM", endTime: "04:00 PM" }
    ]
  }
];

/*
export const fetchDoctors = createAsyncThunk(
  "doctor/fetchDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/doctors");
      return response.data; // array of Doctors
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch doctors");
    }
  }
);
*/

/* TODO: REMOVE THIS  WHEN BACKEND IS READY */
export const fetchDoctors = createAsyncThunk(
  "doctor/fetchDoctors",
  async (_, { rejectWithValue }) => {
    return new Promise<Doctor[]>((resolve) => setTimeout(() => resolve(MOCK_DOCTORS), 800));
  }
);

/*
export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchDoctorById",
  async (doctorId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/doctors/${doctorId}`);
      return response.data; // single Doctor
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch doctor details");
    }
  }
);
*/

/* TODO: REMOVE THIS  WHEN BACKEND IS READY */
export const fetchDoctorById = createAsyncThunk(
  "doctor/fetchDoctorById",
  async (doctorId: string, { rejectWithValue }) => {
    return new Promise<Doctor>((resolve, reject) => {
      setTimeout(() => {
        const doc = MOCK_DOCTORS.find(d => d._id === doctorId);
        if (doc) resolve(doc);
        else rejectWithValue("Doctor not found");
      }, 500);
});
  }
);

/* Mock Update Availability */
export const updateDoctorAvailabilityAsync = createAsyncThunk(
  "doctor/updateAvailability",
  async ({ doctorId, availability }: { doctorId: string; availability: TimeSlot[] }, { rejectWithValue }) => {
    return new Promise<{ _id: string; availability: TimeSlot[] }>((resolve) => {
      setTimeout(() => {
        resolve({ _id: doctorId, availability });
      }, 500);
    });
  }
);

/* Mock Update Profile */
export const updateDoctorProfileAsync = createAsyncThunk(
  "doctor/updateProfile",
  async (profileData: Partial<Doctor> & { doctorId: string }, { rejectWithValue }) => {
    return new Promise<Partial<Doctor> & { _id: string }>((resolve) => {
      setTimeout(() => {
        const payload = { ...profileData, _id: profileData.doctorId };
        resolve(payload as Partial<Doctor> & { _id: string });
      }, 500);
    });
  }
);

// ── Slice ──────────────────────────────────────────────
const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    /** Set the currently selected doctor explicitly if needed */
    setSelectedDoctor(state, action: PayloadAction<Doctor | null>) {
      state.selectedDoctor = action.payload;
    },

    /** Update speciality filter */
    setSpecialityFilter(state, action: PayloadAction<string>) {
      state.filters.speciality = action.payload;
    },

    /** Update search query filter */
    setSearchFilter(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },

    /** Update availability filter */
    setAvailabilityFilter(state, action: PayloadAction<string>) {
      state.filters.availability = action.payload;
    },

    /** Update min rating filter */
    setMinRatingFilter(state, action: PayloadAction<number>) {
      state.filters.minRating = action.payload;
    },

    /** Reset all filters */
    clearFilters(state) {
      state.filters = { speciality: "", search: "", availability: "", minRating: 0 };
    },

    /** Clear doctor-related errors */
    clearDoctorError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Doctors
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Single Doctor
      .addCase(fetchDoctorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Doctor Availability
      .addCase(updateDoctorAvailabilityAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDoctorAvailabilityAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedDoctor && state.selectedDoctor._id === action.payload._id) {
          state.selectedDoctor = { ...state.selectedDoctor, ...action.payload } as Doctor;
        }
        const index = state.doctors.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.doctors[index] = { ...state.doctors[index], ...action.payload };
        }
      })
      .addCase(updateDoctorAvailabilityAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Doctor Profile
      .addCase(updateDoctorProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDoctorProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.selectedDoctor && state.selectedDoctor._id === action.payload._id) {
          state.selectedDoctor = { ...state.selectedDoctor, ...action.payload } as Doctor;
        }
        const index = state.doctors.findIndex(d => d._id === action.payload._id);
        if (index !== -1) {
          state.doctors[index] = { ...state.doctors[index], ...action.payload };
        }
      })
      .addCase(updateDoctorProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedDoctor,
  setSpecialityFilter,
  setSearchFilter,
  setAvailabilityFilter,
  setMinRatingFilter,
  clearFilters,
  clearDoctorError,
} = doctorSlice.actions;

export default doctorSlice.reducer;
