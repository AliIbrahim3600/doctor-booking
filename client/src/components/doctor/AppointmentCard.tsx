import React from "react";
import { useAppDispatch } from "../../store/store";
import { updateAppointmentStatusAsync} from "../../store/slices/appointmentSlice";
import type { Appointment } from "../../store/slices/appointmentSlice";

interface AppointmentCardProps {
  appointment: Appointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const dispatch = useAppDispatch();

  const handleUpdateStatus = (status: "confirmed" | "cancelled" | "completed") => {
    dispatch(updateAppointmentStatusAsync({ id: appointment._id, status }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-xs font-bold">Confirmed</span>;
      case "pending":
         return <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-xs font-bold">Pending</span>;
      case "completed":
         return <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">Completed</span>;
      case "cancelled":
         return <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">Cancelled</span>;
      default:
         return null;
    }
  };

  return (
    <tr className="bg-surface hover:bg-surface-container-low transition-colors rounded-xl shadow-sm border border-outline-variant/10">
      <td className="py-4 pl-4 rounded-l-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold">
            {appointment.patientName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-on-surface">{appointment.patientName}</p>
            <p className="text-xs text-on-surface-variant">{appointment.speciality || "Consultation"}</p>
          </div>
        </div>
      </td>
      <td className="py-4 font-medium tabular-nums text-on-surface">
        {appointment.date} <span className="text-on-surface-variant text-xs block">{appointment.time}</span>
      </td>
      <td className="py-4">
        {getStatusBadge(appointment.status)}
      </td>
      <td className="py-4 pr-4 text-right rounded-r-xl w-32">
         <div className="flex justify-end gap-2">
           {appointment.status === "pending" && (
            <>
              <button onClick={() => handleUpdateStatus("confirmed")} className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors" title="Confirm">
                 <span className="material-symbols-outlined">check_circle</span>
              </button>
              <button onClick={() => handleUpdateStatus("cancelled")} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Cancel">
                 <span className="material-symbols-outlined">cancel</span>
              </button>
            </>
           )}
           {appointment.status === "confirmed" && (
             <button onClick={() => handleUpdateStatus("completed")} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="Mark Completed">
                 <span className="material-symbols-outlined">task_alt</span>
              </button>
           )}
         </div>
      </td>
    </tr>
  );
};

export default AppointmentCard;
