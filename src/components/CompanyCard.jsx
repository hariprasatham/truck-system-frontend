import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "./CompanyCard.css";

const CompanyCard = ({ company, bgStyle }) => {
  const navigate = useNavigate();
  const handleNavigate = useCallback(() => {
    // Navigate to company detail page
    navigate(`/companies/${company.id}/user-management`);
  }, [company.id]);

  console.log(company);

  return (
    <div
      className="col-md-3 col-sm-6"
      key={company.id}
      onClick={handleNavigate}
    >
      <div className="company-card p-3" style={bgStyle}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="text-section">
            <p className="card-label">Company</p>
            <h5 className="card-title">{company.company_name}</h5>

            {(company.is_us == 1 || company.is_canada == 1) && (
              <p className="mt-1 text-muted" style={{ fontSize: "14px" }}>
                Country:
                {company.is_us == 1 && " US"}
                {company.is_us == 1 && company.is_canada == 1 && ","}
                {company.is_canada == 1 && " Canada"}
              </p>
            )}
          </div>
          <div className="card-icon">
            <i className="bi bi-building"></i>
          </div>
        </div>

        {/* Stats */}
        <div className="card-stats mb-3 d-flex justify-content-between">
          <div>
            <h4 className="stat-number">{company.userCount}</h4>
            <p className="stat-label">Users</p>
          </div>
          <div>
            <h4 className="stat-number">{company.driverCount}</h4>
            <p className="stat-label">Drivers</p>
          </div>
        </div>

        {/* Description */}
        <p className="company-desc">
          {company.description || "No description available"}
        </p>
      </div>
    </div>
  );
};

export default CompanyCard;
