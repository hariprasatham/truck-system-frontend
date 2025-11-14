import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import * as bootstrap from "bootstrap";

import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import UserManagement from "./pages/UserManagement";
import DriverManagement from "./pages/DriverManagement";
import MenuManagement from "./pages/MenuManagement";
import TruckManagement from "./pages/TruckManagement";
import FuelInvoiceManagement from "./pages/FuelInvoiceManagement";
import ViewFuelData from "./pages/ViewFuelData";
import PreEmploymentCheck from "./pages/PreEmploymentCheck";
import DriverList from "./pages/DriverList";
// import GlobalLoader from "./components/GlobalLoader";

import useMenuStore from "./store/menuStore";
import useUserStore from "./store/userStore";
import NotFound from "./pages/NotFound";
import PublicRoute from "./components/PublicRoute";
import DriverDetails from "./pages/DriverDetails";
import PreEmploymentApplicationList from "./pages/PreEmploymentApplicationList";

const App = () => {
  window.bootstrap = bootstrap; // ✅ Make Bootstrap globally available


  return (
    <>
      {/* <GlobalLoader /> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Public route that should not be accessible when logged in */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
          </Route>


          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/:companyId/user-management" element={<UserManagement />} />
              <Route path="/companies/:companyId/user-management/:userId/drivers" element={<DriverList />} />
              <Route path="/companies/:companyId/user-management/:userId/drivers/:driverId" element={<DriverDetails />} />
              <Route path="/companies/:companyId/user-management/:userId/trucks" element={<TruckManagement />} />

              <Route path="/driver-management" element={<DriverManagement />} />
              <Route path="/menu-management" element={<MenuManagement />} />
              <Route path="/truck-management" element={<TruckManagement />} />
              <Route path="/fuel-invoice-management" element={<FuelInvoiceManagement />} />
              <Route path="/view-fuel-data/:fuelId" element={<ViewFuelData />} />
              <Route path="/pre-employment-application/form" element={<PreEmploymentCheck />} />
              <Route path="/pre-employment-application" element={<PreEmploymentApplicationList />} />
              {/* <Route path="/drivers" element={<DriverManagement />} /> */}
              {/* <Route path="/profile" element={<Profile />} /> */}
            </Route>
          </Route>

          {/* Catch-all for unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
