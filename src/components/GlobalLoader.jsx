// src/components/GlobalLoader.jsx
import { useEffect } from 'react';
import Loader from './Loader';
import useUserStore from '../store/userStore';
import useCompanyUsersStore from '../store/companyUsersStore';
import useCompaniesStore from '../store/companiesStore';
import useCompanyDriverStore from '../store/companyDriverStore';

const GlobalLoader = ({loading}) => {


  // Prevent body scrolling when loader is active
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loading]);

  if (!loading) return null;
  
  return <Loader />;
};

export default GlobalLoader;