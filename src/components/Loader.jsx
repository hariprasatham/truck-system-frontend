// src/components/common/Loader.jsx
import './Loader.css';
import TableLoader from './TableLoader';

const Loader = ({message}) => (
  <div className="loader-overlay">
    <div className="loader-content">
      <TableLoader message={message}/>
    </div>
  </div>
);

export default Loader;