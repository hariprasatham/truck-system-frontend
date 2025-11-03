// src/components/common/Loader.jsx
import './Loader.css';
import TableLoader from './TableLoader';

const Loader = () => (
  <div className="loader-overlay">
    <div className="loader-content">
      <TableLoader />
    </div>
  </div>
);

export default Loader;