import React, { useEffect, useState } from "react";
import { Table, Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "react-hot-toast";
import useCompanyDriverStore from "../store/companyTruckStore";

const FuelUnitList = () => {
  const { fetchFuelUnits, fuelUnits, loading } = useCompanyDriverStore();

  const [filters, setFilters] = useState({
    state: "",
    unit_no: "",
    fromDate: "",
    toDate: "",
  });

  const [allStates, setAllStates] = useState([]);

  // ----------------------------------------------------------------
  // Load ALL states (only once)
  // ----------------------------------------------------------------
  const loadAllStates = async () => {
    try {
      const data = await fetchFuelUnits({});
      const states = [...new Set(data.map((item) => item.state))];
      setAllStates(states);
    } catch (err) {
      // toast.error("Failed to load states");
    }
  };

  // ----------------------------------------------------------------
  // Load filtered units
  // ----------------------------------------------------------------
  const loadUnits = async (appliedFilters = filters) => {
    try {
      await fetchFuelUnits(appliedFilters);
    } catch (err) {
      // toast.error("Failed to fetch fuel units");
    }
  };

  useEffect(() => {
    loadAllStates();
    loadUnits({});
  }, []);

  // ----------------------------------------------------------------
  // Handle input change
  // ----------------------------------------------------------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "state" && value === "") {
      loadUnits({});
    }
  };

  // ----------------------------------------------------------------
  // Apply Filters
  // ----------------------------------------------------------------
  const applyFilters = () => {
    const empty =
      !filters.state &&
      !filters.unit_no &&
      !filters.fromDate &&
      !filters.toDate;

    if (empty) {
      toast.error("Please select at least one filter.");
      return;
    }

    loadUnits(filters);
  };

  // ----------------------------------------------------------------
  // Reset Filters
  // ----------------------------------------------------------------
  const resetFilters = () => {
    const empty = { state: "", unit_no: "", fromDate: "", toDate: "" };
    setFilters(empty);
    loadUnits({});
    fetchFuelUnits();
  };

  // Format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return "-";
    return d.toLocaleDateString("en-GB");
  };

  return (
    <div className="mt-4">
      {/* Filters */}
      <Form className="mb-3">
        <Row className="align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label>State</Form.Label>
              <Form.Select
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
              >
                <option value="">All States</option>
                {allStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Unit No</Form.Label>
              <Form.Control
                type="text"
                name="unit_no"
                value={filters.unit_no}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Form.Group>
              <Form.Label>To Date</Form.Label>
              <Form.Control
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>

          <Col md={2}>
            <Button variant="primary" className="me-2" onClick={applyFilters}>
              Apply
            </Button>
            <Button variant="secondary" onClick={resetFilters}>
              Reset
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : fuelUnits?.length > 0 ? (
        <div className="table-scroll-container">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>SL.NO</th>
                <th>Unit No</th>
                <th>Period</th>
                <th>State</th>
                <th>Fuel Unit</th>
              </tr>
            </thead>
            <tbody>
              {fuelUnits.map((row, i) => (
                <tr key={row.id}>
                  <td>{i + 1}</td>
                  <td>{row.unit_no}</td>
                  <td>
                    {formatDate(row.period_start_date)} →{" "}
                    {formatDate(row.period_end_date)}
                  </td>
                  <td>{row.state}</td>
                  <td>{row.total}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <p className="text-center">No data found.</p>
      )}
    </div>
  );
};

export default FuelUnitList;
