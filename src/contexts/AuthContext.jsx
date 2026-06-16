import { createContext, useContext } from 'react';
import { useAuth as useAuthLogic } from '../hooks/useAuth';
import FullPageLoader from '../components/loaders/FullPageLoader';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const authState = useAuthLogic();

  return (
    <AuthContext.Provider value={authState}>
      {authState.authLoading && <FullPageLoader />}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
