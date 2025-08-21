import React from "react";
import { DashboardNav } from "../Components/DashboardNav";
import { StudentDashboard } from "../Components/StudentDashboard";
export function Dashboard() {
    return (
        <>
  <DashboardNav />
  <div className="border-t-2 min-h-screen ">
    <StudentDashboard/>
  </div>
</>
    )
}