import React, { useState, useEffect} from "react";
import "./Dashboard.css";
import axios from "axios";
import MonthlyDeliveriesChart from "../components/MonthlyDeliveriesChart";
import DashboardCard from "../components/DashboardCard";

const Dashboard = () => {
  
  const [counts, setCounts] = useState({});
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        const token = localStorage.getItem("access_token"); // JWT stored after login
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/auth/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setCounts(res.data.data);
          setRole(res.data.role);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardCounts();
  }, []);

  return (
    <div className="content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="ms-3">Dashboard</h2>
      </div>

      <div className="row g-4 mb-4">
        <DashboardCard
          icon="bi-truck"
          title="Total Trucks"
          value={counts.trucks || 0}
          color="text-success"
        />
        <DashboardCard
          icon="bi-person-badge"
          title="Active Drivers"
          value={counts.drivers || 0}
          color="text-primary"
        />
        {/* Admin-only cards */}
        {role === "admin" && (
          <>
            <DashboardCard
              icon="bi-people"
              title="Total Users"
              value={counts.users || 0}
              color="text-warning"
            />
            <DashboardCard
              icon="bi-building"
              title="Total Companies"
              value={counts.companies || 0}
              color="text-danger"
            />
          </>
        )}
        <DashboardCard
          icon="bi-bar-chart"
          title="Total Fuel Quantity"
          value={counts.totalQuantity || 0}
          color="text-info"
        />
        <DashboardCard
          icon="bi-currency-rupee"
          title="Total Final Amount"
          value={counts.totalAmount || 0}
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