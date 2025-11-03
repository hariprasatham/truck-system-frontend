// src/components/GlobalLoader.jsx
import { useEffect } from 'react';
import Loader from './Loader';
import useUserStore from '../store/userStore';
import useCompanyUsersStore from '../store/companyUsersStore';
import useCompaniesStore from '../store/companiesStore';

const GlobalLoader = () => {
  const userGlobalLoading = useUserStore(state => state.globalLoading);
  const companyUsersGlobalLoading = useCompanyUsersStore(state => state.globalLoading);
  const companiesGlobalLoading = useCompaniesStore(state => state.globalLoading);

  const globalLoading = userGlobalLoading || companyUsersGlobalLoading || companiesGlobalLoading;

  // Prevent body scrolling when loader is active
  useEffect(() => {
    if (globalLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [globalLoading]);

  if (!globalLoading) return null;
  
  return <Loader />;
};

export default GlobalLoader;