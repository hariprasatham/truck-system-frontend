import React, { useState, useEffect} from "react";
import "./Dashboard.css";
import axios from "axios";
import MonthlyDeliveriesChart from "../components/MonthlyDeliveriesChart";
import DashboardCard from "../components/DashboardCard";
import useDashboardStore from "../store/dashboardStore";
import useUserStore from "../store/userStore";

const Dashboard = () => {
  const { stats, loading, fetchDashboardStats } = useDashboardStore();
  const { user } = useUserStore();


  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return (
    <div className="content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="ms-3">Dashboard</h2>
      </div>

      <div className="row g-4 mb-4">
        <DashboardCard
          icon="bi-truck"
          title="Total Trucks"
          value={stats.trucks || 0}
          color="text-success"
        />
        <DashboardCard
          icon="bi-person-badge"
          title="Active Drivers"
          value={stats.drivers || 0}
          color="text-primary"
        />
        {/* Admin-only cards */}
        {user?.role === "admin" && (
          <>
            <DashboardCard
              icon="bi-people"
              title="Total Users"
              value={stats.users || 0}
              color="text-warning"
            />
            <DashboardCard
              icon="bi-building"
              title="Total Companies"
              value={stats.companies || 0}
              color="text-danger"
            />
          </>
        )}
        <DashboardCard
          icon="bi-bar-chart"
          title="Total Fuel Quantity"
          value={stats.totalQuantity || 0}
          color="text-info"
        />
        <DashboardCard
          icon="bi-currency-rupee"
          title="Total Final Amount"
          value={stats.totalAmount || 0}
          color="text-success"
        />
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="dashboard-card shadow-sm p-3">
            <h6 className="fw-bold mb-3">Monthly Deliveries</h6>
            <MonthlyDeliveriesChart
              months={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]}
              counts={[10, 15, 7, 12, 20, 25]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;