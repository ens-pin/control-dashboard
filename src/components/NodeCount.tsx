import { useQuery } from "@tanstack/react-query";

interface NodeCountResponse {
    message: string;
    count: number;
}

export function NodeCount() {
    const { data, isLoading, error, refetch } = useQuery<NodeCountResponse>({
        queryKey: ['node-count'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/nodes/count`);
            if (!response.ok) {
                throw new Error(`Failed to fetch node count: ${response.status}`);
            }
            return response.json();
        },
    });

    return (
        <div className="bg-black p-4 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-300">Total Nodes</h3>
                <button 
                    onClick={() => refetch()}
                    className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
                >
                    Refresh
                </button>
            </div>
            
            {error ? (
                <p className="text-red-400 text-sm">{error instanceof Error ? error.message : 'An error occurred'}</p>
            ) : isLoading ? (
                <p className="text-gray-400">Loading...</p>
            ) : (
                <p className="text-3xl font-bold text-blue-400">{data?.count !== undefined ? data.count : '-'}</p>
            )}
        </div>
    );
} 