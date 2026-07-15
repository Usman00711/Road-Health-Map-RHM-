import { useEffect, useState } from 'react';
import api from './api';

export default function useOverview() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/dashboard/overview')
      .then((response) => active && setData(response.data))
      .catch((requestError) => {
        if (requestError.response?.status === 401) localStorage.removeItem('rhm_token');
        if (active) setError(requestError.response?.data?.error || 'The dashboard API is not available. Start MongoDB and the backend, then refresh.');
      });
    return () => { active = false; };
  }, []);

  return { data, error };
}
