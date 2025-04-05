import { useEffect, useState } from 'react';

export function useLocalHostPort() {
    const [hostname, setHostname] = useState('');
    const [port, setPort] = useState(42069);

    useEffect(() => {
      const host = window.location.hostname;
      const port = 42069;
      setHostname(`http://${host}`);
      setPort(port);
    }, []);

    return { hostname, port };
}