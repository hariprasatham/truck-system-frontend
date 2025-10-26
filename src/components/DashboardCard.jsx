import React from 'react'

const DashboardCard = ({ icon, title, value, color }) => {
  return (
    <div className="col-md-3">
      <div className={`dashboard-card text-center shadow-sm`}>
        <i className={`bi ${icon} fs-2 ${color} mb-2`}></i>
        <h6>{title}</h6>
        <h2 className={color}>{value}</h2>
      </div>
    </div>
  )
}

export default DashboardCard