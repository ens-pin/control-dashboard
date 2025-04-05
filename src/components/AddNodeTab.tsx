'use client';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NodeCount } from './NodeCount';


interface Node {
    id: string;
    name: string;
    type: string;
    url: string;
    usage?: string;
}

interface NodesResponse {
    message: string;
    nodes: Node[];
}

export function AddNodeTab() {
    const [nodeName, setNodeName] = useState('');
    const [nodeUrl, setNodeUrl] = useState('');
    const [nodeAdded, setNodeAdded] = useState(false);
    const [addMessage, setAddMessage] = useState('');
    const [deletingNodeId, setDeletingNodeId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // Query for fetching nodes
    const { data, isLoading, error, refetch } = useQuery<NodesResponse>({
        queryKey: ['nodes'],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/nodes`);
            if (!response.ok) {
                throw new Error(`Failed to fetch nodes: ${response.status}`);
            }
            const data = await response.json();
            
            // Fetch usage data for each node
            if (data.nodes) {
                const nodesWithUsage = await Promise.all(
                    data.nodes.map(async (node: Node) => {
                        try {
                            const usageResponse = await fetch(`${import.meta.env.VITE_API_URL}/nodes/${node.id}?usage=true`);
                            if (usageResponse.ok) {
                                const usageData = await usageResponse.json();
                                return { ...node, usage: usageData.usage };
                            }
                            return node;
                        } catch (err) {
                            console.error(`Error fetching usage for node ${node.id}:`, err);
                            return node;
                        }
                    })
                );
                return { ...data, nodes: nodesWithUsage };
            }
            return data;
        },
    });

    // Mutation for adding a node
    const addNodeMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/nodes`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error(`Failed to add node: ${response.status}`);
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nodes'] });
            setNodeAdded(true);
            setAddMessage(`IPFS Node "${nodeName}" added successfully!`);
            setNodeName('');
            setNodeUrl('');
        },
        onError: (error) => {
            setAddMessage(error instanceof Error ? error.message : 'Failed to add node');
        },
    });

    // Mutation for deleting a node
    const deleteNodeMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/nodes/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Failed to delete node: ${response.status}`);
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['nodes'] });
        },
    });

    // Helper function to format storage values
    const formatStorage = (usage: string) => {
        try {
            const [used, total] = usage.split(',').map(Number);
            
            // Format bytes to appropriate units based on size
            const formatBytes = (bytes: number) => {
                if (bytes === 0) return '0 Bytes';
                
                const kilobytes = bytes / 1024;
                
                // If less than 1000KB, display in KB
                if (kilobytes < 1000) {
                    return kilobytes.toFixed(2) + ' KB';
                }
                
                // Otherwise display in MB
                const megabytes = kilobytes / 1024;
                return megabytes.toFixed(2) + ' MB';
            };
            
            const usedFormatted = formatBytes(used);
            const totalFormatted = formatBytes(total);
            
            // Calculate percentage with 2 decimal places
            let percentage = 0;
            if (total > 0) {
                percentage = (used / total) * 100;
            }
            
            return `${usedFormatted} / ${totalFormatted} (${percentage.toFixed(2)}%)`;
        } catch (error) {
            console.error('Error parsing usage data:', error);
            return usage; // Return raw value if parsing fails
        }
    };

    // Handle individual field changes with proper typing
    const handleNodeNameChange = (e: ChangeEvent<HTMLInputElement>) => setNodeName(e.target.value);
    const handleNodeUrlChange = (e: ChangeEvent<HTMLInputElement>) => setNodeUrl(e.target.value);

    // Handle form submission with proper typing
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setNodeAdded(false);
        setAddMessage('');

        const formData = new FormData();
        formData.append('name', nodeName);
        formData.append('url', nodeUrl);

        addNodeMutation.mutate(formData);
    };

    // Handle node deletion
    const handleDeleteNode = async (id: string) => {
        setDeletingNodeId(id);
        try {
            await deleteNodeMutation.mutateAsync(id);
        } finally {
            setDeletingNodeId(null);
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-6 text-white">Add IPFS Node</h1>
            <div className="mb-6">
                <NodeCount />
            </div>
            
            <div className="bg-black p-6 rounded-lg border border-gray-800">
                <h3 className="text-2xl font-semibold mb-6 text-gray-300">Add New Node</h3>
                
                {nodeAdded && (
                    <div className="mb-6 p-3 bg-green-900/30 border border-green-700 rounded-md">
                        <p className="text-green-400">{addMessage}</p>
                    </div>
                )}
                
                {addNodeMutation.isError && (
                    <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-md">
                        <p className="text-red-400">{addMessage}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-300 mb-2">Node Name</label>
                            <input
                                type="text"
                                value={nodeName}
                                onChange={handleNodeNameChange}
                                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                                placeholder="e.g. ipfs"
                                required
                                disabled={addNodeMutation.isPending}
                            />
                            <p className="text-xs text-gray-500 mt-1">This will be used as the Docker container name</p>
                        </div>
                        
                        <div>
                            <label className="block text-gray-300 mb-2">Node URL</label>
                            <input
                                type="text"
                                value={nodeUrl}
                                onChange={handleNodeUrlChange}
                                className="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                                placeholder="e.g. http://localhost:5001"
                                required
                                disabled={addNodeMutation.isPending}
                            />
                            <p className="text-xs text-gray-500 mt-1">The URL where the IPFS node is accessible</p>
                        </div>
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={addNodeMutation.isPending}
                        >
                            {addNodeMutation.isPending ? 'Adding Node...' : 'Add Node'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="mt-8 bg-black p-6 rounded-lg border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-300">Available Nodes</h3>
                    <button 
                        onClick={() => refetch()}
                        className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
                    >
                        Refresh
                    </button>
                </div>
                
                {error && (
                    <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-md">
                        <p className="text-red-400">{error instanceof Error ? error.message : 'An error occurred'}</p>
                    </div>
                )}
                
                {isLoading ? (
                    <div className="p-4 text-center text-gray-400">Loading nodes...</div>
                ) : data?.nodes?.length ? (
                    <div className="grid gap-4">
                        {data.nodes.map((node) => (
                            <div key={node.id} className="bg-gray-900 p-4 rounded-md border border-gray-800">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xl font-medium text-white">{node.name}</h4>
                                        <p className="text-gray-400 mt-1">{node.url}</p>
                                        <p className="text-xs text-gray-500 mt-1">Type: {node.type}</p>
                                        <p className="text-xs text-gray-500 mt-1">ID: {node.id}</p>
                                        {node.usage && (
                                            <div className="mt-2">
                                                <p className="text-xs text-gray-400">
                                                    <span className="font-semibold">Storage:</span> {formatStorage(node.usage)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleDeleteNode(node.id)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={node.id === '0' || deletingNodeId === node.id || deleteNodeMutation.isPending}
                                    >
                                        {deletingNodeId === node.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-400">No nodes available</div>
                )}
            </div>
        </div>
    );
} 