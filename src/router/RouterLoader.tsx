import React, { useState, useEffect } from 'react';
import { NotFoundPage } from 'pages';
import { Loading } from 'components';


const RouteLoader: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
  
      return () => clearTimeout(timer);
    }, []);
  
    return isLoading ? <Loading /> : <NotFoundPage />;
  };

  export { RouteLoader };