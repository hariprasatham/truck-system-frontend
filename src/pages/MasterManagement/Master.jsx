import { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import Authorities from "./Authorities";

const Master = () => {
  return (
    <div className="container content mt-4">
      <h2 className="mb-4 text-success ms-3">Master Management</h2>

      <Tab.Container defaultActiveKey="Authorities">
        {/* Tabs Navigation */}
        <Nav variant="tabs" className="ms-3 mb-3">
          <Nav.Item>
            <Nav.Link eventKey="Authorities">Authorities</Nav.Link>
          </Nav.Item>
          {/* <Nav.Item>
            <Nav.Link eventKey="drivers">Support Test1</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="users">Users</Nav.Link>
          </Nav.Item> */}
          <Nav.Item>
            <Nav.Link eventKey="settings">Settings</Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Tabs Content */}
        <Tab.Content className="p-3 border rounded shadow-sm">
          <Tab.Pane eventKey="Authorities">
            {/* <h5>Authorities</h5> */}
            <Authorities />
          </Tab.Pane>

          <Tab.Pane eventKey="drivers">
            <h5>Driver Management</h5>
            <p>Here you can manage drivers.</p>
          </Tab.Pane>

          <Tab.Pane eventKey="users">
            <h5>User Management</h5>
            <p>Here you can manage users.</p>
          </Tab.Pane>

          <Tab.Pane eventKey="settings">
            <h5>Settings</h5>
            <p>Configuration and system settings.</p>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default Master;
