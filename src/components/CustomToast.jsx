// CustomToast.jsx
const CustomToast = ({ message, closeToast }) => {
  return (
    <div>
      <div style={{ marginBottom: "10px", whiteSpace: "pre-line" }}>
        {message}
      </div>

      <button
        onClick={closeToast}
        style={{
          padding: "5px 12px",
          background: "#007bff",
          color: "#fff",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
        }}
      >
        OK
      </button>
    </div>
  );
};

export default CustomToast;
