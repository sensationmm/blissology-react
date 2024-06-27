import { useEffect, useState } from 'react';

export default function useFetch(url: string) {
  const [data, setData] = useState(null);
  useEffect(() => {
    async function loadData() {
      const response = await fetch(url);
      if (!response.ok) {
        // oups! something went wrong
        return;
      }

      const posts = await response.json();
      if (posts.length === 1) {
        setData(posts[0]);
        return;
      }
      setData(posts);
    }

    loadData();
  }, [url]);
  return data;
}
