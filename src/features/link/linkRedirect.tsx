import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext/AuthContext';
import { useEffect, useState } from 'react';
import spinner_loading_fallback from 'assets/images/spinner-loading-akaza.svg?url';

interface RouteConfig {
  path: string;
  isProtected: boolean;
}

const codeMap: Record<string, RouteConfig> = {
  NPMN: { path: '/dashboard', isProtected: true },
  NIRA: { path: '/dashboard/interviews/accepted', isProtected: true },
  NIRD: { path: '/dashboard/interviews/declined', isProtected: true },
  NIRP: { path: '/dashboard/interviews/pending', isProtected: true },
  NIRR: { path: '/dashboard/interviews/reschedule', isProtected: true },
  NIRC: { path: '/dashboard/interviews/completed', isProtected: true },
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <img src={spinner_loading_fallback} alt="spinners" className="w-20 h-20" />
  </div>
);

const LinkRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { code } = useParams();
  const [ready, setReady] = useState(false);

  const config = code ? codeMap[code.toUpperCase()] : null;

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading || !ready) return <LoadingFallback />;

  if (!config) {
    return <div>Invalid or unknown link code: {code}</div>;
  }

  if (config.isProtected && !isAuthenticated) {
    return <Navigate to="/" replace state={{ login: true }} />;
  }

  return <Navigate to={config.path} replace />;
};

export default LinkRedirect;
