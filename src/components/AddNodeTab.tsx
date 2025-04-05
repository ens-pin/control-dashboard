'use client';
import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
import { NodeCount } from './NodeCount';
import { HostedUsers } from './HostedUsers';


interface Node {
    id: string;
    name: string;
    type: string;
    url: string;
    usage?: string;
}

export function AddNodeTab() {
    const [nodeName, setNodeName] = useState('');
    const [nodeUrl, setNodeUrl] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [nodeAdded, setNodeAdded] = useState(false);
    const [addMessage, setAddMessage] = useState('');
    const [nodes, setNodes] = useState<Node[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingNodeId, setDeletingNodeId] = useState<string | null>(null);

    // API routes
    const API_NODES_ROUTE = '/api/nodes';

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

    // Fetch all nodes on component mount
    useEffect(() => {
        fetchNodes();
    }, []);

    // Function to fetch all nodes
    const fetchNodes = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await fetch(API_NODES_ROUTE);
            if (!response.ok) {
                throw new Error(`Failed to fetch nodes: ${response.status}`);
            }
            const data = await response.json();
            // The API returns data in the format: { message: string, nodes: Node[] }
            if (data && data.nodes) {
                // Fetch usage data for each node
                const nodesWithUsage = await Promise.all(
                    data.nodes.map(async (node: Node) => {
                        try {
                            const usageResponse = await fetch(`${API_NODES_ROUTE}/${node.id}?usage=true`);
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
                setNodes(nodesWithUsage);
            } else {
                setNodes([]);
            }
            console.log(data);
        } catch (err) {
            console.error('Error fetching nodes:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle individual field changes with proper typing
    const handleNodeNameChange = (e: ChangeEvent<HTMLInputElement>) => setNodeName(e.target.value);
    const handleNodeUrlChange = (e: ChangeEvent<HTMLInputElement>) => setNodeUrl(e.target.value);

    // Handle form submission with proper typing
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsAdding(true);
        setAddMessage('');
        setNodeAdded(false);

        try {
            // Create FormData object to handle form submission
            const formData = new FormData();
            formData.append('name', nodeName);
            formData.append('url', nodeUrl);

            const response = await fetch(API_NODES_ROUTE, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to add node: ${response.status}`);
            }

            // const data = await response.json();
            setNodeAdded(true);
            setAddMessage(`IPFS Node "${nodeName}" added successfully!`);
            
            // Refresh the nodes list
            fetchNodes();
            
            // Clear the form
            setNodeName('');
            setNodeUrl('');
        } catch (err) {
            console.error('Error adding node:', err);
            setAddMessage(err instanceof Error ? err.message : 'Failed to add node');
        } finally {
            setIsAdding(false);
        }
    };

    // Handle node deletion
    const handleDeleteNode = async (id: string) => {
        setDeletingNodeId(id);
        setError(null);
        
        try {
            const response = await fetch(`${API_NODES_ROUTE}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Failed to delete node: ${response.status}`);
            }

            // Refresh the nodes list after deletion
            fetchNodes();
        } catch (err) {
            console.error('Error deleting node:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete node');
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
                <h3 className="text-2xl font-semibold mb-6 text-gray-300">Node Connection</h3>
                
                {nodeAdded && (
                    <div className="mb-6 p-3 bg-green-900/30 border border-green-700 rounded-md">
                        <p className="text-green-400">{addMessage}</p>
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
                                placeholder="e.g. my-ipfs-node"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">A friendly name for this IPFS node</p>
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
                            />
                            <p className="text-xs text-gray-500 mt-1">The API URL of the IPFS node</p>
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isAdding}
                            className={`px-6 py-3 rounded-md font-medium ${
                                isAdding
                                    ? 'bg-blue-800 text-blue-200 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {isAdding ? 'Adding Node...' : 'Add IPFS Node'}
                        </button>
                    </div>
                </form>
            </div>
            
            <div className="mt-8 bg-black p-6 rounded-lg border border-gray-800">
                <h3 className="text-2xl font-semibold mb-6 text-gray-300">Connection Info</h3>
                <div className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                    <pre className="text-gray-300 text-sm font-mono">
{`Node: ${nodeName || '[Name your node]'}
URL: ${nodeUrl || '[Enter node URL]'}`}
                    </pre>
                </div>
            </div>

            <div className="mt-8 bg-black p-6 rounded-lg border border-gray-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold text-gray-300">Available Nodes</h3>
                    <button 
                        onClick={fetchNodes}
                        className="px-4 py-2 text-sm bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
                    >
                        Refresh
                    </button>
                </div>
                
                {error && (
                    <div className="mb-6 p-3 bg-red-900/30 border border-red-700 rounded-md">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}
                
                {isLoading ? (
                    <div className="p-4 text-center text-gray-400">Loading nodes...</div>
                ) : nodes.length > 0 ? (
                    <div className="grid gap-4">
                        {nodes.map((node) => (
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
                                    <div className="flex flex-col space-y-2">
                                        <div className="bg-green-900/30 px-2 py-1 rounded text-xs text-green-400">
                                            Connected
                                        </div>
                                        <button
                                            onClick={() => handleDeleteNode(node.id)}
                                            disabled={deletingNodeId === node.id}
                                            className={`px-2 py-1 rounded text-xs ${
                                                deletingNodeId === node.id
                                                    ? 'bg-red-900/30 text-red-300 cursor-not-allowed'
                                                    : 'bg-red-900/30 text-red-400 hover:bg-red-800/40'
                                            }`}
                                        >
                                            {deletingNodeId === node.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-400">No nodes found. Add your first IPFS node above.</div>
                )}
            </div>
            
            <HostedUsers />
        </div>
    );
} 