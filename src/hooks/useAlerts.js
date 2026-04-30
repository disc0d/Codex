import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
export const useAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const refresh = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/alerts');
            setAlerts(data.alerts);
        }
        finally {
            setLoading(false);
        }
    };
    const acknowledge = async (id) => {
        await api.post(`/alerts/${id}/ack`);
        await refresh();
    };
    useEffect(() => {
        void refresh();
    }, []);
    return { alerts, loading, acknowledge };
};
