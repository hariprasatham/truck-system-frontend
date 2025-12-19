import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Table,
  Spinner,
  Modal,
  ToggleButton,
} from "react-bootstrap";
import useMasterStore from "../../store/masterStore";

const Authorities = () => {
  const {
    createAuthority,
    updateAuthority,
    fetchAuthorities,
    toggleAuthorityStatus,
    loading,
    tableLoading,
  } = useMasterStore();

  const [localAuthorities, setLocalAuthorities] = useState([]);

  // Form State
  const [authorityName, setAuthorityName] = useState("");
  const [isUS, setIsUS] = useState(false);
  const [isCanada, setIsCanada] = useState(false);

  // Modal (Add)
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal (Edit)
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAuthority, setSelectedAuthority] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Load Authorities
  useEffect(() => {
    const load = async () => {
      const data = await fetchAuthorities();
      setLocalAuthorities(data || []);
    };
    load();
  }, []);

  // Pagination Logic
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = localAuthorities.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(localAuthorities.length / rowsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const capitalizeFirst = (str = "") =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // ------------------------
  //  SUBMIT (ADD)
  // ------------------------
  const handleAdd = async (e) => {
    e.preventDefault();

    const payload = {
      authority_name: capitalizeFirst(authorityName),
      is_us: isUS,
      is_canada: isCanada,
    };

    await createAuthority(payload);
    const newData = await fetchAuthorities();
    setLocalAuthorities(newData || []);

    resetForm();
    setShowAddModal(false);
  };

  // ------------------------
  //  OPEN EDIT MODAL
  // ------------------------
  const openEditModal = (auth) => {
    setSelectedAuthority(auth);
    setAuthorityName(auth.authority_name);
    setIsUS(auth.is_us == 1);
    setIsCanada(auth.is_canada == 1);
    setShowEditModal(true);
  };

  // ------------------------
  //  SUBMIT (EDIT)
  // ------------------------
  const handleEdit = async (e) => {
    e.preventDefault();

    const payload = {
      authority_name: authorityName,
      is_us: isUS,
      is_canada: isCanada,
    };

    await updateAuthority(selectedAuthority.id, payload);

    const newData = await fetchAuthorities();
    setLocalAuthorities(newData || []);

    resetForm();
    setShowEditModal(false);
  };

  const resetForm = () => {
    setAuthorityName("");
    setIsUS(false);
    setIsCanada(false);
    setSelectedAuthority(null);
  };

  // ------------------------
  //  TOGGLE STATUS
  // ------------------------
  const handleStatusToggle = async (auth) => {
    await toggleAuthorityStatus(auth.id, !auth.is_active); // pass opposite of current
    const newData = await fetchAuthorities();
    setLocalAuthorities(newData || []);
  };

  return (
    <div className="container mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="text-success">Authorities List</h4>
        <Button variant="success" onClick={() => setShowAddModal(true)}>
          + Add Authority
        </Button>
      </div>

      {/* TABLE */}
      <div>
        {tableLoading ? (
          <div className="text-center my-3">
            <Spinner animation="border" size="sm" /> Loading...
          </div>
        ) : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Authority Name</th>
                  <th>Country</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentData?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No authorities found
                    </td>
                  </tr>
                ) : (
                  currentData?.map((auth, index) => (
                    <tr key={auth.id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{auth.authority_name}</td>
                      <td>
                        {auth.is_us == 1 ? "US" : ""}
                        {auth.is_us == 1 && auth.is_canada == 1 ? ", " : ""}
                        {auth.is_canada == 1 ? "Canada" : ""}
                      </td>
                      <td>
                        <Form.Check
                          type="switch"
                          id={`status-${auth.id}`}
                          label={auth.is_active ? "Active" : "Inactive"}
                          checked={auth.is_active}
                          onChange={() => handleStatusToggle(auth)}
                        />
                      </td>
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => openEditModal(auth)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {/* PAGINATION */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                Previous
              </Button>

              <div>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={
                      currentPage === i + 1 ? "success" : "outline-success"
                    }
                    size="sm"
                    className="mx-1"
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>

      {/* ADD MODAL */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Authority</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAdd}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Authority Name</Form.Label>
              <Form.Control
                type="text"
                value={authorityName}
                onChange={(e) => setAuthorityName(e.target.value)}
                required
                style={{ textTransform: "capitalize" }}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Authority Country</Form.Label>
              <Form.Check
                type="checkbox"
                label="US"
                checked={isUS}
                onChange={(e) => setIsUS(e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="Canada"
                checked={isCanada}
                onChange={(e) => setIsCanada(e.target.checked)}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Authority</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEdit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Authority Name</Form.Label>
              <Form.Control
                type="text"
                value={authorityName}
                onChange={(e) => setAuthorityName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Authority Country</Form.Label>
              <Form.Check
                type="checkbox"
                label="US"
                checked={isUS}
                onChange={(e) => setIsUS(e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="Canada"
                checked={isCanada}
                onChange={(e) => setIsCanada(e.target.checked)}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="warning">
              Update
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Authorities;
