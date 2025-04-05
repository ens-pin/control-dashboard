import { useState, useEffect } from 'react';

export function NodeCount() {
    const [count, setCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchNodeCount();
    }, []);

    const fetchNodeCount = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/nodes/count');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch node count: ${response.status}`);
            }
            
            const data = await response.json();
            setCount(data.count);
        } catch (err) {
            console.error('Error fetching node count:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-black p-4 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-300">Total Nodes</h3>
                <button 
                    onClick={fetchNodeCount}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
                >
                    Refresh
                </button>
            </div>
            
            {error ? (
                <p className="text-red-400 text-sm">{error}</p>
            ) : isLoading ? (
                <p className="text-gray-400">Loading...</p>
            ) : (
                <p className="text-3xl font-bold text-blue-400">{count !== null ? count : '-'}</p>
            )}
        </div>
    );
} 