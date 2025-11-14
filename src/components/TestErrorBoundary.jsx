// src/components/TestErrorBoundary.jsx
const TestErrorBoundary = () => {
  const throwError = () => {
    throw new Error('This is a test error!');
  };

  return (
    <div>
      <button onClick={throwError} className="btn btn-danger">
        Throw Error
      </button>
    </div>
  );
};

export default TestErrorBoundary;