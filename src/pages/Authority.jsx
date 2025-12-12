import { useEffect, useState } from "react";
import { Spinner, Card, Button, Form } from "react-bootstrap";
import useMasterStore from "../store/masterStore";

const Authority = () => {
  const { fetchAuthoritiesByCompany, applyAuthorities, loading } =
    useMasterStore();

  const [company, setCompany] = useState(null);
  const [usList, setUsList] = useState([]);
  const [canadaList, setCanadaList] = useState([]);

  const [selected, setSelected] = useState([]); // selected IDs

  useEffect(() => {
    const load = async () => {
      const data = await fetchAuthoritiesByCompany();
      if (data) {
        setCompany(data.company);
        setUsList(data.usAuthorities || []);
        setCanadaList(data.canadaAuthorities || []);
      }
    };
    load();
  }, []);

  // Checkbox toggle
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Build final payload
  const buildPayload = () => {
    const usSelected = selected.filter((id) =>
      usList.some((item) => item.id === id)
    );
    const canadaSelected = selected.filter((id) =>
      canadaList.some((item) => item.id === id)
    );

    return {
      company_id: company?.id,
      us: usSelected,
      canada: canadaSelected,
    };
  };

  // APPLY action
  const handleApply = async () => {
    const payload = buildPayload();

    try {
      await applyAuthorities(payload);
      console.log("Payload sent:", payload);

      // Optional refresh
      fetchAuthoritiesByCompany();
      setSelected([]);
    } catch (err) {
      console.error("Apply failed:", err);
    }
  };

  return (
    <div className="container content mt-4">
      <h2 className="mb-4 text-success ms-3">Authority</h2>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          {/* COMPANY DETAILS */}
          <Card className="mb-4 p-3 shadow-sm">
            <h5 className="mb-2">Company Details</h5>
            <p>
              <strong>Name:</strong> {company?.company_name}
            </p>
            <p>
              <strong>Regions:</strong> {company?.is_us ? "US" : ""}
              {company?.is_us && company?.is_canada ? " / " : ""}
              {company?.is_canada ? "Canada" : ""}
            </p>
          </Card>

          {/* US AUTHORITIES */}
          {company?.is_us == 1 && (
            <Card className="mb-4 p-3 shadow-sm">
              <h5 className="text-primary mb-3">US Authorities</h5>

              {usList.length === 0 ? (
                <p className="text-muted">No active US authorities</p>
              ) : (
                <ul className="list-unstyled">
                  {usList.map((item) => (
                    <li key={item.id} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={item.authority_name}
                        checked={selected.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

          {/* CANADA AUTHORITIES */}
          {company?.is_canada == 1 && (
            <Card className="mb-4 p-3 shadow-sm">
              <h5 className="text-danger mb-3">Canada Authorities</h5>

              {canadaList.length === 0 ? (
                <p className="text-muted">No active Canada authorities</p>
              ) : (
                <ul className="list-unstyled">
                  {canadaList.map((item) => (
                    <li key={item.id} className="mb-2">
                      <Form.Check
                        type="checkbox"
                        label={item.authority_name}
                        checked={selected.includes(item.id)}
                        onChange={() => handleSelect(item.id)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          )}

          {/* APPLY BUTTON */}
          <div className="text-end mb-5">
            <Button
              variant="success"
              onClick={handleApply}
              disabled={selected.length === 0}
            >
              Apply ({selected.length})
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Authority;
