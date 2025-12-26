import { useEffect, useState, useMemo } from "react";
import { Spinner, Card, Button, Form, Table, Modal } from "react-bootstrap";
import useMasterStore from "../store/masterStore";
import moment from "moment";

const Authority = () => {
  const {
    fetchAuthoritiesByCompany,
    applyAuthorities,
    getAppliedAuthorities,
    loading,
    PdfapplyAuthority,
    downloadAuthorityPdf,
  } = useMasterStore();

  const [company, setCompany] = useState(null);
  const [usList, setUsList] = useState([]);
  const [canadaList, setCanadaList] = useState([]);

  const [selected, setSelected] = useState([]);

  // Modals
  const [showApply, setShowApply] = useState(false);
  const [showOnboard, setShowOnboard] = useState(false);
  const [getUpdatedata, setgetUpdatedata] = useState(false);

  // Onboard form
  const [statusAuthorities, setStatusAuthorities] = useState([]);
  const [onboardAuthority, setOnboardAuthority] = useState("");
  const [pdf, setPdf] = useState(null);

  const [appliedUS, setAppliedUS] = useState([]);
  const [appliedCanada, setAppliedCanada] = useState([]);

  const allAuthorities = useMemo(() => {
    let list = [];

    if (company?.is_us == 1) {
      list = [...list, ...usList.map((a) => ({ ...a, country: "US" }))];
    }

    if (company?.is_canada == 1) {
      list = [...list, ...canadaList.map((a) => ({ ...a, country: "Canada" }))];
    }

    return list;
  }, [company, usList, canadaList]);

  const handlePdfSubmit = async () => {
    const success = await PdfapplyAuthority(onboardAuthority, pdf);
    setgetUpdatedata(!getUpdatedata);

    if (success) {
      setShowOnboard(false);
      setOnboardAuthority("");
      setPdf(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      // 1️⃣ Fetch master authority list
      const data = await fetchAuthoritiesByCompany();
      if (data) {
        setCompany(data.company);
        setUsList(data.usAuthorities || []);
        setCanadaList(data.canadaAuthorities || []);

        const active = [
          ...(data.usAuthorities || []),
          ...(data.canadaAuthorities || []),
        ].filter((a) => a.status === 1);

        setStatusAuthorities(active);
      }

      // 2️⃣ Fetch applied authorities (ONLY for table)
      const applied = await getAppliedAuthorities();
      if (applied) {
        setAppliedUS(applied.us || []);
        setAppliedCanada(applied.canada || []);
      }
    };

    load();
  }, [getUpdatedata]);

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const buildPayload = () => {
    const us = selected.filter((id) => usList.some((item) => item.id === id));

    const canada = selected.filter((id) =>
      canadaList.some((item) => item.id === id)
    );

    return {
      company_id: company?.id,
      us,
      canada,
    };
  };

  const handleApply = async () => {
    await applyAuthorities(buildPayload());
    setSelected([]);
    setShowApply(false);
    // getAppliedAuthorities();
    fetchAuthoritiesByCompany();
    getAppliedAuthorities();
  };

  return (
    <div className="container content mt-4">
      <h2 className="mb-4 text-success">Authority</h2>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {/* ACTION BUTTONS */}
          <div className="d-flex gap-2 mb-3" style={{ justifyContent: "end" }}>
            <Button variant="primary" onClick={() => setShowOnboard(true)}>
              Onboard Authority
            </Button>
            <Button
              variant="success"
              style={{ width: "290px" }}
              onClick={() => setShowApply(true)}
            >
              Apply Authority
            </Button>
          </div>

          {/* TABLE */}
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ width: "80px" }}>Sl.No</th>
                <th>Authority</th>
                {/* <th style={{ width: "120px" }}>Country</th> */}
                <th style={{ width: "120px" }}>PDF</th>
                <th>Last Updated</th>
              </tr>
            </thead>

            <tbody>
              {[...appliedUS, ...appliedCanada].length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    No applied authorities
                  </td>
                </tr>
              ) : (
                [...appliedUS, ...appliedCanada].map((item, index) => (
                  <tr key={`${item.id}-${index}`}>
                    <td>{index + 1}</td>

                    <td className="text-capitalize">{item.authority_name}</td>

                    {/* <td>
                        {item.is_us == true ? (
                          <span className="badge bg-primary">US</span>
                        ) : (
                          <span className="badge bg-danger">Canada</span>
                        )}
                      </td> */}

                    <td>
                      {item?.document_path ? (
                        <a
                          onClick={() =>
                            downloadAuthorityPdf(item.id, item.authority_name)
                          }
                          target="_blank" // open in new tab
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-success"
                          title="View/Download PDF"
                        >
                          <i className="bi bi-file-pdf" />
                        </a>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      {moment(item.created_at).format("DD-MM-YYYY hh:mm:A")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* APPLY AUTHORITY MODAL */}
          <Modal show={showApply} onHide={() => setShowApply(false)} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Apply Authority</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              {/* US Authorities */}
              {company?.is_us == 1 && (
                <>
                  <h6 className="text-primary mb-2">US Authorities</h6>

                  {usList.length === 0 ? (
                    <p className="text-muted">No US authorities available</p>
                  ) : (
                    usList.map((item) => (
                      <Form.Check
                        key={`us-${item.id}`}
                        type="checkbox"
                        label={item.authority_name}
                        checked={selected.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                        className="mb-2"
                      />
                    ))
                  )}

                  <hr />
                </>
              )}

              {/* Canada Authorities */}
              {company?.is_canada == 1 && (
                <>
                  <h6 className="text-danger mb-2">Canada Authorities</h6>

                  {canadaList.length === 0 ? (
                    <p className="text-muted">
                      No Canada authorities available
                    </p>
                  ) : (
                    canadaList.map((item) => (
                      <Form.Check
                        key={`ca-${item.id}`}
                        type="checkbox"
                        label={item.authority_name}
                        checked={selected.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                        className="mb-2"
                      />
                    ))
                  )}
                </>
              )}
            </Modal.Body>

            <Modal.Footer>
              {/* <Button variant="secondary" onClick={() => setShowApply(false)}>
                Cancel
              </Button> */}
              <Button
                variant="success"
                onClick={handleApply}
                disabled={selected.length === 0}
                style={{ width: "100%" }}
              >
                Apply ({selected.length})
              </Button>
            </Modal.Footer>
          </Modal>

          {/* ONBOARD AUTHORITY MODAL */}
          <Modal show={showOnboard} onHide={() => setShowOnboard(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Onboard Authority</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Select Authority</Form.Label>
                <Form.Select
                  value={onboardAuthority}
                  onChange={(e) => setOnboardAuthority(e.target.value)}
                >
                  <option value="">-- Select --</option>

                  {allAuthorities.map((a) => (
                    <option
                      style={{ textTransform: "capitalize" }}
                      key={a.id}
                      value={a.id}
                    >
                      {a.authority_name} ({a.country})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Upload PDF</Form.Label>
                <Form.Control
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => {
                      setPdf({
                        fileName: file.name,
                        mimeType: file.type,
                        base64: reader.result, // data:application/pdf;base64,...
                      });
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowOnboard(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePdfSubmit}
                disabled={!onboardAuthority || !pdf}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Authority;
