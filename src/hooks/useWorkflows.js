import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
export const useWorkflows = () => {
    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const refresh = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/workflows');
            setWorkflows(data.workflows);
        }
        finally {
            setLoading(false);
        }
    };
    const trigger = async (id) => {
        await api.post(`/workflows/${id}/trigger`);
        await refresh();
    };
    useEffect(() => {
        void refresh();
    }, []);
    return { workflows, loading, trigger, refresh };
};
