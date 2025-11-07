// import Sidebar from "./Sidebar";
// import { Outlet } from "react-router-dom";

// const Layout = () => {
//   return (
//     <div className="d-flex">
//       <Sidebar />
//       <div className="flex-grow-1 p-4" style={{ minHeight: "100vh" }}>
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default Layout;

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import useMenuStore from "../store/menuStore";
import useUserStore from "../store/userStore";


const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { fetchAllMenus, fetchUserMenus } = useMenuStore();
  const { user } = useUserStore();

  useEffect(() => {
    if(user.role == "admin"){
      fetchAllMenus();
    }
    fetchUserMenus();
  }, []);

  return (
    <div className="d-flex">
      <div style={{ width: collapsed ? "0" : "250px", transition: "width 0.3s" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className={`flex-grow-1`} style={{ minHeight: "100vh" }}>
        {/* <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-light position-absolute"
          style={{ top: 10, left: 10, zIndex: 1050 }}
        >
          <i className={`bi ${collapsed ? "bi-arrow-right-circle" : "bi-arrow-left-circle"}`}></i>
        </button> */}

        <div className={`content-container ${collapsed ? "collapsed" : ""}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;

