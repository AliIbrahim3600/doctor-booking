import type { Appointment } from "../../store/slices/appointmentSlice";
import AppointmentCard from "./AppointmentCard";
interface AppointmentTableProps {
  appointmentsList: Appointment[];
  isLoading?: boolean;
}

const AppointmentTable: React.FC<AppointmentTableProps> = ({ appointmentsList, isLoading }) => {
  if (isLoading && appointmentsList.length === 0) {
    return <div className="p-8 text-center text-on-surface-variant animate-pulse font-bold">Loading appointments...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-on-surface-variant text-xs font-bold uppercase tracking-widest px-4">
            <th className="pb-4 pl-4">Patient Name</th>
            <th className="pb-4">Date & Time</th>
            <th className="pb-4">Status</th>
            <th className="pb-4 text-right pr-4">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {appointmentsList.map((appt) => (
             <AppointmentCard key={appt._id} appointment={appt} />
          ))}
          {appointmentsList.length === 0 && (
             <tr>
               <td colSpan={4} className="py-8 text-center text-on-surface-variant opacity-70">
                 No appointments scheduled yet.
               </td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
