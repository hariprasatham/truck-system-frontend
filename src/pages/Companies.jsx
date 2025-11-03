import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Companies.css";
import CompanyCard from "../components/CompanyCard";

import AddCompanyModal from "../components/AddCompanyModel";

import useCompaniesStore from "../store/companiesStore";


// Example API fetch (replace with your API or props)
const fetchCompanies = async () => {
  // Replace with actual fetch from backend
  return [
    {
      id: 1,
      company_name: "Acme Corp",
      description: "Leading provider of widgets",
      userCount: 12,
      driverCount: 8,
    },
    {
      id: 2,
      company_name: "Globex Inc",
      description: "",
      userCount: 7,
      driverCount: 4,
    },
    {
      id: 3,
      company_name: "Initech",
      description: "Tech solutions",
      userCount: 20,
      driverCount: 15,
    },
    {
      id: 4,
      company_name: "Hooli",
      description: "",
      userCount: 10,
      driverCount: 5,
    },
  ];
};

const Companies = () => {
    const [showModal, setShowModal] = useState(false);

  const {companies, fetchCompanies, createCompany} = useCompaniesStore();

  const handleSave = (newCompany) => {
    createCompany(newCompany);
    setShowModal(false);
  };  

  const colors = [
    ["#ecf3eeff", "#9bc6aaff"], // green
    ["#f0f4f7ff", "#cce8f7ff"], // blue
    ["#f5f3eaff", "#f7edc6ff"], // yellow
    ["#f5ebf1ff", "#f4d8e7ff"], // pink
  ];

  useEffect(() => {
    const loadCompanies = async () => {
      await fetchCompanies();
    };
    loadCompanies();
  }, []);

  return (
    <div className="content">
      {/* Header */}
      <div className="d-flex justify-content-between mb-4">
        <h3>Companies</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-building"></i> Add Company
        </button>
      </div>

      {/* Cards */}
      <div className="row g-4">
        {companies.map((c, index) => {
          const colorPair = colors[index % colors.length];
          const bgStyle = { background: `linear-gradient(135deg, ${colorPair[0]}, ${colorPair[1]})` };

          return (
            <CompanyCard key={c.id} company={c} bgStyle={bgStyle} />
          );
        })}
      </div>

        {/* Add Company Modal */}
      <AddCompanyModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSave}
      />
    </div>
  );
};

export default Companies;
