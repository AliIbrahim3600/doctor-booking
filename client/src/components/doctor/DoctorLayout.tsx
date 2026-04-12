import { Outlet } from "react-router";
import DoctorSidebar from "./DoctorSidebar";

const DoctorLayout = () => {
  return (
    <div className="bg-surface min-h-screen text-on-surface flex">
      <DoctorSidebar />
      <main className="ml-72 flex-1 min-h-screen p-8 bg-surface w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
