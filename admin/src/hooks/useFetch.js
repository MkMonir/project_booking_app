import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetch = (url) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(url, {
          headers: {
            token: JSON.parse(localStorage.getItem('user')).token,
            'Content-Type': 'application/json',
          },
        });

        setData(res.data.data.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const reFetch = async () => {
    try {
      const res = await axios.get(url, {
        header: {
          token: JSON.parse(localStorage.getItem('user')).token,
          'Content-Type': 'application/json',
        },
      });

      setData(res.data.data.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return { data, loading, error, reFetch };
};
export default useFetch;
