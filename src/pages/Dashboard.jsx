import React from "react";
import "./Dashboard.css";
import MonthlyDeliveriesChart from "../components/MonthlyDeliveriesChart";
import DashboardCard from "../components/DashboardCard";

const Dashboard = () => {
  return (
    <div className="content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="ms-3">Dashboard</h2>
      </div>

      <div className="row g-4 mb-4">
        <DashboardCard
          icon="bi-truck"
          title="Total Trucks"
          value="4"
          color="text-success"
        />
        <DashboardCard
          icon="bi-person-badge"
          title="Active Drivers"
          value="5"
          color="text-primary"
        />
        <DashboardCard
          icon="bi-people"
          title="Total Users"
          value="6"
          color="text-warning"
        />
        <DashboardCard
          icon="bi-building"
          title="Total Companies"
          value="2"
          color="text-danger"
        />
        <DashboardCard
          icon="bi-bar-chart"
          title="Total Fuel Quantity"
          value="1000.00 L"
          color="text-info"
        />
        <DashboardCard
          icon="bi-currency-rupee"
          title="Total Final Amount"
          value="₹50000.00"
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
