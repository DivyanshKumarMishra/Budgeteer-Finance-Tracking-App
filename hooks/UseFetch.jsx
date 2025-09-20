import { useCallback, useState } from 'react';
import { toast } from 'sonner';

function useFetch(cb) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await cb(...args);
        if (response.success) {
          response.data ? setData(response.data) : setData(response);
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setError(null);
        }, 1000);
      }
    },
    [cb]
  );

  return { data, loading, error, setData, fn };
}

export default useFetch;
