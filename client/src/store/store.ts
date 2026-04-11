import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import authReducer from "./slices/authSlice";
import doctorReducer from "./slices/doctorSlice";
import appointmentReducer from "./slices/appointmentSlice";

// ── Store Configuration ────────────────────────────────
export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    appointment: appointmentReducer,
  },
});

// ── Typed Hooks ────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/** Pre-typed `useDispatch` — use this instead of plain `useDispatch` */
export const useAppDispatch: () => AppDispatch = useDispatch;

/** Pre-typed `useSelector` — use this instead of plain `useSelector` */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
